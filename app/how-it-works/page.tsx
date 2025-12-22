'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function HowItWorksPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <h1 className="text-5xl font-bold text-white font-serif mb-12">How It Works</h1>

            <div className="space-y-16 relative before:absolute before:inset-0 before:ml-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-stone-800 before:-z-10">
                <Step
                    num="01"
                    title="Create"
                    desc="You write a tribute and upload a photo. This data is packaged into a standardized JSON format."
                />
                <Step
                    num="02"
                    title="Hash"
                    desc="We calculate the SHA-256 hash of your data package. This is the unique digital fingerprint."
                />
                <Step
                    num="03"
                    title="Anchor"
                    desc="We broadcast a Bitcoin transaction containing this hash in an OP_RETURN output."
                />
                <Step
                    num="04"
                    title="Verify"
                    desc="Once confirmed in a block, anyone can take your data, hash it, and verify it matches the hash on the blockchain."
                />
            </div>

            <div className="mt-20">
                <Link href="/" className="flex items-center justify-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Return Home
                </Link>
            </div>
        </div>
    );
}

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="bg-stone-950 border border-stone-800 p-8 rounded-2xl max-w-xl mx-auto relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-stone-900 border border-stone-700 rounded-full flex items-center justify-center text-amber-500 font-bold font-mono">
                {num}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 mt-2 font-serif">{title}</h3>
            <p className="text-stone-400">{desc}</p>
        </div>
    );
}
