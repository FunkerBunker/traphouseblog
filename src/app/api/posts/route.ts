import { NextRequest, NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const posts = await getAllPosts(category);

    return NextResponse.json({ success: true, posts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, tags, imageUrl, readTime, isTop } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (title, excerpt, content, category)" },
        { status: 400 }
      );
    }

    const post = await createPost({
      title,
      excerpt,
      content,
      category,
      tags: tags || "Cannabis, Guide",
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=1000",
      readTime: readTime || "5 min read",
      isTop: isTop === true,
    });

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
