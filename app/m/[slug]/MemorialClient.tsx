'use client';

import { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Memorial {
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
    // Add missing fields for TS
    paymentStatus?: string;
    txid?: string | null;
    blockHeight?: number | null;
}

interface MemorialClientProps {
    initialMemorial: Memorial;
}

export default function MemorialClient({ initialMemorial }: MemorialClientProps) {
    const [memorial, setMemorial] = useState<Memorial>(initialMemorial);
    const router = useRouter();

    // Parse gallery if it's a string
    let galleryImages: string[] = [];
    try {
        galleryImages = JSON.parse(memorial.gallery || '[]');
    } catch (e) {
        console.warn('Failed to parse gallery JSON', e);
    }

    const isAnchored = memorial.status === 'ANCHORED';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[var(--accent-gold)] selection:text-slate-900">
            {/* Header removed (handled by layout) */}

            {/* Hero Section */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                {memorial.mainImage && (
                    <>
                        <img
                            src={memorial.mainImage}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            alt="Main Memorial"
                            referrerPolicy="no-referrer"
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
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Call to Action */}
            <div className="bg-slate-900 border-t border-slate-800 py-12 px-6 mt-12 text-center">
                {isAnchored ? (
                    <>
                        <h3 className="text-green-400 font-serif text-lg mb-4">This memorial is permanently anchored</h3>
                        <p className="text-slate-500 max-w-lg mx-auto mb-6">
                            It has been cryptographically secured on the Bitcoin blockchain using the Everstone Protocol.
                        </p>

                        {/* Blockchain Verification Badge */}
                        {memorial.txid && (
                            <div className="max-w-2xl mx-auto mb-8 border border-green-500/30 bg-slate-800/50 rounded-lg p-6">
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400">🔗 Block</span>
                                        {memorial.blockHeight ? (
                                            <a
                                                href={`https://mempool.space/block/${memorial.blockHeight}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-400 font-mono font-bold hover:text-green-300 transition-colors"
                                            >
                                                #{memorial.blockHeight.toLocaleString()}
                                            </a>
                                        ) : (
                                            <span className="text-slate-500 font-mono">Pending...</span>
                                        )}
                                    </div>
                                    <span className="text-slate-600 hidden md:inline">•</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400">TX:</span>
                                        <a
                                            href={`https://mempool.space/tx/${memorial.txid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-400 font-mono text-xs hover:text-green-300 transition-colors"
                                            title={memorial.txid}
                                        >
                                            {memorial.txid.slice(0, 6)}...{memorial.txid.slice(-6)} ↗
                                        </a>
                                    </div>
                                </div>
                                {memorial.blockHeight && (
                                    <div className="mt-3 text-xs text-slate-500">
                                        Verified on Bitcoin blockchain
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 mb-8">
                            <a
                                href={`/view/${memorial.txid || ''}`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-800 text-green-400 border border-green-500/30 font-bold rounded hover:bg-slate-700 transition-colors"
                            >
                                <ShieldCheck className="w-5 h-5" />
                                View Verification
                            </a>

                            <a
                                href={`/api/memorials/${memorial.slug}/download`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--accent-gold)] text-slate-900 font-bold rounded hover:bg-yellow-500 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download Offline Bundle
                            </a>
                        </div>

                        <div className="max-w-md mx-auto pt-8 border-t border-slate-800">
                            <h4 className="text-slate-400 font-serif mb-4">Email Receipt</h4>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                                    const btn = form.querySelector('button') as HTMLButtonElement;
                                    const msg = document.getElementById('email-msg');

                                    if (!emailInput.value) return;

                                    btn.disabled = true;
                                    btn.innerText = 'Sending...';

                                    try {
                                        const res = await fetch('/api/email/send', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                email: emailInput.value,
                                                memorialId: memorial.id
                                            })
                                        });

                                        if (res.ok) {
                                            if (msg) {
                                                msg.innerText = 'Receipt sent! Check your inbox.';
                                                msg.className = 'text-green-500 text-sm mt-2';
                                            }
                                            form.reset();
                                        } else {
                                            throw new Error('Failed to send');
                                        }
                                    } catch (err) {
                                        if (msg) {
                                            msg.innerText = 'Error sending email. Please try again.';
                                            msg.className = 'text-red-500 text-sm mt-2';
                                        }
                                    } finally {
                                        btn.disabled = false;
                                        btn.innerText = 'Send Receipt';
                                    }
                                }}
                                className="flex flex-col gap-3"
                            >
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-[var(--accent-gold)] outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-lg transition-colors border border-slate-700"
                                >
                                    Send Email Receipt
                                </button>
                                <p id="email-msg" className="text-sm min-h-[20px]"></p>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-slate-400 font-serif text-lg mb-4">This is a draft preview</h3>
                        <p className="text-slate-500 max-w-lg mx-auto mb-8">
                            To make this memorial permanent and immutable, you will need to anchor it to the Bitcoin blockchain.
                        </p>

                        <button
                            onClick={async () => {
                                const btn = document.getElementById('anchor-btn') as HTMLButtonElement;
                                if (btn) btn.disabled = true;
                                try {
                                    const res = await fetch(`/api/memorials/${memorial.slug}/anchor`, { method: 'POST' });
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
                            Anchor to Bitcoin
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
