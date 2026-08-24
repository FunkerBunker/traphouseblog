// app/layout.tsx
import React from 'react';
import './globals.css';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';
import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'TRAPHOUSE | Cannabis Guides & Culture',
  description: 'Tipps, Anbau-Guides, Strains & Equipment rund um Cannabis.',
};

// Script, das das Theme vorsichtig vor dem Rendern setzt (im <head>!)
const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('theme');
    var dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* 🟢 WICHTIG: Script im <head> statt im <body> */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-300 transition-colors">
        <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-sm font-bold tracking-[0.25em] uppercase text-neutral-900 dark:text-white">
              Traphouse<span className="text-emerald-500">.</span>
            </Link>
            <nav className="flex items-center gap-5">
              <Link
                href="/blog"
                className="text-sm text-neutral-500 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/calculator"
                className="text-sm text-neutral-500 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400 transition-colors"
              >
                Grow-Rechner
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        {children}
        <Analytics />
        <footer className="mt-24 border-t border-neutral-200 dark:border-neutral-800">
          <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
            <span>© {new Date().getFullYear()} Traphouse</span>
            <span className="uppercase tracking-widest">Anbau · Wissen · Kultur</span>
          </div>
        </footer>
      </body>
    </html>
  );
}