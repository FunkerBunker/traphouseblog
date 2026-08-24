import { put, get, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { BlogData, Comment, Post, PostInput } from "./types";
import { seedPosts } from "./seed-posts";

const BLOG_PATH = "blog/data.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), ".data", "blog-data.json");

const emptyData = (): BlogData => ({ posts: [], subscribers: [] });

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readLocalData(): Promise<BlogData> {
  try {
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
    return JSON.parse(raw) as BlogData;
  } catch {
    return emptyData();
  }
}

async function writeLocalData(data: BlogData): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function readBlobData(): Promise<BlogData> {
  try {
    const result = await get(BLOG_PATH, { access: "private" });
    if (!result?.stream) {
      return emptyData();
    }
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as BlogData;
  } catch {
    const { blobs } = await list({ prefix: BLOG_PATH, limit: 1 });
    if (blobs.length === 0) return emptyData();

    const result = await get(blobs[0].url, { access: "private" });
    if (!result?.stream) return emptyData();

    const text = await new Response(result.stream).text();
    return JSON.parse(text) as BlogData;
  }
}

async function writeBlobData(data: BlogData): Promise<void> {
  await put(BLOG_PATH, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readData(): Promise<BlogData> {
  return useBlob() ? readBlobData() : readLocalData();
}

async function writeData(data: BlogData): Promise<void> {
  if (useBlob()) {
    await writeBlobData(data);
  } else {
    await writeLocalData(data);
  }
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.floor(Math.random() * 10000)
  );
}

function toPost(input: Omit<Post, "id" | "comments">, id?: string): Post {
  return {
    ...input,
    id: id ?? crypto.randomUUID(),
    comments: [],
  };
}

export async function ensureSeeded(): Promise<void> {
  const data = await readData();
  if (data.posts.length > 0) return;

  data.posts = seedPosts.map((post) => toPost(post));
  await writeData(data);
}

export async function getAllPosts(category?: string | null): Promise<Post[]> {
  await ensureSeeded();
  const data = await readData();
  let posts = [...data.posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (category && category !== "all") {
    posts = posts.filter((post) => post.category === category);
  }

  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await ensureSeeded();
  const data = await readData();
  return data.posts.find((post) => post.slug === slug) ?? null;
}

export async function createPost(input: PostInput): Promise<Post> {
  const data = await readData();
  const slug = input.slug?.trim() || slugify(input.title);

  if (data.posts.some((post) => post.slug === slug)) {
    throw new Error("A post with this slug already exists.");
  }

  const post = toPost({
    ...input,
    slug,
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString(),
  });

  data.posts.unshift(post);
  await writeData(data);
  return post;
}

export async function incrementLikes(slug: string): Promise<number | null> {
  const data = await readData();
  const post = data.posts.find((item) => item.slug === slug);
  if (!post) return null;

  post.likes += 1;
  await writeData(data);
  return post.likes;
}

export async function incrementViews(slug: string): Promise<number | null> {
  const data = await readData();
  const post = data.posts.find((item) => item.slug === slug);
  if (!post) return null;

  post.views += 1;
  await writeData(data);
  return post.views;
}

export async function getComments(slug: string): Promise<Comment[]> {
  const post = await getPostBySlug(slug);
  if (!post) return [];

  return [...post.comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addComment(
  slug: string,
  authorName: string,
  content: string
): Promise<Comment | null> {
  const data = await readData();
  const post = data.posts.find((item) => item.slug === slug);
  if (!post) return null;

  const comment: Comment = {
    id: crypto.randomUUID(),
    authorName,
    content,
    createdAt: new Date().toISOString(),
  };

  post.comments.unshift(comment);
  await writeData(data);
  return comment;
}

export async function subscribeEmail(email: string): Promise<boolean> {
  const data = await readData();
  const normalized = email.trim().toLowerCase();

  if (data.subscribers.includes(normalized)) {
    return false;
  }

  data.subscribers.push(normalized);
  await writeData(data);
  return true;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await readData();
    return true;
  } catch {
    return false;
  }
}
