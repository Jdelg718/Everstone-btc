import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Simple slugify fallback if not in protocol.ts
const simpleSlugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, birthDate, deathDate, epitaph, bio, mainImage, gallery } = body;

        // Basic validation
        if (!fullName || !birthDate || !deathDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate slug
        let slug = simpleSlugify(fullName);
        // Ensure uniqueness (simple append random string if needed, or rely on catch)
        // For MVP, we'll try to append a random buffer if it exists or let it fail
        const existing = await prisma.memorial.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Math.random().toString(36).substring(7)}`;
        }

        const memorial = await prisma.memorial.create({
            data: {
                slug,
                fullName,
                birthDate,
                deathDate,
                epitaph: epitaph || '',
                bio: bio || '',
                mainImage: mainImage || '',
                gallery: JSON.stringify(gallery || []), // storing as JSON string
                status: 'DRAFT',
            },
        });

        return NextResponse.json(memorial, { status: 201 });
    } catch (error) {
        console.error('Error creating memorial:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const memorials = await prisma.memorial.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(memorials);
    } catch (error) {
        console.error('Error fetching memorials:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
