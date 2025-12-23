
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import MemorialClient, { Memorial } from './MemorialClient';

// Force dynamic rendering if not using generateStaticParams (which we aren't yet for all memorials)
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getMemorial(slug: string) {
    const memorial = await prisma.memorial.findUnique({
        where: { slug },
    });
    return memorial;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const memorial = await getMemorial(slug);

    if (!memorial) {
        return {
            title: 'Memorial Not Found - Everstone',
        };
    }

    return {
        title: `${memorial.fullName} - Everstone Memorial`,
        description: memorial.epitaph || `A tribute to ${memorial.fullName} anchored on Bitcoin.`,
        openGraph: {
            title: `${memorial.fullName} - Everstone Memorial`,
            description: memorial.epitaph || `A tribute to ${memorial.fullName} anchored on Bitcoin.`,
            images: memorial.mainImage ? [memorial.mainImage] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${memorial.fullName} - Everstone Memorial`,
            description: memorial.epitaph || `A tribute to ${memorial.fullName} anchored on Bitcoin.`,
            images: memorial.mainImage ? [memorial.mainImage] : [],
        },
    };
}

export default async function MemorialPage({ params }: PageProps) {
    const { slug } = await params;
    const memorial = await getMemorial(slug);

    if (!memorial) {
        notFound();
    }

    // Convert Date objects to strings for Client Component serialization
    const clientMemorial: Memorial = {
        ...memorial,
        createdAt: memorial.createdAt.toISOString(),
        updatedAt: memorial.updatedAt.toISOString(), // Assuming updatedAt exists in Prisma model but not in Client interface, but spread handles it. 
        // We explicitly cast or format to match Client Interface if strict.
        // The Client Interface expects ISO strings for dates which simple spread of Prisma object (Date) might fail if passed directly to client component in older Next.js, but newer handles it.
        // Safest is to explicitly stringify dates.
    } as unknown as Memorial; // Rough casting to satisfy the specific interface match

    return <MemorialClient initialMemorial={clientMemorial} />;
}
