'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bitcoin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group z-50">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 border border-[var(--accent-gold)] transform rotate-45 transition-transform group-hover:rotate-0"></div>
                        <Bitcoin className="relative z-10 w-6 h-6 text-[var(--accent-gold)]" />
                    </div>
                    <span className="text-xl font-serif font-bold tracking-tight text-white">
                        Everstone<span className="text-[var(--accent-gold)]">BTC</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink href="/explore">Explore</NavLink>
                    <NavLink href="/technology">Technology</NavLink>
                    <NavLink href="/how-it-works">How it Works</NavLink>
                    <NavLink href="/sample">Sample</NavLink>
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <Link
                        href="/create"
                        className="px-6 py-2.5 bg-white/5 hover:bg-[var(--accent-gold)] hover:text-black border border-white/10 text-sm font-medium rounded-full transition-all duration-300"
                    >
                        Create Memorial
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50 p-2 text-stone-400 hover:text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Mobile Navigation Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed inset-0 bg-stone-950 pt-24 px-6 md:hidden flex flex-col gap-6"
                        >
                            <nav className="flex flex-col gap-6 text-xl">
                                <MobileNavLink href="/explore" onClick={() => setIsOpen(false)}>Explore</MobileNavLink>
                                <MobileNavLink href="/technology" onClick={() => setIsOpen(false)}>Technology</MobileNavLink>
                                <MobileNavLink href="/how-it-works" onClick={() => setIsOpen(false)}>How it Works</MobileNavLink>
                                <MobileNavLink href="/sample" onClick={() => setIsOpen(false)}>Sample</MobileNavLink>
                            </nav>
                            <div className="pt-6 border-t border-stone-800">
                                <Link
                                    href="/create"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-4 text-center bg-[var(--accent-gold)] text-black font-bold rounded-xl"
                                >
                                    Create Memorial
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-stone-400 hover:text-[var(--accent-gold)] text-sm font-medium transition-colors duration-200"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-stone-300 hover:text-[var(--accent-gold)] font-serif font-medium"
        >
            {children}
        </Link>
    );
}
