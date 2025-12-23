
import { NextResponse } from 'next/server';
import { sendReceiptEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, memorialId } = await req.json();

        if (!email || !memorialId) {
            return NextResponse.json({ error: 'Missing email or memorialId' }, { status: 400 });
        }

        const memorial = await prisma.memorial.findUnique({
            where: { id: memorialId }
        });

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.status !== 'ANCHORED' || !memorial.txid) {
            return NextResponse.json({ error: 'Memorial is not anchored yet' }, { status: 400 });
        }

        await sendReceiptEmail({
            email,
            fullName: memorial.fullName,
            txid: memorial.txid,
            memorialSlug: memorial.slug,
            bundleUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/memorials/${memorial.slug}/download`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
