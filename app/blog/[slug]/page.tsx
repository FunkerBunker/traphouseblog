import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return {};

  const { data } = matter(fs.readFileSync(filePath, 'utf8'));
  const cover = data.coverImage || data.image;

  return {
    title: `${data.title} | Traphouse`,
    description: data.description || 'Ein Beitrag auf Traphouse',
    openGraph: cover ? { images: [{ url: cover }] } : undefined,
  };
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => ({ slug: f.replace(/\.mdx?$/, '') }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) notFound();

  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traphouseblog.de';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const faqs: FAQItem[] = data.faqs || [];
  const coverImage = data.coverImage || data.image;

  // 1. Haupt-Schema: BlogPosting
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description || '',
    image: coverImage ? [coverImage] : undefined,
    datePublished: data.date || '',
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    author: { '@type': 'Person', name: 'Traphouse Redaktion' },
    publisher: { '@type': 'Organization', name: 'Traphouse', url: siteUrl },
  };

  // 2. FAQ-Schema (nur wenn FAQs existieren)
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  const jsonLdData = faqSchema ? [blogPostingSchema, faqSchema] : blogPostingSchema;

  return (
    <main className="px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <article className="max-w-2xl mx-auto">
        <Link
          className="group inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          href="/blog"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Alle Beiträge
        </Link>

        <header className="mt-10 pb-8">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em]">
            {data.category && (
              <span className="text-emerald-600 dark:text-emerald-400">
                {data.category}
              </span>
            )}
            {data.date && <time className="text-neutral-400">{data.date}</time>}
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white">
            {data.title}
          </h1>
          {data.description && (
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {data.description}
            </p>
          )}
        </header>

        {/* TITELBILD / COVER IMAGE direkt unter dem Header */}
        {coverImage && (
          <div className="my-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
            <img
              src={coverImage}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="article mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <MDXRemote source={content} />
        </div>

        {/* Sichtbarer FAQ-Bereich am Ende des Artikels */}
        {faqs.length > 0 && (
          <section className="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              Häufig gestellte Fragen (FAQ)
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">
                    {faq.question}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}