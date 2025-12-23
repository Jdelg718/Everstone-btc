import { NextResponse } from 'next/server';
import { createMemorialPsbt, Utxo } from '@/lib/anchoring';
import { getNetworkFees } from '@/lib/fees';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userAddress, utxos, memorialId } = body;

        if (!userAddress || !utxos || !memorialId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Get current fees/price
        // In real app, calculate dynamic component (Service Fee $100 -> Sats)
        // For MVP, lets default service fee to 100,000 sats (~$100 at $100k BTC)
        const SERVICE_FEE_SATS = 100000;

        // Treasury Address (Where we receive the $100)
        // Use a testnet address for now or env var
        const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'; // Valid Testnet Address

        // 2. Create PSBT
        const psbtBase64 = await createMemorialPsbt(
            userAddress,
            utxos,
            memorialId,
            SERVICE_FEE_SATS,
            TREASURY_ADDRESS
        );

        return NextResponse.json({
            psbt: psbtBase64,
            feeSats: SERVICE_FEE_SATS
        });

    } catch (error) {
        console.error('Error creating anchoring proposal:', error);
        return NextResponse.json({
            error: 'Internal Error',
            details: String(error)
        }, { status: 500 });
    }
}
