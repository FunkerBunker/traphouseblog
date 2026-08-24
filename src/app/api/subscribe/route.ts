import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    // Check if already subscribed
    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "You are already on the VIP list! 🔥 Keep an eye out for fresh tips."
      });
    }

    await db.insert(subscribers).values({
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Welcome to the TrapHouse VIP Club! 🍁 We've added you to our weekly tips feed."
    });
  } catch (error: any) {
    if (error.code === "23505") { // unique constraint violation
      return NextResponse.json({
        success: true,
        message: "You are already on the VIP list! 🔥 Keep an eye out for fresh tips."
      });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
