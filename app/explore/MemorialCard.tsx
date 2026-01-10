'use client';

import Link from 'next/link';
import { Memorial } from '@prisma/client';

interface MemorialCardProps {
    memorial: Memorial;
}

export default function MemorialCard({ memorial }: MemorialCardProps) {
    return (
        <Link href={`/m/${memorial.slug}`} className="block group">
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

                    {/* Block Height & Transaction ID Badge */}
                    {memorial.txid && (
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 pt-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col gap-1 text-xs font-mono">
                                {memorial.blockHeight && (
                                    <a
                                        href={`https://mempool.space/block/${memorial.blockHeight}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors w-fit"
                                    >
                                        <span className="text-[10px]">🔗</span>
                                        <span className="font-semibold">Block #{memorial.blockHeight.toLocaleString()}</span>
                                    </a>
                                )}
                                <a
                                    href={`https://mempool.space/tx/${memorial.txid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors w-fit"
                                    title={memorial.txid}
                                >
                                    <span className="text-stone-500">TX:</span>
                                    <span className="truncate">
                                        {memorial.txid.slice(0, 8)}...{memorial.txid.slice(-6)}
                                    </span>
                                </a>
                            </div>
                        </div>
                    )}
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
    );
}
