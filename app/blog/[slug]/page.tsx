import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx?$/, ''),
  }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <Link 
          href="/blog" 
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
        >
          ← Zurück zur Übersicht
        </Link>
        <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{data.title}</h1>
          {data.date && <p className="text-sm text-gray-500 dark:text-gray-400">{data.date}</p>}
        </header>
        <div className="prose dark:prose-invert max-w-none">
          <MDXRemote source={content} />
        </div>
      </article>
    </main>
  );
}