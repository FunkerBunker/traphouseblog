import Link from 'next/link';
import { getAllPosts, getReadingTime } from '../../lib/posts';

export default function BlogIndex() {
  const posts = getAllPosts();

  // 1. Alle einzigartigen Kategorien aus den Posts extrahieren
  const categories = Array.from(
    new Set(
      posts
        .map((p) => p.category?.trim())
        .filter(Boolean)
    )
  ).sort();

  // 2. Posts nach den dynamisch gefundenen Kategorien gruppieren
  const sections = categories.map((category) => ({
    name: category,
    posts: posts.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    ),
  }));

  // Posts ohne Kategorie als eigener Fallback
  const uncategorized = posts.filter((p) => !p.category);
  if (uncategorized.length > 0) {
    sections.push({ name: 'Unkategorisiert', posts: uncategorized });
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
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
              <h2 className="flex items-baseline gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-8">
                {name}
                <span className="font-normal normal-case tracking-normal text-neutral-400 dark:text-neutral-600">
                  {sectionPosts.length} {sectionPosts.length === 1 ? 'Beitrag' : 'Beiträge'}
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sectionPosts.map((post) => {
                  const readingTime = post.readingTime || getReadingTime(post.content);

                  return (
                    <article key={post.slug} className="group flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
                      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                              Kein Bild vorhanden
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col flex-1 p-6">
                          <div className="flex items-center gap-2 text-xs font-medium tabular-nums text-neutral-400 dark:text-neutral-500 mb-2">
                            {post.date && <time>{post.date}</time>}
                            {post.date && <span>•</span>}
                            <span className="lowercase">{readingTime}</span>
                          </div>
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.description && (
                            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3 flex-1">
                              {post.description}
                            </p>
                          )}
                          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
                            Beitrag lesen
                            <span className="group-hover:translate-x-1 transition-transform" aria-hidden>→</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}