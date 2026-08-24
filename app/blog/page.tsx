import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

const CATEGORIES = ['Anbau', 'Wirkung & Cultivation', 'Equipment', 'Sorten & Strains'];

export default function BlogIndex() {
  const posts = getAllPosts();
  const known = CATEGORIES.map((c) => c.toLowerCase());
  const other = posts.filter((p) => !known.includes(p.category.toLowerCase()));

  const sections = [
    ...CATEGORIES.map((name) => ({
      name,
      posts: posts.filter((p) => p.category.toLowerCase() === name.toLowerCase()),
    })),
    ...(other.length ? [{ name: 'Weitere', posts: other }] : []),
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-neutral-900 dark:text-white">
          Blog<span className="text-emerald-500">.</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
          Guides, Wissen und Kultur – sortiert nach Themen.
        </p>
      </header>

      {posts.length === 0 && (
        <p className="mt-16 text-neutral-400">Noch keine Beiträge vorhanden.</p>
      )}

      <div className="mt-16 space-y-20">
        {sections.map(({ name, posts: sectionPosts }) => {
          if (sectionPosts.length === 0) return null;
          return (
            <section key={name}>
              <h2 className="flex items-baseline gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                {name}
                <span className="font-normal normal-case tracking-normal text-neutral-400 dark:text-neutral-600">
                  {sectionPosts.length} {sectionPosts.length === 1 ? 'Beitrag' : 'Beiträge'}
                </span>
              </h2>
              <ul className="mt-6 border-y border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
                {sectionPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5">
                      <time className="w-28 shrink-0 text-sm tabular-nums text-neutral-400 dark:text-neutral-500">
                        {post.date}
                      </time>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                      </div>
                      <span className="hidden sm:block ml-auto shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}