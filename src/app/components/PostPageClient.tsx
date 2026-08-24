"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Heart, Leaf, MessageSquare, Moon, Sun, Tag, User } from "lucide-react";
import type { Comment, Post } from "@/lib/types";

const imagePresets: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1508595160601-399c1b004def?auto=format&fit=crop&q=80&w=800",
};

interface PostPageClientProps {
  post: Post;
}

export default function PostPageClient({ post: initialPost }: PostPageClientProps) {
  const [post, setPost] = useState(initialPost);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>(initialPost.comments ?? []);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
      localStorage.setItem("traphouse-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("traphouse-theme", "light");
    }
  }, [theme, mounted]);

  useEffect(() => {
    fetch(`/api/posts/${post.slug}/view`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost((prev) => ({ ...prev, views: data.views }));
        }
      })
      .catch(console.error);

    setCommentsLoading(true);
    fetch(`/api/posts/${post.slug}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCommentsList(data.comments);
      })
      .catch(console.error)
      .finally(() => setCommentsLoading(false));
  }, [post.slug]);

  const handleLikePost = async () => {
    setPost((prev) => ({ ...prev, likes: prev.likes + 1 }));
    try {
      const res = await fetch(`/api/posts/${post.slug}/like`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPost((prev) => ({ ...prev, likes: data.likes }));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: newCommentAuthor,
          content: newCommentContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentsList((prev) => [data.comment, ...prev]);
        setNewCommentContent("");
      }
    } catch (err) {
      console.error("Failed to submit comment", err);
    } finally {
      setIsSubmittingComment(false);
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
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all guides
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-emerald-500/10 bg-zinc-100 dark:bg-zinc-900"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="relative h-56 sm:h-72 rounded-3xl overflow-hidden bg-zinc-950">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = imagePresets["1"];
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="text-[10px] font-bold tracking-widest font-mono uppercase px-3 py-1 rounded-full bg-emerald-500 text-black">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">{post.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-emerald-500/10 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLikePost}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
            >
              <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500/40" />
              <span>{post.likes} Loves</span>
            </button>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Eye className="w-4 h-4" />
              <span>{post.views} Views</span>
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 italic border-l-4 border-emerald-500 pl-4">
          {post.excerpt}
        </p>

        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {post.content}
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center gap-1"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-500" />
              {tag.trim()}
            </span>
          ))}
        </div>

        <section className="border-t border-emerald-500/10 pt-8 space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-black font-mono">DISCUSSION ({commentsList.length})</h2>
          </div>

          <form
            onSubmit={handleSubmitComment}
            className="space-y-3 bg-zinc-100 dark:bg-zinc-950 p-4 rounded-2xl border border-emerald-500/5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Your Nickname"
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Share your experience..."
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs"
              >
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>

          {commentsLoading ? (
            <p className="text-xs text-zinc-500 animate-pulse">Loading comments...</p>
          ) : commentsList.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No comments yet. Start the discussion!</p>
          ) : (
            <div className="space-y-3">
              {commentsList.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{cmt.authorName}</span>
                    <span>
                      {new Date(cmt.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">{cmt.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
