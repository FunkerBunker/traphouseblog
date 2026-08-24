import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Automatische SEO-Metadaten pro Artikel
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return {};

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return {
    title: `${data.title} | Traphouse Blog`,
    description: data.description || 'Ein Beitrag auf Traphouse Blog',
    openGraph: {
      title: data.title,
      description: data.description || 'Ein Beitrag auf Traphouse Blog',
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx?$/, ''),
  }));
}

// 2. Styled Artikel-Ansicht
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white">
      <article className="max-w-3xl mx-auto">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-indigo-400 transition-colors mb-10 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Zurück zur Übersicht
        </Link>
        
        <header className="mb-12 border-b border-neutral-800 pb-8">
          {data.date && (
            <time className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              {data.date}
            </time>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2 text-white leading-tight">
            {data.title}
          </h1>
          {data.description && (
            <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
              {data.description}
            </p>
          )}
        </header>

        <div className="prose prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-pre:border prose-pre:border-neutral-800">
          <MDXRemote source={content} />
        </div>
      </article>
    </main>
  );
}