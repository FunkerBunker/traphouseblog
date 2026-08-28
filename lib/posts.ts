import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  coverImage: string;
  youtubeUrl?: string;
  faqs?: Array<{ question: string; answer: string }>;
  content: string;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

// Hilfsfunktion zur Berechnung der Lesezeit (ca. 200 Wörter pro Minute)
export function getReadingTime(content: string): string {
  const cleanContent = content
    .replace(/---[\s\S]*?---/, '') // Frontmatter entfernen
    .replace(/<[^>]*>/g, '')        // HTML/JSX-Tags entfernen
    .replace(/\[\[.*?\]\]/g, '');    // Bild-Marker entfernen

  const words = cleanContent.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);

  return `Lesezeit: ${minutes} min.`;
}

// Alle Artikel für die Übersichtsseite abrufen
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter((f) => /\.mdx?$/.test(f));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || '',
      category: data.category || '',
      coverImage: data.coverImage || data.image || '',
      youtubeUrl: data.youtubeUrl,
      faqs: data.faqs || [],
      content,
      readingTime: getReadingTime(content),
    };
  });

  // Nach Datum sortieren (neueste zuerst)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Einzelnen Artikel für die Detailseite abrufen
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || '',
    category: data.category || '',
    coverImage: data.coverImage || data.image || '',
    youtubeUrl: data.youtubeUrl,
    faqs: data.faqs || [],
    content,
    readingTime: getReadingTime(content),
  };
}