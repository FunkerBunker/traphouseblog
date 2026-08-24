import GrowCalculator from './GrowCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grow-Rechner | Traphouse',
  description: 'Realistischer Ertrags- und Stromkosten-Rechner für den Cannabis-Anbau.',
};

export default function CalculatorPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
      <header className="max-w-2xl mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
          Tools
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tighter text-neutral-900 dark:text-white">
          Grow-Rechner<span className="text-emerald-500">.</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
          Schätze Ertrag, Effizienz und Stromkosten deines Setups – live und ohne Reload.
        </p>
      </header>

      <GrowCalculator />

      <p className="mt-10 text-xs leading-relaxed text-neutral-400 dark:text-neutral-600 max-w-2xl">
        Hinweis: Alle Werte sind Schätzungen auf Basis gängiger Faustregeln (g/W). Reale
        Erträge hängen von Genetik, Klima, Nährstoffen und Erfahrung ab.
      </p>
    </main>
  );
}