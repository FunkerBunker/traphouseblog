"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Leaf,
  Flame,
  Wind,
  Lightbulb,
  Sparkles,
  Heart,
  Eye,
  Search,
  Plus,
  X,
  Sun,
  Moon,
  Mail,
  BookOpen,
  Calendar,
  Share2,
  TrendingUp,
  BookMarked,
  Layers,
  HelpCircle,
} from "lucide-react";
import type { Post } from "@/lib/types";

interface BlogAppProps {
  initialPosts: Post[];
}

export default function BlogApp({ initialPosts }: BlogAppProps) {
  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // Core posts list
  const [postsList, setPostsList] = useState<Post[]>(initialPosts);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Newsletter subscription
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);

  // Copy to clipboard notification
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Load theme from localStorage and mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("traphouse-theme");
    if (savedTheme === "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  // Sync theme to HTML class
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

  // Image presets mapping
  const imagePresets: Record<string, string> = {
    "1": "https://images.unsplash.com/photo-1508595160601-399c1b004def?auto=format&fit=crop&q=80&w=800", // Grow Room
    "2": "https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80&w=800", // Frosty Trichomes
    "3": "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?auto=format&fit=crop&q=80&w=800", // Joint Roll
    "4": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800", // Live Rosin
  };

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return postsList.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [postsList, searchQuery, selectedCategory]);

  // Extract Top Blogs
  const topBlogs = useMemo(() => {
    return postsList.filter((post) => post.isTop);
  }, [postsList]);

  // Category counts mapping
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      growing: 0,
      smoking: 0,
      extracts: 0,
      culture: 0,
    };
    postsList.forEach((post) => {
      if (counts[post.category] !== undefined) {
        counts[post.category]++;
      }
    });
    return counts;
  }, [postsList]);

  // Like a post
  const handleLikePost = async (e: React.MouseEvent, slug: string, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setPostsList((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );

    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPostsList((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
        );
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Subscribe to newsletter
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes("@")) {
      setSubscribeMessage({ text: "Please enter a valid email address.", success: false });
      return;
    }

    setIsSubscribing(true);
    setSubscribeMessage(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();
      setSubscribeMessage({
        text: data.message || (data.success ? "Subscribed successfully!" : "Failed to subscribe."),
        success: data.success,
      });
      if (data.success) {
        setSubscribeEmail("");
      }
    } catch (err) {
      setSubscribeMessage({ text: "An error occurred. Please try again.", success: false });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Copy Post link to Clipboard
  const handleSharePost = (e: React.MouseEvent, post: Post) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${post.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  // Scroll to section helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    // Return loading skeleton or empty page during hydration to prevent flickering
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-emerald-500 flex flex-col items-center gap-4">
          <Leaf className="w-12 h-12 animate-pulse text-emerald-400" />
          <p className="text-zinc-400 text-sm font-mono tracking-widest animate-pulse">BOOTING TRAPHOUSEBLOG...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans relative overflow-x-hidden ${
        theme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-stone-50 text-zinc-900"
      }`}
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5 animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[140px] dark:bg-green-600/5 animate-pulse-glow" />

        {/* Ambient floating smoke shapes */}
        <div className="absolute bottom-[5%] left-[5%] w-72 h-72 rounded-full bg-emerald-500/5 blur-[80px] dark:bg-emerald-500/10 animate-smoke-slow" />
        <div className="absolute top-[30%] right-[10%] w-96 h-96 rounded-full bg-stone-300/10 blur-[90px] dark:bg-zinc-700/10 animate-smoke-medium" />
        <div className="absolute bottom-[40%] left-[40%] w-80 h-80 rounded-full bg-green-400/5 blur-[70px] dark:bg-emerald-400/5 animate-smoke-fast" />

        {/* Falling stylized cannabis leaves (Simulated via SVG drift effects) */}
        <div className="absolute top-10 left-[15%] text-emerald-500/10 dark:text-emerald-500/20 animate-drift-leaf-1">
          <Leaf className="w-8 h-8 rotate-[45deg]" />
        </div>
        <div className="absolute top-[40%] right-[25%] text-emerald-600/10 dark:text-emerald-400/10 animate-drift-leaf-2">
          <Leaf className="w-12 h-12 rotate-[120deg]" />
        </div>
        <div className="absolute top-[20%] right-[5%] text-emerald-500/5 dark:text-emerald-300/10 animate-drift-leaf-3">
          <Leaf className="w-6 h-6 rotate-[-30deg]" />
        </div>
        <div className="absolute top-[70%] left-[8%] text-emerald-500/10 dark:text-emerald-500/15 animate-drift-leaf-2">
          <Leaf className="w-10 h-10 rotate-[15deg]" />
        </div>
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-emerald-500/10 bg-white/70 dark:bg-zinc-950/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}>
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 opacity-75 blur-sm group-hover:opacity-100 transition duration-300 animate-pulse" />
              <div className="relative w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-emerald-400/30">
                <Leaf className="w-6 h-6 text-emerald-400 fill-emerald-400/20 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight flex items-center gap-1.5 font-mono">
                TRAP<span className="text-emerald-500 dark:text-emerald-400">HOUSE</span>
                <span className="text-xs bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 px-1.5 py-0.5 rounded font-sans tracking-widest font-bold">BLOG</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400">ORGANIC CULTIVATION & SMOKING SECRETS</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => { setSelectedCategory("all"); scrollToId("feed-section"); }}
              className="hover:text-emerald-500 transition-colors py-2 px-1 text-zinc-600 dark:text-zinc-300 hover:dark:text-emerald-400"
            >
              All Secrets
            </button>
            <button
              onClick={() => { setSelectedCategory("growing"); scrollToId("feed-section"); }}
              className={`hover:text-emerald-500 transition-colors py-2 px-1 flex items-center gap-1.5 ${
                selectedCategory === "growing" ? "text-emerald-500 font-bold" : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-500" /> Growing
            </button>
            <button
              onClick={() => { setSelectedCategory("smoking"); scrollToId("feed-section"); }}
              className={`hover:text-emerald-500 transition-colors py-2 px-1 flex items-center gap-1.5 ${
                selectedCategory === "smoking" ? "text-emerald-500 font-bold" : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500" /> Smoking
            </button>
            <button
              onClick={() => { setSelectedCategory("extracts"); scrollToId("feed-section"); }}
              className={`hover:text-emerald-500 transition-colors py-2 px-1 flex items-center gap-1.5 ${
                selectedCategory === "extracts" ? "text-emerald-500 font-bold" : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              <Wind className="w-4 h-4 text-teal-400" /> Extracts
            </button>
            <button
              onClick={() => scrollToId("clusters-section")}
              className="hover:text-emerald-500 transition-colors py-2 px-1 text-zinc-600 dark:text-zinc-300 hover:dark:text-emerald-400"
            >
              Theme Clusters
            </button>
          </nav>

          {/* Actions: Theme Toggle & Post Creator */}
          <div className="flex items-center gap-3">
            {/* Create Post Button */}
            <Link
              href="/new"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 border border-emerald-500/20 text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-emerald-500/10 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all active:scale-90"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              <span>Craft Weed Knowledge Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight font-sans">
              The Underground <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 dark:from-emerald-400 dark:via-green-300 dark:to-emerald-500 font-mono">
                Grower & Smoker
              </span>{" "}
              Bible
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
              Step into the <span className="font-semibold text-emerald-500 dark:text-emerald-400">TrapHouseBlog</span>. We unpack the absolute truth behind premium cannabis cultivation, master rolling techniques, terpene chemistry, and pure solventless wizardry. No fluff, just heavy-hitting guides for growers and smoking connoisseurs.
            </p>

            {/* Quick stats board */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-md border-t border-emerald-500/10">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
                  {postsList.length}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">Master Guides</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
                  100%
                </span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">Organic Vibes</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
                  4.9â˜…
                </span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">Reader Rating</span>
              </div>
            </div>

            {/* Search input widget */}
            <div className="pt-4 max-w-lg">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 opacity-20 group-focus-within:opacity-50 blur transition duration-300" />
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-emerald-500/20 dark:border-zinc-800 rounded-full px-4 py-3 shadow-md">
                  <Search className="w-5 h-5 text-zinc-400 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search soil, hydroponics, joints, terpenes, dabs..."
                    className="w-full bg-transparent focus:outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {/* Quick tags */}
              <div className="flex flex-wrap gap-2 mt-3 pl-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Try searching:</span>
                {["Trichomes", "Joints", "Terpenes", "Soil", "LST", "Rosin"].map((qTag) => (
                  <button
                    key={qTag}
                    onClick={() => { setSearchQuery(qTag); scrollToId("feed-section"); }}
                    className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 transition-all hover:scale-105"
                  >
                    #{qTag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Right Visuals - Sticky Vaporizing Leaf Graphics */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20 bg-zinc-900 flex items-center justify-center p-8 group">
              {/* Spinning glow circle */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-500/20 via-green-500/10 to-transparent rounded-full animate-spin-slow" />

              <div className="relative z-10 text-center space-y-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center animate-pulse">
                  <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 fill-emerald-400/20" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black tracking-widest text-emerald-400 font-mono">TRAP SECRET</h3>
                  <p className="text-xs text-zinc-400 italic">"The nose never lies. If it doesn't smell loud, it won't smoke right. Follow the terps, not the THC."</p>
                </div>

                <div className="pt-2 flex justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">142 Active Smokers Online</span>
                </div>
              </div>

              {/* Smoke particle indicators */}
              <div className="absolute top-[80%] left-[20%] w-10 h-10 rounded-full bg-zinc-500/10 blur-[8px] animate-smoke-fast" />
              <div className="absolute top-[70%] right-[30%] w-12 h-12 rounded-full bg-stone-500/10 blur-[10px] animate-smoke-medium" />
              <div className="absolute bottom-[10%] left-[50%] w-16 h-16 rounded-full bg-emerald-500/5 blur-[12px] animate-smoke-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* TOP BLOGS (Featured Slider/Grid at the top) */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-emerald-500/10 bg-emerald-500/[0.01]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>THE HIGHEST RATED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 font-sans">
              Top Blogs & Featured Guides
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 md:mt-0 max-w-sm">
            Our most detailed cultivation and smoking manuals, voted up by our local growing family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topBlogs.slice(0, 3).map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-emerald-500/10 bg-white dark:bg-zinc-900 hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full shadow-md hover:shadow-xl hover:-translate-y-1 relative"
            >
              {/* Category tag bubble */}
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[10px] font-bold tracking-widest font-mono uppercase px-2.5 py-1 rounded-full bg-zinc-900/90 text-emerald-400 border border-emerald-400/20 backdrop-blur-sm">
                  {blog.category}
                </span>
              </div>

              {/* Image banner */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-950">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback to placeholder if broken image URL
                    (e.target as HTMLImageElement).src = imagePresets["1"];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>â€¢</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Card Footer actions */}
                <div className="pt-4 border-t border-emerald-500/5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-3 font-semibold">
                    <button
                      onClick={(e) => handleLikePost(e, blog.slug, blog.id)}
                      className="flex items-center gap-1 py-1 px-2 rounded-full hover:bg-emerald-500/5 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all active:scale-90"
                    >
                      <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500/10 group-hover:scale-110" />
                      <span>{blog.likes}</span>
                    </button>

                    <span className="flex items-center gap-1 py-1 px-2">
                      <Eye className="w-4 h-4 text-zinc-400" />
                      <span>{blog.views}</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleSharePost(e, blog)}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all"
                    title="Copy Article Link"
                  >
                    {copiedPostId === blog.id ? (
                      <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400">Copied!</span>
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MAIN ARTICLE FEED (Recent blogs section below) */}
      <section id="feed-section" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-t border-emerald-500/10 pt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <BookMarked className="w-4 h-4" />
                <span>CHRONOLOGICAL CHRONICLES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 font-sans">
                Recent Secrets & Guides
              </h2>
            </div>

            {/* Quick Category Tab Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Vibes" },
                { id: "growing", label: "ðŸª´ Growing" },
                { id: "smoking", label: "ðŸ’¨ Smoking" },
                { id: "extracts", label: "ðŸ¯ Extracts" },
                { id: "culture", label: "ðŸŒ¿ Culture" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                    selectedCategory === tab.id
                      ? "bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-black font-bold"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-emerald-500/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Summary if query exists */}
          {searchQuery && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
              <span className="text-sm">
                Found <span className="font-bold text-emerald-500">{filteredPosts.length}</span> guides matching "
                <span className="italic font-semibold">{searchQuery}</span>"
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-emerald-500 hover:text-emerald-600 underline font-semibold"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Feed Grid */}
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-emerald-500/20 rounded-2xl max-w-xl mx-auto bg-emerald-500/[0.01]">
              <HelpCircle className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <p className="text-lg font-black font-mono tracking-wide text-zinc-400">NO CULTIVATION SECRETS FOUND</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto">
                No articles matched your criteria. Try adjusting your query or write the very first guide on this topic!
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="mt-4 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-lg relative"
                >
                  {/* Category overlay */}
                  <span className="absolute top-3 right-3 z-10 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-emerald-400 border border-emerald-400/20">
                    {blog.category}
                  </span>

                  <div className="relative h-44 overflow-hidden rounded-t-2xl bg-zinc-950">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = imagePresets["1"];
                      }}
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                        <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <span>â€¢</span>
                        <span>{blog.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Tags array preview */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {blog.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2.5 font-semibold">
                        <button
                          onClick={(e) => handleLikePost(e, blog.slug, blog.id)}
                          className="flex items-center gap-1 hover:text-emerald-500"
                        >
                          <Heart className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{blog.likes}</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{blog.views}</span>
                        </span>
                      </div>

                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                        View Guide <BookOpen className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* THEME CLUSTERS / CATEGORIES (Below feed) */}
      <section id="clusters-section" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-transparent to-emerald-500/[0.02]">
        <div className="border-t border-emerald-500/10 pt-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
              <Layers className="w-4 h-4" />
              <span>THEME-CLUSTER ROADMAPS</span>
            </div>
            <h2 className="text-3xl font-black mt-2 font-sans">
              Explore Our Knowledge Clusters
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Deep-dive into specialized fields of cannabis knowledge. Each cluster aggregates premium tips carefully peer-reviewed for potency and health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Cluster 1: Growing */}
            <div
              onClick={() => { setSelectedCategory("growing"); scrollToId("feed-section"); }}
              className="group cursor-pointer p-6 rounded-2xl border border-amber-500/10 dark:border-amber-500/5 bg-white dark:bg-zinc-900/60 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-5">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold group-hover:text-amber-500 transition-colors">Growing Secrets</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Maximize bud density, trichomes, and harvest weight. Guides covering organic living soil, LED setups, pruning, flushing, and curing schedules.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono font-bold text-amber-500">
                  {categoryCounts.growing} active secrets
                </span>
                <span className="font-semibold text-amber-500 group-hover:underline">Explore âž”</span>
              </div>
            </div>

            {/* Cluster 2: Smoking */}
            <div
              onClick={() => { setSelectedCategory("smoking"); scrollToId("feed-section"); }}
              className="group cursor-pointer p-6 rounded-2xl border border-orange-500/10 dark:border-orange-500/5 bg-white dark:bg-zinc-900/60 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">Smoking Arts</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Elevate your daily ritual. Backflip rolling, joint-tucking, clean glass bong science, dry herb vaporization, and terpene temperature optimization.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono font-bold text-orange-500">
                  {categoryCounts.smoking} active secrets
                </span>
                <span className="font-semibold text-orange-500 group-hover:underline">Explore âž”</span>
              </div>
            </div>

            {/* Cluster 3: Extracts */}
            <div
              onClick={() => { setSelectedCategory("extracts"); scrollToId("feed-section"); }}
              className="group cursor-pointer p-6 rounded-2xl border border-teal-500/10 dark:border-teal-500/5 bg-white dark:bg-zinc-900/60 hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-5">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold group-hover:text-teal-400 transition-colors">Extract Chemistry</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                The peak of purity. Solventless Live Rosin, bubble hash water temperature, micron bag selection, pressure dynamics, and optimal dabbing temperatures.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono font-bold text-teal-400">
                  {categoryCounts.extracts} active secrets
                </span>
                <span className="font-semibold text-teal-400 group-hover:underline">Explore âž”</span>
              </div>
            </div>

            {/* Cluster 4: Culture */}
            <div
              onClick={() => { setSelectedCategory("culture"); scrollToId("feed-section"); }}
              className="group cursor-pointer p-6 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/5 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-5">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold group-hover:text-emerald-500 transition-colors">Culture & Terps</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Scientific strain evaluations, terpenes deep-dive, historic context, and the entourage effects that dictate human endocannabinoid responses.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono font-bold text-emerald-500">
                  {categoryCounts.culture} active secrets
                </span>
                <span className="font-semibold text-emerald-500 group-hover:underline">Explore âž”</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER VIP CLUB SECTION */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-tr from-emerald-900 to-zinc-900 dark:from-zinc-900 dark:to-emerald-950/40 border border-emerald-500/20 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative design */}
          <div className="absolute top-[-20%] left-[-10%] w-56 h-56 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="absolute bottom-[-10%] right-[-15%] w-60 h-60 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 animate-pulse">
              <Mail className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wide">
              JOIN THE VIP TRAP CLUB
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              We deliver heavy-hitting growing secrets and rolling guides direct to your inbox once a week. Strictly pure craft knowledge. No spam, ever.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                required
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-full bg-zinc-950/80 border border-emerald-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-400 font-bold text-sm transition-all shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
              >
                {isSubscribing ? "Joining..." : "Get Loud ðŸ”¥"}
              </button>
            </form>

            {subscribeMessage && (
              <p
                className={`text-xs font-semibold font-mono ${
                  subscribeMessage.success ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {subscribeMessage.text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-white dark:bg-zinc-950 border-t border-emerald-500/10 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-7 h-7 text-emerald-500" />
                <span className="text-lg font-black tracking-widest font-mono">
                  TRAP<span className="text-emerald-500">HOUSE</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                TrapHouseBlog is an underground collaborative archive dedicated to the science and culture of organic growing and artisanal cannabis smoking. We promote legal, responsible home growing where legally permitted.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 font-mono mb-4">
                GUIDE CATEGORIES
              </h4>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li>
                  <button onClick={() => { setSelectedCategory("growing"); scrollToId("feed-section"); }} className="hover:text-emerald-500">
                    ðŸª´ Hydro & Living Soil Growing
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory("smoking"); scrollToId("feed-section"); }} className="hover:text-emerald-500">
                    ðŸ’¨ Joint Crafting & Rolling Art
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory("extracts"); scrollToId("feed-section"); }} className="hover:text-emerald-500">
                    ðŸ¯ Live Rosin & Bubble Hash
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory("culture"); scrollToId("feed-section"); }} className="hover:text-emerald-500">
                    ðŸŒ¿ Terpenes & Cannabinoid Science
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 font-mono mb-4">
                OUR CODE OF ETHICS
              </h4>
              <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                â€¢ 100% Organic Pesticide-Free Advice <br />
                â€¢ Safe & Clean Filtration Methods <br />
                â€¢ Pure Terpene-focused Flavor <br />
                â€¢ Zero Chemical Solvent extraction
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-emerald-500/5 text-center text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <p>Â© {new Date().getFullYear()} TrapHouseBlog Inc. Created with pure love, smoke & light. Keep it organic.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
