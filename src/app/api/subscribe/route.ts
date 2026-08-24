import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const isNew = await subscribeEmail(email);

    return NextResponse.json({
      success: true,
      message: isNew
        ? "Welcome to the TrapHouse VIP Club! 🍁 We've added you to our weekly tips feed."
        : "You are already on the VIP list! 🔥 Keep an eye out for fresh tips.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to subscribe";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
