import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { generateMemorialPackage } from '../../../../../lib/packaging';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const slugOrId = (await params).slug;
        const memorial = await prisma.memorial.findFirst({
            where: {
                OR: [
                    { slug: slugOrId },
                    { id: slugOrId }
                ]
            }
        });

        if (!memorial) {
            return new NextResponse('Memorial not found', { status: 404 });
        }

        const zipBuffer = await generateMemorialPackage(memorial);

        return new NextResponse(zipBuffer as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="memorial-${memorial.slug}.zip"`
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
