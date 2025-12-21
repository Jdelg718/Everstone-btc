'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Github } from 'lucide-react';
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent -z-10 opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl w-full"
      >
        {/* Logo Mark */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 border-2 border-[var(--accent-gold)] flex items-center justify-center transform rotate-45">
            <div className="transform -rotate-45 text-[var(--accent-gold)] font-serif text-3xl font-bold">E</div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white drop-shadow-sm">
          Everstone<span className="text-[var(--accent-gold)]">BTC</span>
        </h1>

        <p className="text-xl text-[var(--accent-stone)] mb-12 font-light">
          The Unstoppable Engine for Digital Immortality.
          <br />
          Verify any memorial anchored to the Bitcoin Blockchain.
        </p>

        <form onSubmit={handleSearch} className="w-full relative max-w-lg mx-auto mb-16">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Bitcoin Transaction ID (TXID)..."
              className="w-full bg-slate-800/50 border border-slate-700 text-white px-6 py-4 rounded-full pl-14 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent transition-all backdrop-blur-sm placeholder:text-slate-500"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-gold)] transition-colors h-5 w-5" />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-[var(--accent-gold)] text-slate-900 px-6 rounded-full font-semibold hover:bg-[#d4b365] transition-colors"
            >
              Verify
            </button>
          </div>
        </form>

        <div className="mb-16">
          <Link href="/create" className="text-[var(--accent-gold)] hover:underline hover:text-yellow-400 transition-colors">
            Create a New Memorial
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-400">
          <Feature
            icon={<ShieldCheck className="w-6 h-6 mb-2 mx-auto text-[var(--accent-gold)]" />}
            title="Sovereign"
            desc="No servers. Your device verifies the data directly from Bitcoin & IPFS."
          />
          <Feature
            icon={<div className="w-6 h-6 mb-2 mx-auto font-serif text-[var(--accent-gold)] font-bold">∞</div>}
            title="Permanent"
            desc="Anchored to the most secure network in human history."
          />
          <Feature
            icon={<Github className="w-6 h-6 mb-2 mx-auto text-[var(--accent-gold)]" />}
            title="Open Source"
            desc="Code transparency ensures long-term independence."
          />
        </div>
      </motion.div>

      <footer className="absolute bottom-6 text-slate-600 text-sm">
        v1.0.0 Public Beta • Running on Mainnet
      </footer>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-4 rounded-xl hover:bg-slate-800/30 transition-colors duration-300">
      {icon}
      <h3 className="font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}
