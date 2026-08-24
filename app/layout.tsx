import React from 'react';
import './globals.css';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TRAPHOUSE | Cannabis Guides & Culture',
  description: 'Tipps, Anbau-Guides, Strains & Equipment rund um Cannabis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-300 transition-colors">
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              try {
                const saved = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldDark = saved === 'dark' || (!saved && prefersDark);
                if (shouldDark) document.documentElement.classList.add('dark');
              } catch (e) {}
            })();
          `,
        }}
        />
        {children}
      </body>
    </html>
  );
}