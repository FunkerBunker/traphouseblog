import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Automatically seed if empty
    const current = await db.select().from(posts).limit(1);
    if (current.length === 0) {
      await seedDatabase();
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    let allPosts;
    if (category && category !== "all") {
      allPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.category, category))
        .orderBy(desc(posts.createdAt));
    } else {
      allPosts = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt));
    }

    return NextResponse.json({ success: true, posts: allPosts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.floor(Math.random() * 10000);

    const newPost = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags || "Cannabis, Guide",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=1000",
        readTime: readTime || "5 min read",
        likes: 0,
        views: 0,
        isTop: isTop === true,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({ success: true, post: newPost[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
