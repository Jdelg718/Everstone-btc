import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const slug = (await params).slug;

        // 1. Generate a "Mock" Transaction ID
        // In reality, this would be the result of a Bitcoin transaction broadcasting our protocol payload
        const txid = `mock-${crypto.randomUUID().replace(/-/g, '')}`;

        // 2. Update Memorial Status
        const memorial = await prisma.memorial.update({
            where: { slug },
            data: {
                status: 'ANCHORED',
                txid: txid,
                // In a real app, we might also save the IPFS hash here if we uploaded it
            }
        });

        return NextResponse.json({
            success: true,
            txid,
            status: 'ANCHORED',
            message: 'Memorial successfully anchored to Simnet'
        });

    } catch (error) {
        console.error('Error anchoring memorial:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
