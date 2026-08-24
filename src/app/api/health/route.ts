import { healthCheck } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const ok = await healthCheck();
  return Response.json({ ok });
}
