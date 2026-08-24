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

// ── SEO-Metadaten pro Artikel ──────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return {};

  const { data } = matter(fs.readFileSync(filePath, 'utf8'));

  return {
    title: `${data.title} | Traphouse`,
    description: data.description || 'Ein Beitrag auf Traphouse',
    openGraph: {
      title: data.title,
      description: data.description || 'Ein Beitrag auf Traphouse',
      type: 'article',
    },
  };
}

// ── Statische Pfade für den Build ──────────────────────────
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => ({ slug: f.replace(/\.mdx?$/, '') }));
}

// ── Seite ──────────────────────────────────────────────────
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) notFound();

  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));

  return (
    <main className="px-6 py-16 sm:py-24">
      <article className="max-w-2xl mx-auto">

        {/* Zurück-Link */}
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Alle Beiträge
        </Link>

        {/* Header */}
        <header className="mt-10 pb-10 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em]">
            {data.category && (
              <span className="text-emerald-600 dark:text-emerald-400">
                {data.category}
              </span>
            )}
            {data.category && data.date && (
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
            )}
            {data.date && (
              <time className="text-neutral-400 dark:text-neutral-500">
                {data.date}
              </time>
            )}
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-neutral-900 dark:text-white">
            {data.title}
          </h1>

          {data.description && (
            <p className="mt-4 text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
              {data.description}
            </p>
          )}
        </header>

        {/* Artikelinhalt – nutzt die .article-Klasse aus globals.css */}
        <div className="article mt-10">
          <MDXRemote source={content} />
        </div>

      </article>
    </main>
  );
}