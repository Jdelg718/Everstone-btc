
import { NextResponse } from 'next/server';
import { getNetworkFees, calculateTxCosts } from '@/lib/fees';

export async function GET() {
    try {
        const rates = await getNetworkFees();
        const costs = calculateTxCosts(rates);

        return NextResponse.json({
            rates,
            costs
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fees' }, { status: 500 });
    }
}
