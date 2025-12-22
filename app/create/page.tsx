'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, Upload, ArrowRight, Bitcoin, Download, ShieldCheck } from 'lucide-react';
import ConnectWallet from '../components/ConnectWallet';

export default function CreateMemorial() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        deathDate: '',
        epitaph: '',
        bio: '',
        mainImage: ''
    });

    // Creation State
    const [memorialId, setMemorialId] = useState<string | null>(null);
    const [memorialSlug, setMemorialSlug] = useState<string | null>(null);

    // Payment State
    const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PENDING' | 'PAID'>('UNPAID');
    const [invoiceId, setInvoiceId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Create Draft Memorial
            const res = await fetch('/api/memorials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to create memorial');

            const data = await res.json();
            setMemorialId(data.id);
            setMemorialSlug(data.slug);

            // 2. Initial Payment Request
            const payRes = await fetch('/api/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memorialId: data.id })
            });

            const payData = await payRes.json();
            setInvoiceId(payData.invoiceId);
            setPaymentStatus('PENDING');

            // Start polling for payment
            pollPayment(payData.invoiceId);

            setStep(2); // Move to Payment Step
        } catch (error) {
            console.error(error);
            alert('Error creating memorial');
        } finally {
            setIsSubmitting(false);
        }
    };

    const pollPayment = async (invId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/payments/${invId}/status`);
                const data = await res.json();
                if (data.status === 'COMPLETED') {
                    setPaymentStatus('PAID');
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 2000);
    };

    const handleAnchor = async () => {
        if (!memorialSlug) return;
        setIsSubmitting(true);

        try {
            await fetch(`/api/memorials/${memorialSlug}/anchor`, { method: 'POST' });
            router.push(`/m/${memorialSlug}`);
        } catch (e) {
            alert('Anchoring failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-white font-serif mb-4">Create a Memorial</h1>
                    <p className="text-stone-400">Preserve a legacy forever on the Bitcoin blockchain.</p>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: FORM */}
                        {step === 1 && (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-300">Full Name</label>
                                        <input
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors"
                                            placeholder="e.g. Satoshi Nakamoto"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-300">Main Photo URL</label>
                                        <input
                                            value={formData.mainImage}
                                            onChange={e => setFormData({ ...formData, mainImage: e.target.value })}
                                            className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-300">Birth Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                            className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors type-date-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-300">Death Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.deathDate}
                                            onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                                            className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors type-date-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-300">Epitaph</label>
                                    <input
                                        required
                                        value={formData.epitaph}
                                        onChange={e => setFormData({ ...formData, epitaph: e.target.value })}
                                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors"
                                        placeholder="A short, memorable quote..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-300">Biography</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors resize-none"
                                        placeholder="Tell their story..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Continue to Payment <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </motion.form>
                        )}

                        {/* STEP 2: PAYMENT & FINALIZE (Start Phase 2 Real Logic) */}
                        {step === 2 && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-center space-y-8"
                            >
                                <div className="py-8 space-y-6">
                                    <div className="bg-stone-800/50 p-6 rounded-xl border border-stone-700 space-y-4">
                                        <h3 className="text-xl font-bold text-white">1. Pay & Anchor in One Transaction</h3>
                                        <p className="text-stone-400 text-sm">
                                            To permanently etch this memorial, please sign the Bitcoin transaction.
                                            This single transaction sends the fee to Everstone ($100 in BTC) AND anchors the data hash to the blockchain.
                                        </p>

                                        <div className="flex justify-center pt-4">
                                            <ConnectWallet onConnect={(addr: string, pk: string) => console.log('Connected:', addr, pk)} />
                                        </div>
                                    </div>

                                    {/* Fallback for now: Simulated "Skip" for demo if no wallet */}
                                    <div className="border-t border-stone-800 pt-6">
                                        <p className="text-xs text-stone-500 mb-4 uppercase tracking-widest">Or Use Demo Mode</p>
                                        {paymentStatus === 'PENDING' ? (
                                            <div className="py-4">
                                                <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                                                <p className="text-stone-400 text-sm">Simulating payment verification (wait ~10s)</p>
                                            </div>
                                        ) : paymentStatus === 'PAID' ? (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                                    <Check className="w-8 h-8" />
                                                </div>
                                                <div className="grid gap-4">
                                                    <button
                                                        onClick={handleAnchor}
                                                        disabled={isSubmitting}
                                                        className="w-full bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <><ShieldCheck className="w-5 h-5 text-amber-500" /> Anchor to Bitcoin (Finalize)</>}
                                                    </button>

                                                    {memorialSlug && (
                                                        <a
                                                            href={`/api/memorials/${memorialSlug}/download`}
                                                            target="_blank"
                                                            className="w-full bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/50 text-amber-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                                                        >
                                                            <Download className="w-5 h-5" /> Download Permanent Package
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
