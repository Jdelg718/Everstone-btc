import { NextResponse } from 'next/server';
import { checkPaymentStatus } from '../../../../../lib/payment';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const result = await checkPaymentStatus(id);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
}
