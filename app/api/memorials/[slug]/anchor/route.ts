import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { sendReceiptEmail } from '@/lib/email';

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
            }
        });

        // 3. Send Receipt Email (if email exists)
        if (memorial.email) {
            try {
                await sendReceiptEmail({
                    email: memorial.email,
                    fullName: memorial.fullName,
                    txid: txid,
                    memorialSlug: memorial.slug,
                    bundleUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/memorials/${memorial.slug}/download`
                });
                console.log(`Email receipt sent to ${memorial.email}`);
            } catch (emailError) {
                console.error('Failed to send email receipt:', emailError);
                // Don't fail the request if email fails
            }
        }

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
