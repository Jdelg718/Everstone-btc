// lib/btcpay.ts
import { Agent } from 'undici';

// Custom dispatcher to ignore self-signed certs for local node
const dispatcher = new Agent({
    connect: {
        rejectUnauthorized: false
    }
});

export interface BTCPayInvoice {
    id: string;
    checkoutLink: string;
    status: 'New' | 'Processing' | 'Settled' | 'Invalid' | 'Expired';
    receiptLink: string;
    amount: string;
    currency: string;
}

/**
 * Creates an invoice on your BTCPay Server.
 */
export async function createInvoice(price: number, currency: string = 'USD', orderId: string): Promise<BTCPayInvoice> {
    const BTCPAY_URL = process.env.BTCPAY_URL;
    const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;
    const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;

    if (!BTCPAY_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
        throw new Error("BTCPay Config Missing");
    }

    try {
        const baseUrl = BTCPAY_URL.replace(/\/$/, '');
        const url = `${baseUrl}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`;
        console.log("Creating real invoice at:", url);

        // @ts-ignore - 'dispatcher' is supported in Next.js/Node fetch but Types might not match perfectly
        const res = await fetch(url, {
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
                    speedPolicy: "MediumSpeed",
                    // Ensure we redirect back or have some navigation? 
                    // For now default BTCPay behavior.
                }
            }),
            dispatcher: dispatcher // Use custom dispatcher for SSL
        } as any);

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
    const BTCPAY_URL = process.env.BTCPAY_URL;
    const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;
    const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;

    if (!BTCPAY_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
        return 'Invalid';
    }

    const baseUrl = (BTCPAY_URL || '').replace(/\/$/, '');
    // @ts-ignore
    const res = await fetch(`${baseUrl}/api/v1/stores/${BTCPAY_STORE_ID}/invoices/${invoiceId}`, {
        headers: {
            'Authorization': `token ${BTCPAY_API_KEY}`
        },
        dispatcher: dispatcher
    } as any);

    if (res.ok) {
        const data = await res.json();
        return data.status;
    } else {
        const err = await res.text();
        console.error(`Status check failed: ${res.status} ${err}`);
        return 'Invalid';
    }
}

export async function getPaymentAddressForInvoice(invoiceId: string): Promise<string> {
    // In a real app, you would fetch payment methods of the invoice
    // GET /api/v1/stores/{storeId}/invoices/{invoiceId}/payment-methods
    return "tb1qk2...REAL_IMPL_NEEDED";
}

export async function broadcastTx(txHex: string): Promise<string> {
    const BTCPAY_URL = process.env.BTCPAY_URL;
    // MyNode Mempool is often at port 4080 (HTTPS) or 3006 (HTTP)
    // We can try to guess from BTCPay URL or just use a list
    const candidates = [
        `https://mynode.local:4080/api/tx`,
        `http://mynode.local:3006/api/tx`,
        `https://mempool.space/testnet/api/tx` // Fallback
    ];

    for (const url of candidates) {
        try {
            console.log(`Broadcasting to ${url}...`);
            // @ts-ignore
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: txHex,
                dispatcher: dispatcher // Reuse our SSL-ignoring agent
            } as any);

            if (res.ok) {
                const txid = await res.text();
                return txid;
            } else {
                console.warn(`Broadcast to ${url} failed:`, await res.text());
            }
        } catch (e) {
            console.warn(`Broadcast to ${url} error:`, e);
        }
    }
    throw new Error('Failed to broadcast transaction to any node.');
}
