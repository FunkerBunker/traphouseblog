// app/components/ThemeToggle.tsx
'use client';

import { useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Lies den aktuellen Zustand aus dem DOM (vermeidet Doppel-Zustand)
  useEffect(() => {
    // Lies die Klasse vom HTML-root (sicherer als localStorage-Lese bei initialer Render)
    const hasDark = document.documentElement.classList.contains('dark');
    setIsDark(hasDark);
  }, []);

  const toggle = () => {
    const nextDark = !isDark;
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    setIsDark(nextDark);
  };

  return (
    <button
      onClick={toggle}
      className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      aria-label="Farbschema wechseln"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}