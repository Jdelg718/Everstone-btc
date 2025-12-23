import { NextResponse } from 'next/server';
import { broadcastTx } from '@/lib/btcpay';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { signedTxHex, memorialId } = body;

        if (!signedTxHex || !memorialId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Broadcast
        const txid = await broadcastTx(signedTxHex);

        // 2. Update Memorial Status
        await prisma.memorial.update({
            where: { id: memorialId },
            data: {
                status: 'ANCHORED',
                paymentStatus: 'PAID', // It's paid via the TX
                txid: txid
            }
        });

        return NextResponse.json({ txid });

    } catch (error) {
        console.error('Broadcast error:', error);
        return NextResponse.json({
            error: 'Broadcast Failed',
            details: String(error)
        }, { status: 500 });
    }
}
