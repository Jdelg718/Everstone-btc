
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering so we see new memorials immediately
export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
    // Fetch memorials that are public (Anchored or Pending/Paid)
    const memorials = await prisma.memorial.findMany({
        where: {
            OR: [
                { status: 'ANCHORED' },
                { status: 'PENDING' },
                // Also include paid drafts for testing if needed, or just rely on the manual update we did
                { paymentStatus: 'PAID' }
            ]
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 font-sans p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" /> Return Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">Memorial Archives</h1>
                        <p className="text-stone-400 mt-2 text-lg">
                            Immutable tributes anchored to the Bitcoin blockchain.
                        </p>
                    </div>
                </header>

                {memorials.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-stone-800 rounded-2xl bg-stone-900/30">
                        <p className="text-stone-500 text-xl italic mb-4">The archives are waiting for the first block.</p>
                        <Link href="/create" className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-medium transition-colors">
                            Create a Tribute
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {memorials.map((memorial) => (
                            <Link href={`/m/${memorial.slug}`} key={memorial.id} className="block group">
                                <article className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 h-full flex flex-col">
                                    <div className="aspect-[4/3] bg-stone-800 relative overflow-hidden">
                                        {memorial.mainImage ? (
                                            <img
                                                src={memorial.mainImage}
                                                alt={memorial.fullName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-600">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-mono text-amber-500 border border-amber-500/20">
                                            {memorial.status}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
                                            {memorial.fullName}
                                        </h2>
                                        <div className="text-stone-500 text-sm mb-4 font-mono">
                                            {memorial.birthDate} — {memorial.deathDate}
                                        </div>
                                        <p className="text-stone-400 line-clamp-3 italic mb-4 flex-grow">
                                            "{memorial.epitaph}"
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-stone-800 flex justify-between items-center text-xs text-stone-500 lowercase font-mono">
                                            <span>{new Date(memorial.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                View Tribute &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
