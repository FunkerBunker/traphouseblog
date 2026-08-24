import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'growing', 'smoking', 'extracts', 'culture'
  tags: text("tags").notNull(), // Comma-separated or space-separated tags, e.g., "Hydroponics, Soil, THC"
  imageUrl: text("image_url").notNull(),
  readTime: text("read_time").notNull(), // e.g. "5 min read"
  likes: integer("likes").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  isTop: boolean("is_top").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Subscriber = typeof subscribers.$inferSelect;
