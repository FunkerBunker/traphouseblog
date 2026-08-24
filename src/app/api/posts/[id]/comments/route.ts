import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid post ID" }, { status: 400 });
    }

    const postComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, id))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json({ success: true, comments: postComments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const { authorName, content } = body;

    if (!authorName || !content) {
      return NextResponse.json(
        { success: false, error: "Author name and content are required" },
        { status: 400 }
      );
    }

    const newComment = await db
      .insert(comments)
      .values({
        postId: id,
        authorName,
        content,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({ success: true, comment: newComment[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}
