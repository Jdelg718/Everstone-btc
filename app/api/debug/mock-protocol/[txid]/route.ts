import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import crypto from 'crypto';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ txid: string }> }
) {
    try {
        const txid = (await params).txid;

        if (!txid.startsWith('mock-')) {
            return NextResponse.json({ error: 'Not a mock transaction' }, { status: 400 });
        }

        const memorial = await prisma.memorial.findUnique({
            where: { txid }
        });

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Reconstruct the Protocol Object structure
        const gallery = JSON.parse(memorial.gallery || '[]');

        // Mock Assets Map:
        // The viewer expects 'assets' to contain Blob URLs or usable paths.
        // Since we are using standard web URLs (mocking IPFS), we just map the URL to itself.
        const assets: Record<string, string> = {};
        if (memorial.mainImage) assets[memorial.mainImage] = memorial.mainImage;
        gallery.forEach((img: string) => assets[img] = img);

        const metadata = {
            subject: {
                fullName: memorial.fullName,
                birthDate: memorial.birthDate,
                deathDate: memorial.deathDate,
                epitaph: memorial.epitaph
            },
            content: {
                bioMarkdown: memorial.bio,
                mainImage: memorial.mainImage,
                gallery: gallery
            }
        };

        // Create a fake hash for verification simulation
        // In the viewer, we will force-verify if it's a mock ID, or we can actually hash this JSON.
        // Let's return a hash of the metadata to be consistent.
        const contentHash = crypto.createHash('sha256').update(JSON.stringify(metadata)).digest('hex');

        return NextResponse.json({
            contentHash,
            blockTime: Math.floor(memorial.createdAt.getTime() / 1000), // Use creation time as "block time"
            metadata,
            assets
        });

    } catch (error) {
        console.error('Error serving mock protocol:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
