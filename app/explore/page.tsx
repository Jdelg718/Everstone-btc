'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExplorePage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-5xl font-bold text-white font-serif mb-6">Explore Memorials</h1>
            <p className="text-stone-400 max-w-lg mb-10 text-lg">
                The archive of decentralized tributes is growing.
                <br />
                Browse the latest immutable memories anchored to the blockchain.
            </p>

            <div className="p-8 border border-dashed border-stone-800 rounded-2xl bg-stone-900/30 mb-8">
                <p className="text-stone-500 italic">"Explore feed coming soon in v1.1"</p>
            </div>

            <Link href="/" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Return Home
            </Link>
        </div>
    );
}
