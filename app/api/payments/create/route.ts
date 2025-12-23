import { NextResponse } from 'next/server';
import { createInvoice } from '../../../../lib/payment';
import { getNetworkFees } from '@/lib/fees';

export async function POST(request: Request) {
    try {
        const { memorialId, anchoringPriority } = await request.json();

        // 1. Get Network Fees
        const feeRates = await getNetworkFees();
        // 2. Calculate TX Cost in Sats
        // Default to 'standard' if not provided
        const priority = anchoringPriority || 'standard';
        // Map priority to fee rate field
        let rate = feeRates.hourFee;
        if (priority === 'fastest') rate = feeRates.fastestFee;
        else if (priority === 'fast') rate = feeRates.halfHourFee;
        else if (priority === 'standard') rate = feeRates.hourFee;

        const VBYTES = 250;
        const metaFeeSats = rate * VBYTES;

        // 3. Fetch BTC Price to convert sats to USD
        // For MVP, hardcode or fetch. Let's try to fetch, fallback to $100k
        let btcPrice = 100000;
        try {
            const priceRes = await fetch('https://mempool.space/api/v1/prices');
            const priceData = await priceRes.json();
            btcPrice = priceData.USD;
        } catch (e) {
            console.warn('Failed to fetch BTC price, using default');
        }

        const networkFeeUSD = (metaFeeSats / 100_000_000) * btcPrice;

        // Base Fee: $100
        const baseFeeUSD = 100;

        // Total in Cents
        const totalCents = Math.ceil((baseFeeUSD + networkFeeUSD) * 100);

        const invoice = await createInvoice({
            memorialId,
            amount: totalCents
        });

        // Add metadata to response for frontend to see breakdown if needed
        return NextResponse.json({
            ...invoice,
            breakdown: {
                baseFeeUSD,
                networkFeeUSD,
                sats: metaFeeSats,
                rate
            }
        });
    } catch (error) {
        console.error('Payment creation error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
