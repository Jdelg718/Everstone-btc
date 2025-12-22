// lib/btcpay.ts

export interface BTCPayInvoice {
    id: string;
    checkoutLink: string;
    status: 'New' | 'Processing' | 'Settled' | 'Invalid' | 'Expired';
    amount: string;
    currency: string;
    receiptLink: string;
}

const BTCPAY_URL = process.env.BTCPAY_URL; // e.g. https://mainnet.demo.btcpayserver.org
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;

/**
 * Creates an invoice on your BTCPay Server.
 * Falls back to MOCK implementation if ENV vars are not set.
 */
export async function createInvoice(price: number, currency: string = 'USD', orderId: string): Promise<BTCPayInvoice> {
    // FALLBACK: If no real BTCPay config, use Data Mock
    if (!BTCPAY_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
        console.warn("⚠️ BTCPay Config missing. Using MOCK invoice.");
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            id: `mock_inv_${Math.random().toString(36).substring(7)} `,
            checkoutLink: `#`, // UX should handle this
            status: 'New',
            amount: price.toString(),
            currency: currency,
            receiptLink: `#`
        };
    }

    // REAL: Call BTCPay Verification API
    try {
        const res = await fetch(`${BTCPAY_URL} /api/v1 / stores / ${BTCPAY_STORE_ID}/invoices`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${BTCPAY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: price,
                currency: currency,
                metadata: {
                    orderId: orderId
                },
                checkout: {
                    speedPolicy: "MediumSpeed"
                }
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`BTCPay Error: ${res.status} ${errText}`);
        }

        const data = await res.json();
        return {
            id: data.id,
            checkoutLink: data.checkoutLink,
            status: data.status,
            amount: data.amount,
            currency: data.currency,
            receiptLink: data.receiptLink
        };
    } catch (e) {
        console.error("Failed to create BTCPay invoice:", e);
        throw e;
    }
}

export async function getInvoiceStatus(invoiceId: string): Promise<string> {
    if (!BTCPAY_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
        return 'New'; // Mock always New or implement mock state toggle if needed
    }

    const res = await fetch(`${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices/${invoiceId}`, {
        headers: {
            'Authorization': `token ${BTCPAY_API_KEY}`
        }
    });

    if (res.ok) {
        const data = await res.json();
        return data.status;
    }
    return 'Invalid';
}

export async function getPaymentAddressForInvoice(invoiceId: string): Promise<string> {
    // In a real app, you would fetch payment methods of the invoice
    // GET /api/v1/stores/{storeId}/invoices/{invoiceId}/payment-methods
    // This is significant logic to parse the BTC address.
    // For now, we return a mock or placeholder.
    return "tb1qk2...REAL_IMPL_NEEDED";
}

