import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> } // params is a Promise in Next.js 15+
) {
    try {
        const slug = (await params).slug;

        const memorial = await prisma.memorial.findUnique({
            where: { slug },
        });

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        return NextResponse.json(memorial);
    } catch (error) {
        console.error('Error fetching memorial:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
