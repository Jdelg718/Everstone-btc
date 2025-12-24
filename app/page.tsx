'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Database, Infinity, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/view/${query.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center p-6 overflow-hidden text-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-stone-300">The Gold Standard for Digital Memorials</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight text-white drop-shadow-sm font-serif">
            Etch their memory <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">into eternity.</span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Unstoppable, censorship-resistant tributes anchored to the Bitcoin blockchain.
            No servers. No subscriptions. Just forever.
          </p>

          <form onSubmit={handleSearch} className="w-full relative max-w-lg mx-auto mb-10">
            <div className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Verify a Memorial (Enter TXID)..."
                className="w-full bg-stone-900/80 border border-stone-800 text-white px-6 py-4 rounded-full pl-14 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all backdrop-blur-md placeholder:text-stone-600 shadow-xl"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-stone-500 group-focus-within:text-amber-500 transition-colors h-5 w-5" />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-amber-600 hover:bg-amber-500 text-white px-6 rounded-full font-semibold transition-all shadow-lg hover:shadow-amber-500/20"
              >
                Verify
              </button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/create" className="px-8 py-4 bg-white text-stone-950 font-bold rounded-full hover:bg-stone-200 transition-all shadow-lg shadow-white/5 flex items-center gap-2">
              Write a Tribute <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/explore" className="px-8 py-4 bg-transparent border border-stone-700 text-stone-300 font-medium rounded-full hover:border-amber-500/50 hover:text-amber-400 transition-all flex items-center gap-2">
              Explore Memorials
            </Link>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full py-24 px-6 bg-stone-950 border-t border-stone-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-200">Set in Stone</h2>
            <p className="text-stone-500">How Everstone uses Bitcoin to guarantee permanence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureStep
              icon={<Database className="w-8 h-8 text-amber-500" />}
              title="1. Write Tribute"
              desc="Compose your message and upload photos. Data is prepared for permanent storage."
            />
            <FeatureStep
              icon={<ShieldCheck className="w-8 h-8 text-amber-500" />}
              title="2. Cryptographic Proof"
              desc="We generate a unique hash of your memorial. This digital fingerprint serves as proof of existence."
            />
            <FeatureStep
              icon={<Infinity className="w-8 h-8 text-amber-500" />}
              title="3. Anchor to Bitcoin"
              desc="We embed this fingerprint into a Bitcoin transaction using OP_RETURN. It is now immutable."
            />
            <FeatureStep
              icon={<ShieldCheck className="w-8 h-8 text-amber-500" />}
              title="4. Offline Cold Storage"
              desc="Download the Universal Viewer and your memorial bundle. Verify it offline, forever, with zero dependency on our servers."
            />
          </div>
        </div>
      </section>

      {/* ETHOS SECTION */}
      <section className="w-full py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-900/20 -z-10" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white font-serif leading-tight">
              Eternal by Design. <br />
              <span className="text-stone-600">Not by promise.</span>
            </h2>
            <div className="space-y-8">
              <EthosItem
                title="Immutability"
                desc="Traditional websites can expire. Databases can be deleted. The Bitcoin blockchain has never been hacked or taken offline since 2009."
              />
              <EthosItem
                title="Decentralization"
                desc="Your memorial isn't stored on a single company server. The proof lives on thousands of nodes worldwide."
              />
              <EthosItem
                title="Minimal Footprint"
                desc="We respect the chain. Only the cryptographic proof is stored on Bitcoin, ensuring efficiency while guaranteeing integrity."
              />
            </div>
          </div>
          <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 border-2 border-amber-500/50 text-amber-500 rounded-full flex items-center justify-center">
                <span className="font-serif text-4xl italic">E</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-300 mb-2">The Everstone Guarantee</h3>
              <p className="text-stone-500 max-w-sm mx-auto">
                "As long as Bitcoin exists, the proof of this memory exists."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full py-32 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white font-serif">Ready to create a legacy?</h2>
        <Link href="/create" className="inline-flex items-center gap-3 px-10 py-5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg rounded-full transition-all shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1">
          Start Forever <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

    </div>
  );
}

function FeatureStep({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-stone-900/30 border border-stone-800/50 hover:border-amber-500/30 transition-all duration-300 group">
      <div className="mb-6 p-4 bg-stone-900 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300 border border-stone-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-200 mb-3">{title}</h3>
      <p className="text-stone-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function EthosItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-1 h-full min-h-[3rem] bg-stone-800 rounded-full">
        <div className="w-full h-1/2 bg-amber-500/50 rounded-full" />
      </div>
      <div>
        <h4 className="text-xl font-semibold text-stone-200 mb-2">{title}</h4>
        <p className="text-stone-500">{desc}</p>
      </div>
    </div>
  );
}
