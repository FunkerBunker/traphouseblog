import { getAllPosts } from "@/lib/blog-store";
import { seedPosts } from "@/lib/seed-posts";
import BlogApp from "./components/BlogApp";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

function fallbackPosts(): Post[] {
  return seedPosts.map((post) => ({
    ...post,
    id: post.slug,
    comments: [],
  }));
}

export default async function HomePage() {
  let allPosts: Post[] = fallbackPosts();

  try {
    allPosts = await getAllPosts();
  } catch (error) {
    console.error("Homepage failed to load posts, using fallback content:", error);
  }

  return <BlogApp initialPosts={allPosts} />;
}
