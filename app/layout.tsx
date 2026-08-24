import React from 'react';
import './globals.css';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';
export const metadata = {
  title: 'TRAPHOUSE | Cannabis Guides & Culture',
  description: 'Tipps, Anbau-Guides, Strains & Equipment rund um Cannabis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark" suppressHydrationWarning>
      <body className="bg-emerald-50/50 text-emerald-950 dark:bg-neutral-950 dark:text-neutral-100 min-h-screen selection:bg-emerald-500 selection:text-black">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-neutral-950/80 border-b border-emerald-900/10 dark:border-emerald-500/20 transition-colors">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-wider uppercase">
              <span className="text-emerald-500 text-2xl">🌿</span>
              <span>TRAPHOUSE<span className="text-emerald-500">.</span></span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/blog" className="text-sm font-medium hover:text-emerald-500 transition-colors">
                Alle Beiträge
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}