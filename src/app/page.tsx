import { getAllPosts } from "@/lib/blog-store";
import BlogApp from "./components/BlogApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allPosts = await getAllPosts();
  return <BlogApp initialPosts={allPosts} />;
}
