import { NextRequest, NextResponse } from "next/server";
import { addComment, getComments, getPostBySlug } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const comments = await getComments(slug);
    return NextResponse.json({ success: true, comments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch comments";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { authorName, content } = body;

    if (!authorName || !content) {
      return NextResponse.json(
        { success: false, error: "Author name and content are required" },
        { status: 400 }
      );
    }

    const comment = await addComment(slug, authorName, content);
    if (!comment) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add comment";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
