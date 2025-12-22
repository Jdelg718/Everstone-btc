import { NextResponse } from 'next/server';
import { createInvoice } from '../../../../lib/payment';

export async function POST(request: Request) {
    try {
        const { memorialId } = await request.json();

        // Fee is hardcoded for MVP: $100 (10000 cents)
        const invoice = await createInvoice({
            memorialId,
            amount: 10000
        });

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Payment creation error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
