import type { Post } from "./types";

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const seedPosts: Omit<Post, "id" | "comments">[] = [
  {
    slug: "maximize-trichomes-final-weeks-flower",
    title: "Maximize Trichomes in the Final 2 Weeks of Flower",
    excerpt:
      "Unlock the sticky, resinous buds of your dreams. Learn light stress, temperature drops, and ice-water flush secrets.",
    content: `### The Grand Finale: Trichome Production

As a cannabis grower, the final two weeks of the flowering stage are the most critical for potency, aroma, and bag appeal.

#### 1. Temperature Drops
Lower nighttime temperatures to **60°F–65°F (15°C–18°C)** during the final 10–14 days.

#### 2. Humidity Drop to 30%
Keep relative humidity around **30% to 35%** in the final week to prevent bud rot and boost resin.

Harvest when you see **70% milky and 30% amber** trichomes for the ultimate high!`,
    category: "growing",
    tags: "Trichomes, Flowering, Terpenes, Harvest",
    imageUrl:
      "https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80&w=1000",
    readTime: "7 min read",
    likes: 142,
    views: 890,
    isTop: true,
    createdAt: daysAgo(3),
  },
  {
    slug: "dutch-backflip-inside-out-rolling",
    title: "The Dutch Backflip: Master Inside-Out Rolling",
    excerpt:
      "Tired of tasting burning paper? Master the Dutch backflip roll and taste 100% of your terpene profile.",
    content: `### The Connoisseur's Choice: The Inside-Out Roll

In the Netherlands, serious tokers roll their joints "inside-out" or "backwards". You smoke **only one layer of paper** instead of 2 or 3.

#### Step-by-Step Guide
1. Hold the paper so the glue strip faces you on the bottom.
2. Fill and roll, tucking the glue strip against the inside layer.
3. Lick through the paper to seal, then tear or burn off the excess flap.

Spark it up and enjoy a joint that burns slower and tastes cleaner!`,
    category: "smoking",
    tags: "Rolling, Joints, Smoking, Dutch Style",
    imageUrl:
      "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=1000",
    readTime: "5 min read",
    likes: 218,
    views: 1250,
    isTop: true,
    createdAt: daysAgo(1),
  },
  {
    slug: "terpenes-decoded-real-reason-indica-sativa",
    title: "Terpene Decoded: The Real Reason Behind Indica & Sativa Effects",
    excerpt:
      "It's not just THC. Learn how Myrcene, Limonene, and Linalool form the Entourage Effect.",
    content: `### Beyond THC: The Entourage Effect

The true conductor of your high is **the terpene profile** — aromatic compounds in trichomes that modulate how THC interacts with CB1 receptors.

#### Myrcene — The Couch-Lock Terpene
Earthy, musky aroma. Found in mangoes and strains like OG Kush. Strongly sedative above **0.5%**.

#### Limonene — Liquid Sunshine
Bright citrus aroma. Uplifting, anti-anxiety, promotes dopamine release.

Match terpenes to your desired vibe, not just THC percentage. Your nose knows best!`,
    category: "smoking",
    tags: "Terpenes, Science, Strains, Flavor",
    imageUrl:
      "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=1000",
    readTime: "6 min read",
    likes: 185,
    views: 1100,
    isTop: true,
    createdAt: daysAgo(5),
  },
];
