'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

interface Memorial {
    id: string;
    slug: string;
    fullName: string;
    birthDate: string;
    deathDate: string;
    epitaph: string;
    bio: string;
    mainImage: string;
    gallery: string; // JSON string
    status: string;
    createdAt: string;
}

export default function DraftMemorial() {
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [memorial, setMemorial] = useState<Memorial | null>(null);

    useEffect(() => {
        if (!slug) return;
        fetchMemorial(slug);
    }, [slug]);

    const fetchMemorial = async (s: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/memorials/${s}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error('Memorial not found');
                throw new Error('Failed to load memorial');
            }
            const data = await res.json();
            setMemorial(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[var(--accent-gold)] animate-spin mb-4" />
                <p className="text-[var(--accent-gold)] font-mono text-sm tracking-wider uppercase">Loading Draft...</p>
            </div>
        );
    }

    if (error || !memorial) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                <h1 className="text-3xl font-serif text-yellow-400 mb-2">Draft Not Found</h1>
                <p className="text-slate-400 max-w-md">{error || 'The requested memorial could not be found.'}</p>
                <button
                    className="mt-8 px-6 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
                    onClick={() => window.location.href = '/create'}
                >
                    Create New
                </button>
            </div>
        );
    }

    // Parse gallery if it's a string
    let galleryImages: string[] = [];
    try {
        galleryImages = JSON.parse(memorial.gallery || '[]');
    } catch (e) {
        console.warn('Failed to parse gallery JSON', e);
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[var(--accent-gold)] selection:text-slate-900">
            {/* Draft Header */}
            <div className="bg-slate-900 border-b border-yellow-900/30 py-3 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 border border-yellow-500/50 flex items-center justify-center transform rotate-45">
                        <span className="transform -rotate-45 text-yellow-500 font-bold text-xs">E</span>
                    </div>
                    <span className="font-serif ml-2 hidden sm:block text-slate-300">Everstone Viewer</span>
                </div>

                <div className="flex items-center gap-3 bg-yellow-900/20 border border-yellow-700/50 px-4 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider leading-none">
                        Draft Preview
                    </span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                {memorial.mainImage && (
                    <>
                        <img
                            src={memorial.mainImage}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            alt="Main Memorial"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    </>
                )}

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-center text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                        {memorial.fullName}
                    </h1>
                    <div className="flex items-center gap-4 text-xl md:text-2xl text-[var(--accent-gold)] font-light tracking-widest font-serif">
                        <span>{memorial.birthDate}</span>
                        <span className="text-xs">✦</span>
                        <span>{memorial.deathDate}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto px-6 py-16">
                <blockquote className="text-2xl md:text-3xl font-serif text-center italic text-slate-300 mb-16 leading-relaxed">
                    "{memorial.epitaph}"
                </blockquote>

                <div className="prose prose-invert prose-lg mx-auto text-slate-400 leading-loose whitespace-pre-wrap">
                    <p>{memorial.bio}</p>
                </div>

                {/* Gallery Grid */}
                {galleryImages.length > 0 && (
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {galleryImages.map((img: string, idx: number) => (
                            <div key={idx} className="aspect-square relative overflow-hidden rounded-lg bg-slate-900 group">
                                <img
                                    src={img}
                                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    alt={`Gallery ${idx + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Call to Action */}
            <div className="bg-slate-900 border-t border-slate-800 py-12 px-6 mt-12 text-center">
                <h3 className="text-slate-400 font-serif text-lg mb-4">This is a draft preview</h3>
                <p className="text-slate-500 max-w-lg mx-auto mb-8">
                    To make this memorial permanent and immutable, you will need to anchor it to the Bitcoin blockchain.
                </p>

                <button
                    onClick={async () => {
                        const btn = document.getElementById('anchor-btn') as HTMLButtonElement;
                        if (btn) btn.disabled = true;
                        try {
                            const res = await fetch(`/api/memorials/${slug}/anchor`, { method: 'POST' });
                            const data = await res.json();
                            if (data.txid) {
                                window.location.href = `/view/${data.txid}`;
                            } else {
                                alert('Failed to anchor: ' + (data.error || 'Unknown error'));
                                if (btn) btn.disabled = false;
                            }
                        } catch (e) {
                            alert('Error anchoring');
                            if (btn) btn.disabled = false;
                        }
                    }}
                    id="anchor-btn"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent-gold)] text-slate-900 font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Anchor to Bitcoin (Simnet)
                </button>
            </div>
        </div>
    );
}
