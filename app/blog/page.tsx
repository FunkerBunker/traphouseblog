import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const metadata = {
  title: 'Blog | Traphouse',
  description: 'Alle Artikel und Gedanken auf einen Blick.',
};

export default function BlogIndex() {
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
        description: data.description || '',
      };
    });
  }

  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-neutral-100">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
            Blog <span className="text-indigo-500">.</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl">
            Gedanken, Guides und Updates – direkt aus dem Traphouse.
          </p>
        </header>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex justify-between items-baseline mb-2">
                  <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h2>
                  {post.date && (
                    <span className="text-xs text-neutral-500 font-mono ml-4 shrink-0">
                      {post.date}
                    </span>
                  )}
                </div>
                {post.description && (
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}