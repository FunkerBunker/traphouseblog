import { NextRequest, NextResponse } from "next/server";
import { incrementLikes } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const likes = await incrementLikes(slug);

    if (likes === null) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to like post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
