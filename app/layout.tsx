import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
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
              <div className="w-10 h-10 border border-[var(--accent-gold)] flex items-center justify-center transform rotate-45 transition-transform group-hover:rotate-0">
                <div className="transform -rotate-45 text-[var(--accent-gold)] font-serif text-xl font-bold transition-transform group-hover:rotate-0">E</div>
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
