'use client';

import Link from 'next/link';
import { ArrowLeft, Database, Shield, FileCode } from 'lucide-react';

export default function TechnologyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <div className="mb-16 text-center">
                <h1 className="text-5xl font-bold text-white font-serif mb-6">The Technology</h1>
                <p className="text-stone-400 text-xl">
                    Built on the shoulders of giants. Verify, don't trust.
                </p>
            </div>

            <div className="grid gap-12">
                <TechSection
                    icon={<Database className="w-8 h-8 text-amber-500" />}
                    title="Bitcoin OP_RETURN"
                    desc="We use the OP_RETURN opcode to embed a cryptographic hash (SHA-256) of your memorial data directly into the Bitcoin blockchain. This proves existence at a specific point in time without clogging the network with large data files."
                />
                <TechSection
                    icon={<Shield className="w-8 h-8 text-amber-500" />}
                    title="Content Addressing (IPFS)"
                    desc="The actual content (text, images) is stored on IPFS (InterPlanetary File System), identifying files by their content hash rather than location. This ensures that even if our servers disappear, the data remains retrievable as long as one node hosts it."
                />
                <TechSection
                    icon={<FileCode className="w-8 h-8 text-amber-500" />}
                    title="Open Standard Protocol"
                    desc="Everstone memorials follow a simple JSON schema. Anyone can build a viewer for these memorials. We do not lock your memories into a proprietary garden."
                />
            </div>

            <div className="mt-20 text-center">
                <Link href="/" className="flex items-center justify-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Return Home
                </Link>
            </div>
        </div>
    );
}

function TechSection({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex gap-6 p-8 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="shrink-0 pt-1">{icon}</div>
            <div>
                <h2 className="text-2xl font-bold text-white mb-3 font-serif">{title}</h2>
                <p className="text-stone-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
