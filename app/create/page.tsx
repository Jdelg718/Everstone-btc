'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateMemorial() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        deathDate: '',
        epitaph: '',
        bio: '',
        mainImage: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/memorials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create memorial');
            }

            const memorial = await res.json();
            // Redirect to a preview or the list (for now, maybe back home or to a specific preview page if we had one for non-anchored)
            // Since we don't have a specific "preview" route for DB items yet (the view/[txid] is for anchors), 
            // we might need a new route /m/[slug] or similar. 
            // For now, let's just go home or show success.
            // Wait, the plan mentioned /m/[slugOrId]. We didn't implement that yet.
            // I'll stick to redirecting to home for now, or maybe just alert success.
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[var(--accent-gold)] selection:text-slate-900 p-6">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-[var(--accent-gold)] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-serif text-white mb-2">Create Memorial</h1>
                <p className="text-slate-400 mb-8">Preserve a legacy on the eternal blockchain.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                            placeholder="e.g. Satoshi Nakamoto"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Birth Date</label>
                            <input
                                type="text"
                                name="birthDate"
                                required
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                                placeholder="e.g. Jan 3, 2009"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Death Date</label>
                            <input
                                type="text"
                                name="deathDate"
                                required
                                value={formData.deathDate}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                                placeholder="e.g. Forever"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Epitaph</label>
                        <input
                            type="text"
                            name="epitaph"
                            value={formData.epitaph}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                            placeholder="A short quote or phrase"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Main Image URL</label>
                        <input
                            type="url"
                            name="mainImage"
                            value={formData.mainImage}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Biography (Markdown)</label>
                        <textarea
                            name="bio"
                            rows={6}
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 focus:outline-none focus:border-[var(--accent-gold)] transition-colors font-mono text-sm"
                            placeholder="# Biography..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[var(--accent-gold)] text-slate-950 font-bold py-3 rounded hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Create Memorial Draft
                    </button>
                </form>
            </div>
        </div>
    );
}
