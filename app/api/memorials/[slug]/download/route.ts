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

        // HOTFIX: Inject content for Claude Shannon (Force Overwrite to correct DB data)
        if (memorial.id === 'cmjjb9d1e0000zwsyrnp5fxkv') {
            console.log("Applying Hotfix for Shannon data...");
            memorial.bio = `Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, and cryptographer known as "the father of information theory". Shannon is noted for having founded information theory with a landmark paper, "A Mathematical Theory of Communication", that he published in 1948. He is also well known for founding digital circuit design theory in 1937, when—as a 21-year-old master's degree student at the Massachusetts Institute of Technology (MIT)—he wrote his thesis demonstrating that electrical applications of boolean algebra could construct any logical numerical relationship.`;
            memorial.epitaph = "He proved that information has structure — and that secrecy can be measured.";
            memorial.mainImage = "https://upload.wikimedia.org/wikipedia/commons/9/99/Claude_Shannon_MFO_3807.jpg";
            memorial.gallery = JSON.stringify([
                "https://upload.wikimedia.org/wikipedia/commons/c/c8/Claude_Shannon_1.jpg",
                "https://upload.wikimedia.org/wikipedia/commons/f/f6/Claude_Shannon_statue.jpg"
            ]);
            // Regeneration with fixed data
            return new NextResponse(await generateMemorialPackage(memorial) as any, {
                headers: {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': `attachment; filename="memorial-${memorial.slug}.zip"`
                }
            });
        }

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
