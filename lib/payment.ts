import { prisma } from './prisma';
import { createInvoice as createBtcPayInvoice, getInvoiceStatus as getBtcPayStatus } from './btcpay';
import { anchorMemorial } from './anchoring';

export type PaymentRequest = {
    memorialId: string;
    amount: number; // in cents
};

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export async function createInvoice(request: PaymentRequest) {
    // 1. Create Invoice via BTCPay (or mock if config missing)
    // We use the memorialId as the orderId for correlation
    // BTCPay expects amount in standard units (e.g. Dollars), but our internal app uses cents.
    const btcPayInvoice = await createBtcPayInvoice(request.amount / 100, 'USD', request.memorialId);

    // 2. Create Payment Record in our DB
    const payment = await prisma.payment.create({
        data: {
            memorialId: request.memorialId,
            amount: request.amount,
            currency: 'USD',
            status: 'PENDING',
            providerId: btcPayInvoice.id
        }
    });

    // 3. Return Invoice Details
    return {
        invoiceId: payment.id,
        providerId: payment.providerId,
        amount: payment.amount,
        checkoutUrl: btcPayInvoice.checkoutLink
    };
}

export async function checkPaymentStatus(paymentId: string): Promise<{ status: PaymentStatus, txid?: string }> {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { memorial: true }
    });

    if (!payment) throw new Error('Payment not found');

    // If already completed in DB, return it (with TXID if available)
    if (payment.status === 'COMPLETED') {
        return {
            status: 'COMPLETED',
            txid: payment.memorial.txid || undefined
        };
    }

    if (!payment.providerId) {
        return { status: payment.status as PaymentStatus };
    }

    // Always check real status from BTCPay
    const btcPayStatus = await getBtcPayStatus(payment.providerId);

    let newStatus: PaymentStatus = 'PENDING';

    // Map BTCPay status to our internal status
    console.log(`[Payment] Mapping BTCPay status: ${btcPayStatus}`);
    switch (btcPayStatus) {
        case 'Settled':
        case 'Processing':
        case 'Paid':
            newStatus = 'COMPLETED';
            break;
        case 'Invalid':
        case 'Expired':
            newStatus = 'FAILED';
            break;
        default:
            newStatus = 'PENDING';
    }

    // If status changed to COMPLETED, update DB and Anchor
    if (newStatus === 'COMPLETED' && payment.status !== 'COMPLETED') {
        const txid = await anchorMemorial(payment.memorialId);

        await prisma.$transaction([
            prisma.payment.update({
                where: { id: paymentId },
                data: { status: 'COMPLETED' }
            }),
            prisma.memorial.update({
                where: { id: payment.memorialId },
                data: {
                    paymentStatus: 'PAID',
                    status: 'ANCHORED',
                    txid: txid,
                    isPublic: true
                }
            })
        ]);
        return { status: 'COMPLETED', txid };
    }

    // If FAILED, update DB but don't anchor
    if (newStatus === 'FAILED' && payment.status !== 'FAILED') {
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'FAILED' }
        });
        return { status: 'FAILED' };
    }

    return { status: newStatus };
}
