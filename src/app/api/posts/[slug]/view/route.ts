import { NextRequest, NextResponse } from "next/server";
import { incrementViews } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const views = await incrementViews(slug);

    if (views === null) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, views });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to increment views";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
