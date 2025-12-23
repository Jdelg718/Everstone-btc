import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Everstone - Digital Memorials on Bitcoin",
  description: "Etch their memory into eternity. Unstoppable, decentralized, and permanent digital memorials.",
  openGraph: {
    title: "Everstone - Digital Memorials on Bitcoin",
    description: "Etch their memory into eternity. Unstoppable, decentralized, and permanent digital memorials.",
    url: "https://everstonebtc.com",
    siteName: "EverstoneBTC",
    images: [
      {
        url: "/images/bitcoin.svg", // Using existing asset for now, user can update later
        width: 800,
        height: 600,
        alt: "EverstoneBTC Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everstone - Digital Memorials on Bitcoin",
    description: "Etch their memory into eternity. Unstoppable, decentralized, and permanent digital memorials.",
    images: ["/images/bitcoin.svg"], // Using existing asset for now
  },
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
        <Navbar />

        <main className="flex-grow pt-20">
          {children}
        </main>

        <footer className="border-t border-white/5 py-12 bg-black/20 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-stone-500 text-sm">
            <p>&copy; {new Date().getFullYear()} EverstoneBTC. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Privacy</a>
              <a href="https://github.com/Jdelg718/Everstone-btc" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-gold)] transition-colors flex items-center justify-center gap-2">
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


