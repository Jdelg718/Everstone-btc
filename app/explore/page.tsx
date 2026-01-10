
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import MemorialCard from './MemorialCard';

// Force dynamic rendering so we see new memorials immediately
export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
    // Fetch memorials that are public (Anchored or Pending/Paid)
    const memorials = await prisma.memorial.findMany({
        where: {
            isPublic: true,
            // Only show completed or pending (not draft)
            OR: [
                { status: 'ANCHORED' },
                { status: 'PENDING' },
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
                            <MemorialCard key={memorial.id} memorial={memorial} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
