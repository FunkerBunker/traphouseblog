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
    <article className="max-w-3xl mx-auto px-4 py-12 prose dark:prose-invert">
      <Link href="/blog" className="text-sm text-blue-500 hover:underline mb-8 inline-block">
        ← Zurück zur Übersicht
      </Link>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">{data.title}</h1>
        {data.date && <p className="text-gray-500 text-sm">{data.date}</p>}
      </header>
      <div className="mt-6 space-y-4">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}