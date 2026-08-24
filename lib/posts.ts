import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
}

export function getAllPosts(): Post[] {
  const dir = path.join(process.cwd(), 'content/posts');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, '');
      const { data } = matter(fs.readFileSync(path.join(dir, filename), 'utf8'));
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        category: data.category || 'Allgemein',
        description: data.description || '',
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // setzt ISO-Datum voraus: 2024-05-01
}