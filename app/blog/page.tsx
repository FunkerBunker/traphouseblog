import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
}

const CATEGORIES = ["Alle", "Anbau", "Wirkung & Cultivation", "Equipment", "Sorten & Strains"];

export default async function BlogIndex() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  let posts: Post[] = [];

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    posts = filenames.map((filename) => {
      const slug = filename.replace(/\.mdx?$/, '');
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        category: data.category || 'Allgemein',
        description: data.description || '',
      };
    });
  }

  return (
    <main className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
      {/* Hero Header */}
      <section className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Knowledge Base & Guides
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-4 text-emerald-950 dark:text-white">
          Cannabis <span className="text-emerald-500">Clustered.</span>
        </h1>
        <p className="mt-3 text-lg text-emerald-800/80 dark:text-neutral-400 max-w-2xl">
          Echtes Wissen rund um Anbau, Terpene, Legalisierung & Equipment – übersichtlich gegliedert.
        </p>
      </section>

      {/* Cluster Grid / Kategorien */}
      <div className="space-y-16">
        {CATEGORIES.filter(c => c !== "Alle").map((category) => {
          const categoryPosts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
          if (categoryPosts.length === 0) return null;

          return (
            <section key={category} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-3">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-2xl font-bold uppercase tracking-wide text-emerald-900 dark:text-emerald-400">
                  {category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                    <article className="h-full p-6 rounded-2xl bg-white dark:bg-neutral-900/60 border border-emerald-900/10 dark:border-neutral-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-3">
                          <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {post.category}
                          </span>
                          <span>{post.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-emerald-950 dark:text-white group-hover:text-emerald-500 transition-colors">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="mt-3 text-sm text-emerald-800/70 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                            {post.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-6 pt-4 border-t border-emerald-500/10 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                        Artikel lesen →
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}