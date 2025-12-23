import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { Bitcoin } from "lucide-react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Everstone - Digital Memorials on Bitcoin",
  description: "Etch their memory into eternity. Unstoppable, decentralized, and permanent digital memorials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Diamond Shape Background */}
                <div className="absolute inset-0 border border-[var(--accent-gold)] transform rotate-45 transition-transform group-hover:rotate-0"></div>
                {/* B Symbol */}
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

            {/* CTA */}
            <div className="hidden md:block">
              <Link
                href="/create"
                className="px-6 py-2.5 bg-white/5 hover:bg-[var(--accent-gold)] hover:text-black border border-white/10 text-sm font-medium rounded-full transition-all duration-300"
              >
                Create Memorial
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-grow pt-20">
          {children}
        </main>

        <footer className="border-t border-white/5 py-12 bg-black/20 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-stone-500 text-sm">
            <p>&copy; {new Date().getFullYear()} EverstoneBTC. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Privacy</a>
              <a href="https://github.com/EverstoneBTC/viewer" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-gold)] transition-colors flex items-center justify-center gap-2">
                Download Viewer <span className="text-[10px] bg-stone-800 px-1 rounded border border-stone-700">v1.0 (OSS)</span>
              </a>
            </div>
            <p className="mt-2">Immutable. Decentralized. Infinite.</p>
          </div>
        </footer>
      </body>
    </html>
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
