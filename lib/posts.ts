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
  const postsDirectory = path.join(process.cwd(), 'content', 'posts');

  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => /\.mdx?$/.test(filename))
    .map((filename) => {
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
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // ISO-Datum (z. B. "2024-05-01")
}