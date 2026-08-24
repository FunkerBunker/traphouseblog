"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Leaf, Moon, Sun } from "lucide-react";

const imagePresets: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1508595160601-399c1b004def?auto=format&fit=crop&q=80&w=800",
  "2": "https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80&w=800",
  "3": "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=800",
  "4": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
};

export default function NewPostPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [createPostError, setCreatePostError] = useState<string | null>(null);
  const [newPostForm, setNewPostForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "growing",
    tags: "",
    imageUrlPreset: "1",
    readTime: "5 min read",
    isTop: false,
    customImageUrl: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("traphouse-theme");
    setTheme(savedTheme === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatePostError(null);

    const { title, excerpt, content, category, tags, imageUrlPreset, readTime, isTop, customImageUrl } =
      newPostForm;

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setCreatePostError("Please fill out title, excerpt, and content.");
      return;
    }

    setIsCreatingPost(true);
    const finalImageUrl = customImageUrl.trim()
      ? customImageUrl
      : imagePresets[imageUrlPreset] || imagePresets["1"];

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          tags,
          imageUrl: finalImageUrl,
          readTime,
          isTop,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/blog/${data.post.slug}`);
      } else {
        setCreatePostError(data.error || "Failed to publish post.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setCreatePostError("Error publishing: " + message);
    } finally {
      setIsCreatingPost(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Leaf className="w-12 h-12 animate-pulse text-emerald-400" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        theme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-stone-50 text-zinc-900"
      }`}
    >
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-emerald-500/10 bg-white/70 dark:bg-zinc-950/80">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-emerald-500/10 bg-zinc-100 dark:bg-zinc-900"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-emerald-500 mb-6">
          <Leaf className="w-5 h-5" />
          <h1 className="text-xl font-black font-mono tracking-wider">CREATE NEW BLOG POST</h1>
        </div>

        {createPostError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {createPostError}
          </div>
        )}

        <form onSubmit={handleCreatePost} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="block font-bold text-zinc-400 uppercase tracking-wider font-mono text-xs">
              Title *
            </label>
            <input
              type="text"
              required
              value={newPostForm.title}
              onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-zinc-400 uppercase tracking-wider font-mono text-xs">
              Excerpt *
            </label>
            <input
              type="text"
              required
              value={newPostForm.excerpt}
              onChange={(e) => setNewPostForm({ ...newPostForm, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-zinc-400 uppercase tracking-wider font-mono text-xs">
                Category
              </label>
              <select
                value={newPostForm.category}
                onChange={(e) => setNewPostForm({ ...newPostForm, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              >
                <option value="growing">Growing</option>
                <option value="smoking">Smoking</option>
                <option value="extracts">Extracts</option>
                <option value="culture">Culture</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-zinc-400 uppercase tracking-wider font-mono text-xs">
                Read Time
              </label>
              <input
                type="text"
                value={newPostForm.readTime}
                onChange={(e) => setNewPostForm({ ...newPostForm, readTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-zinc-400 uppercase tracking-wider font-mono text-xs">
              Tags
            </label>
            <input
              type="text"
              placeholder="Trichomes, Harvest, Organic"
              value={newPostForm.tags}
              onChange={(e) => setNewPostForm({ ...newPostForm, tags: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-zinc-400 uppercase tracking-wider font-mono text-xs">
              Content *
            </label>
            <textarea
              required
              rows={12}
              value={newPostForm.content}
              onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase">
            <input
              type="checkbox"
              checked={newPostForm.isTop}
              onChange={(e) => setNewPostForm({ ...newPostForm, isTop: e.target.checked })}
            />
            Feature in Top Blogs
          </label>

          <button
            type="submit"
            disabled={isCreatingPost}
            className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm"
          >
            {isCreatingPost ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </main>
    </div>
  );
}
