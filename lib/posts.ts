import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  author?: string;
  image?: string;
  coverImage?: string;
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
        author: data.author || 'Traphouse Redaktion',
        image: data.image || undefined,
        // Liest coverImage aus dem Frontmatter oder nutzt image als Fallback
        coverImage: data.coverImage || data.image || undefined,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Erweitere lib/posts.ts um diese Funktion (falls noch nicht vorhanden)
export function getPostBySlug(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'content', 'posts');
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    category: data.category || 'Allgemein',
    description: data.description || '',
    author: data.author || 'Traphouse Redaktion',
    coverImage: data.coverImage || data.image || undefined,
    content,
  };
}