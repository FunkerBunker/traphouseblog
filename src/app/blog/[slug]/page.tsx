import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog-store";
import PostPageClient from "@/app/components/PostPageClient";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | TrapHouseBlog" };
  }

  return {
    title: `${post.title} | TrapHouseBlog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <PostPageClient post={post} />;
}
