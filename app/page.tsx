import Link from 'next/link';
import { getAllPosts } from '../lib/posts';

export default function Home() {
  const latest = getAllPosts().slice(0, 3);

  return (
    <main className="max-w-5xl mx-auto px-6">
      <section className="py-24 sm:py-32 border-b border-neutral-200 dark:border-neutral-800">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
          Cannabis Guides & Culture
        </p>
        <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tighter leading-[1.02] text-neutral-900 dark:text-white">
          Wissen,<br />das wächst<span className="text-emerald-500">.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
          Anbau-Guides, Strain-Profile und Equipment – klar aufbereitet, ohne Bullshit.
        </p>
        <Link href="/blog" className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
          <span className="border-b border-emerald-500 pb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Alle Beiträge ansehen
          </span>
          <span className="text-emerald-500 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>

      {latest.length > 0 && (
        <section className="py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
              Neueste Beiträge
            </h2>
            <Link href="/blog" className="text-xs text-neutral-400 hover:text-emerald-500 transition-colors">
              Alle anzeigen →
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
            {latest.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group flex items-baseline gap-6 py-5">
                  <time className="hidden sm:block w-28 shrink-0 text-sm tabular-nums text-neutral-400 dark:text-neutral-500">
                    {post.date}
                  </time>
                  <div className="min-w-0">
                    <span className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      {post.category}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <span className="ml-auto shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-emerald-500 transition-colors" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}