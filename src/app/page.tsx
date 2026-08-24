import { db } from "@/db";
import { posts } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { desc } from "drizzle-orm";
import BlogApp from "./components/BlogApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let allPosts = [];
  
  try {
    // Attempt to query posts
    allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    
    // Seed if empty
    if (allPosts.length === 0) {
      await seedDatabase();
      allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    }
  } catch (error) {
    console.error("Database query or seed failed, using local fallback content to avoid crash", error);
    // Standard failover content if postgres is transiently unavailable during build or start
    allPosts = [
      {
        id: 1,
        title: "Maximize Trichomes in the Final 2 Weeks of Flower",
        slug: "maximize-trichomes-final-weeks-flower",
        excerpt: "Unlock the sticky, resinous buds of your dreams. Learn the exact light stress, temperature drops, and ice-water flush secrets to force insane resin production.",
        content: `### The Grand Finale: Trichome Production
As a cannabis grower, the final two weeks of the flowering stage are the most critical for potency, aroma, and bag appeal. By applying strategic environmental stressors, you can trick the female cannabis plant into boosting its defense mechanism, which is resin production.`,
        category: "growing",
        tags: "Trichomes, Flowering, Terpenes, Harvest",
        imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80&w=1000",
        readTime: "7 min read",
        likes: 142,
        views: 890,
        isTop: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "The Dutch Backflip: Master Inside-Out Rolling",
        slug: "dutch-backflip-inside-out-rolling",
        excerpt: "Tired of tasting burning paper? Master the Dutch backflip (inside-out roll). Burn less paper, taste 100% of your terpene profile, and elevate your joint game.",
        content: `### The Connoisseur's Choice: The Inside-Out Roll
In the Netherlands, serious tokers roll their joints "inside-out" or "backwards". By rolling with the paper inside-out, you tuck the glue line early and tear or burn off the excess paper flap.`,
        category: "smoking",
        tags: "Rolling, Joints, Smoking, Dutch Style",
        imageUrl: "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=1000",
        readTime: "5 min read",
        likes: 218,
        views: 1250,
        isTop: true,
        createdAt: new Date(),
      }
    ];
  }

  return <BlogApp initialPosts={allPosts} />;
}
