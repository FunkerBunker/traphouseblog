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

export default function BlogIndex() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  
  let filenames: string[] = [];
  if (fs.existsSync(postsDirectory)) {
    filenames = fs.readdirSync(postsDirectory);
  }

  const posts: Post[] = filenames
    .filter((filename) => filename.endsWith('.mdx') || filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.mdx?$/, ''),
        title: data.title || filename,
        date: data.date || '',
        description: data.description || '',
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-400 transition">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:underline">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-3">{post.date}</p>
              <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}