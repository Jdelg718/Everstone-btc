import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';

export type PaymentRequest = {
    memorialId: string;
    amount: number; // in cents
};

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export async function createInvoice(request: PaymentRequest) {
    // 1. Create Payment Record
    const payment = await prisma.payment.create({
        data: {
            memorialId: request.memorialId,
            amount: request.amount,
            currency: 'USD',
            status: 'PENDING',
            providerId: `mock_inv_${uuidv4()}`
        }
    });

    // 2. Return Invoice Details (Simulated)
    return {
        invoiceId: payment.id,
        providerId: payment.providerId,
        amount: payment.amount,
        checkoutUrl: `/pay/${payment.id}` // In real app, this would be Stripe/BTCPay URL
    };
}

export async function checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { memorial: true }
    });

    if (!payment) throw new Error('Payment not found');

    // MOCK LOGIC: If it's been > 10 seconds, mark as paid
    // In reality, this would check Stripe/BTCPay API
    if (payment.status === 'PENDING') {
        // Auto-complete for demo purposes
        // Update both Payment and Memorial status
        await prisma.$transaction([
            prisma.payment.update({
                where: { id: paymentId },
                data: { status: 'COMPLETED' }
            }),
            prisma.memorial.update({
                where: { id: payment.memorialId },
                data: { paymentStatus: 'PAID' }
            })
        ]);
        return 'COMPLETED';
    }

    return payment.status as PaymentStatus;
}
