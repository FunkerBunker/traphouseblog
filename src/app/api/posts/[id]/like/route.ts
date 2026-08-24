import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid post ID" }, { status: 400 });
    }

    const updated = await db
      .update(posts)
      .set({
        likes: sql`${posts.likes} + 1`
      })
      .where(eq(posts.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes: updated[0].likes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to like post" },
      { status: 500 }
    );
  }
}
