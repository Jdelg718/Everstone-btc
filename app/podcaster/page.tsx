'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Mic,
    Shield,
    Heart,
    Database,
    Blocks,
    CheckCircle,
    FileText,
    ExternalLink,
    Zap,
    Lock,
    Leaf
} from 'lucide-react';

export default function PodcasterPage() {
    return (
        <div className="flex flex-col items-center w-full">

            {/* HERO SECTION */}
            <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center p-6 overflow-hidden text-center">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 -z-10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl"
                >
                    <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
                        <Mic className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-400">Podcaster Press Kit</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight text-white drop-shadow-sm font-serif">
                        Memories That Outlive <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Every Server on Earth</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-stone-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                        Everstone anchors digital memorials to the Bitcoin blockchain—permanently,
                        responsibly, and with minimal footprint. Here's everything you need to share this story.
                    </p>
                </motion.div>
            </section>

            {/* THE PITCH SECTION */}
            <section className="w-full py-24 px-6 bg-stone-950 border-t border-stone-900">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-200 font-serif">The 60-Second Pitch</h2>
                        <p className="text-stone-500 text-lg">What your listeners need to know</p>
                    </div>

                    <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-10 md:p-14 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

                        <div className="relative">
                            <p className="text-2xl md:text-3xl text-stone-200 font-serif leading-relaxed mb-8">
                                "What if you could create a digital memorial that literally <span className="text-amber-400 font-semibold">cannot be deleted</span>—not by us,
                                not by any corporation, not by any government?"
                            </p>

                            <div className="space-y-6 text-lg text-stone-400 leading-relaxed">
                                <p>
                                    <strong className="text-stone-200">Everstone</strong> takes the photos, stories, and tributes you create for a loved one
                                    and anchors a cryptographic proof directly into the <strong className="text-amber-500">Bitcoin blockchain</strong>—the most
                                    secure, decentralized network humans have ever created.
                                </p>

                                <p>
                                    Once anchored, that proof exists on <em>thousands of computers worldwide</em>. No single point of failure.
                                    No subscription fees. No company that can go bankrupt and take your memories with it.
                                </p>

                                <p className="text-stone-300 font-medium">
                                    As long as Bitcoin exists, the proof of your loved one's memorial exists.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCKCHAIN STEWARDSHIP SECTION */}
            <section className="w-full py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/50 to-stone-950 -z-10" />

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10">
                            <Leaf className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-green-400">Blockchain Stewardship</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-200 font-serif">Respectful by Design</h2>
                        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
                            We believe in using Bitcoin responsibly. Here's how we honor the network while preserving memories forever.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <StewardshipCard
                            icon={<Zap className="w-8 h-8 text-amber-500" />}
                            title="Minimal Footprint: OP_RETURN"
                            highlight="Only ~40 bytes"
                            description="We don't store your photos on the blockchain. We embed a tiny cryptographic fingerprint (hash) in the OP_RETURN field of a standard Bitcoin transaction. This is the designated, non-bloating method for timestamping data."
                        />

                        <StewardshipCard
                            icon={<Shield className="w-8 h-8 text-amber-500" />}
                            title="Anti-Spam Protection"
                            highlight="$100 minimum"
                            description="Every memorial requires a $100 transaction. This isn't just a fee—it's a commitment that ensures only genuine, meaningful memorials are anchored. It prevents spam while covering the real Bitcoin network fees."
                        />

                        <StewardshipCard
                            icon={<Database className="w-8 h-8 text-amber-500" />}
                            title="Real Financial Transaction"
                            highlight="Not empty data"
                            description="Unlike pure data embedding, Everstone anchors proofs within actual financial transactions. This is how Bitcoin was designed to be used—moving real value while carrying metadata."
                        />

                        <StewardshipCard
                            icon={<Blocks className="w-8 h-8 text-amber-500" />}
                            title="Node Operator Friendly"
                            highlight="80 bytes max"
                            description="We stay well within OP_RETURN limits. Node operators don't have to store megabytes of data for our service. Just a fingerprint smaller than a tweet."
                        />
                    </div>
                </div>
            </section>

            {/* HOW THE TECH WORKS */}
            <section className="w-full py-24 px-6 bg-stone-950 border-t border-stone-900">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-200 font-serif">The Technical Truth</h2>
                        <p className="text-stone-500 text-lg">For the Bitcoin-savvy in your audience</p>
                    </div>

                    <div className="bg-stone-900/30 border border-stone-800 rounded-2xl p-8 md:p-12 font-mono text-sm">
                        <div className="space-y-6">
                            <TechStep
                                step="1"
                                label="Memorial Created"
                                code="SHA-256(memorial_content) → 32-byte hash"
                            />
                            <TechStep
                                step="2"
                                label="Transaction Built"
                                code="OP_RETURN EVERSTONE:<hash_prefix>"
                            />
                            <TechStep
                                step="3"
                                label="Broadcast to Network"
                                code="btc_tx → mempool → confirmation"
                            />
                            <TechStep
                                step="4"
                                label="Forever Anchored"
                                code="Block #XXX,XXX → immutable proof"
                            />
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p className="text-amber-200 text-center">
                            <strong>Key Point:</strong> The memorial content (photos, text) lives in a downloadable bundle and optionally IPFS.
                            Only the tiny proof hash touches Bitcoin. This is responsible blockchain usage.
                        </p>
                    </div>
                </div>
            </section>

            {/* TALKING POINTS */}
            <section className="w-full py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-200 font-serif">Key Talking Points</h2>
                        <p className="text-stone-500 text-lg">Copy-paste ready sound bites for your show</p>
                    </div>

                    <div className="space-y-6">
                        <TalkingPoint
                            icon={<Heart className="w-6 h-6 text-amber-500" />}
                            point="Everstone is for people who want their loved one's memory to outlast any company, any server, any website."
                        />
                        <TalkingPoint
                            icon={<Lock className="w-6 h-6 text-amber-500" />}
                            point="The $100 commitment isn't just a fee—it's anti-spam protection that ensures only meaningful memorials are anchored."
                        />
                        <TalkingPoint
                            icon={<Leaf className="w-6 h-6 text-amber-500" />}
                            point="We only embed about 40 bytes of data using OP_RETURN—smaller than a single tweet. We're stewards of the blockchain, not bloaters."
                        />
                        <TalkingPoint
                            icon={<Shield className="w-6 h-6 text-amber-500" />}
                            point="Even if Everstone the company disappears tomorrow, your memorial proof lives on across thousands of Bitcoin nodes worldwide."
                        />
                        <TalkingPoint
                            icon={<FileText className="w-6 h-6 text-amber-500" />}
                            point="Every user gets a downloadable offline bundle with an open-source viewer. True digital sovereignty."
                        />
                        <TalkingPoint
                            icon={<Blocks className="w-6 h-6 text-amber-500" />}
                            point="We use real Bitcoin transactions—not just data dumps. Our anchoring happens within actual financial movements on the network."
                        />
                    </div>
                </div>
            </section>

            {/* FAQ FOR SKEPTICS */}
            <section className="w-full py-24 px-6 bg-stone-950 border-t border-stone-900">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-200 font-serif">Handling Skeptics</h2>
                        <p className="text-stone-500 text-lg">Answers to the questions your audience will ask</p>
                    </div>

                    <div className="space-y-8">
                        <FAQItem
                            question="Isn't putting data on Bitcoin wasteful?"
                            answer="Great question! We use OP_RETURN, which is specifically designed for small data payloads and doesn't bloat the UTXO set. We embed roughly 40 bytes—less than a tweet. And our $100 minimum ensures only genuine memorials, not spam. We're stewards of the chain, not abusers."
                        />
                        <FAQItem
                            question="What if Bitcoin goes away?"
                            answer="Bitcoin has been running since 2009 without a single hour of downtime. It's secured by more computing power than exists in all the world's supercomputers combined. If Bitcoin fails, we have bigger problems than digital memorials—but in that scenario, users still have their offline bundles."
                        />
                        <FAQItem
                            question="Why $100? That seems expensive."
                            answer="The $100 commitment serves two purposes: it covers real Bitcoin network fees for anchoring, and more importantly, it acts as anti-spam protection. This ensures every memorial on our platform is meaningful, not a test or joke. It's a one-time payment—no subscriptions, ever."
                        />
                        <FAQItem
                            question="Can I verify this actually works?"
                            answer="Absolutely! Every Everstone memorial includes a link to the actual Bitcoin transaction on public explorers like mempool.space. Anyone can independently verify the proof exists in the blockchain. Verify, don't trust."
                        />
                        <FAQItem
                            question="What data actually goes on-chain?"
                            answer="Only a cryptographic hash (fingerprint) of your memorial—about 40 bytes. Your actual photos, text, and videos never touch the blockchain. They're stored in a downloadable bundle and optionally on IPFS for distributed access."
                        />
                    </div>
                </div>
            </section>

            {/* FOUNDER STORY */}
            <section className="w-full py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-stone-200 font-serif">The Human Story</h2>

                    <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-10 md:p-14">
                        <p className="text-xl text-stone-300 leading-relaxed mb-8 italic">
                            "I lost someone I loved, and when I looked at the memorial website we'd created, I realized
                            something terrifying: that site could disappear any time the hosting company decided to shut down,
                            or when I forgot to pay a bill, or when the company went bankrupt."
                        </p>
                        <p className="text-lg text-stone-400 leading-relaxed">
                            Everstone was born from that fear and the realization that Bitcoin—this unstoppable,
                            censorship-resistant network—could solve it permanently. Not through promises, but through
                            mathematics and decentralization.
                        </p>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="w-full py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent -z-10" />

                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white font-serif">
                        Ready to Share This Story?
                    </h2>
                    <p className="text-xl text-stone-400 mb-12 max-w-2xl mx-auto">
                        We'd love to be on your show. Reach out for interviews, custom graphics, or any questions.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a
                            href="mailto:press@everstone.io"
                            className="px-10 py-5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg rounded-full transition-all shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 flex items-center gap-3"
                        >
                            <Mic className="w-5 h-5" />
                            Book an Interview
                        </a>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Visit Everstone.io
                        </Link>
                    </div>
                </div>
            </section>

            {/* BACK NAVIGATION */}
            <section className="w-full py-12 px-6 border-t border-stone-900">
                <div className="max-w-4xl mx-auto text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Return to Homepage
                    </Link>
                </div>
            </section>

        </div>
    );
}

function StewardshipCard({ icon, title, highlight, description }: {
    icon: React.ReactNode;
    title: string;
    highlight: string;
    description: string;
}) {
    return (
        <div className="p-8 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-stone-200 mb-1">{title}</h3>
                    <span className="text-amber-500 font-mono text-sm font-semibold">{highlight}</span>
                </div>
            </div>
            <p className="text-stone-500 leading-relaxed">{description}</p>
        </div>
    );
}

function TechStep({ step, label, code }: { step: string; label: string; code: string; }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">
                {step}
            </div>
            <div className="flex-1">
                <div className="text-stone-500 text-xs uppercase tracking-wider mb-1">{label}</div>
                <code className="text-amber-400">{code}</code>
            </div>
        </div>
    );
}

function TalkingPoint({ icon, point }: { icon: React.ReactNode; point: string; }) {
    return (
        <div className="flex items-start gap-4 p-6 bg-stone-900/30 border border-stone-800 rounded-xl">
            <div className="shrink-0 p-2 bg-stone-900 rounded-lg border border-stone-700">
                {icon}
            </div>
            <p className="text-lg text-stone-300 leading-relaxed">"{point}"</p>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string; }) {
    return (
        <div className="p-6 bg-stone-900/30 border border-stone-800 rounded-xl">
            <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                "{question}"
            </h3>
            <p className="text-stone-400 leading-relaxed ml-7">{answer}</p>
        </div>
    );
}
