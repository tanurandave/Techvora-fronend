import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchPublishedArticles, Article } from "@/lib/api";
import {
  Search,
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Filter,
} from "lucide-react";

const sampleFallbackArticles: Article[] = [
  {
    id: "sample-1",
    title: "Building Microservices with Spring Boot 4 & PostgreSQL",
    slug: "building-microservices-with-spring-boot-4",
    excerpt: "Learn how to design, build, and deploy cloud-native Java microservices using Spring Boot 4, JPA, and Neon PostgreSQL.",
    content: "# Spring Boot 4 Microservices Guide",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    status: "PUBLISHED",
    readingTime: 6,
    authorName: "Super Admin",
    categoryName: "Spring Boot",
    subcategory: "REST APIs",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "React 19 Server Components & Next.js 16 Architecture",
    slug: "react-19-server-components-nextjs-16",
    excerpt: "Master the latest React 19 features, server actions, and App Router architecture patterns for lightning-fast web apps.",
    content: "# React 19 Guide",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    status: "PUBLISHED",
    readingTime: 5,
    authorName: "Sarah Connor",
    categoryName: "React & Next.js",
    subcategory: "Frontend",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "sample-3",
    title: "Interview Ready React JS & System Design Notes",
    slug: "interview-ready-react-js-notes",
    excerpt: "Comprehensive cheat sheet covering state management, performance hooks, virtual DOM internals, and system design questions.",
    content: "# Interview Ready React Notes",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
    status: "PUBLISHED",
    readingTime: 8,
    authorName: "Alex Mercer",
    categoryName: "Architecture",
    subcategory: "System Design",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default async function BlogFeed() {
  let articles: Article[] = [];
  try {
    const response = await fetchPublishedArticles();
    if (response && response.content && response.content.length > 0) {
      articles = response.content;
    } else {
      articles = sampleFallbackArticles;
    }
  } catch (error) {
    articles = sampleFallbackArticles;
  }

  const featuredArticle = articles[0];
  const regularArticles = articles.length > 1 ? articles.slice(1) : articles;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    const d = new Date(dateStr);
    if (isNaN(d.getTime()) || d.getFullYear() <= 1970) return "Recently";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <main className="min-h-screen bg-slate-50/70 dark:bg-slate-950 pb-20">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/4 top-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl space-y-6 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="bg-orange-500 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Technical Publication
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                TECHVORA <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">BLOG</span>
              </h1>
              <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed">
                In-depth tutorials, system architecture guides, and technical notes for modern full-stack developers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search articles by topic..."
                className="w-full bg-white/10 backdrop-blur-md text-white placeholder-slate-300 text-xs rounded-2xl pl-11 pr-4 py-3.5 border border-white/20 focus:outline-none focus:border-orange-400 transition-all shadow-lg"
              />
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 border-t border-blue-800/80 text-xs font-bold no-scrollbar">
            <span className="text-slate-400 flex items-center gap-1 mr-2 text-[11px]">
              <Filter className="w-3.5 h-3.5" /> Topics:
            </span>
            {["All Topics", "Spring Boot", "Java 21", "React & Next.js", "Architecture", "DevOps", "Database"].map((cat, idx) => (
              <button
                key={cat}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  idx === 0
                    ? "bg-orange-500 text-white shadow-md font-extrabold"
                    : "bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white border border-blue-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Body Container */}
      <div className="container mx-auto px-4 max-w-6xl space-y-12 mt-10">
        {/* Featured Hero Article Banner */}
        {featuredArticle && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 group hover:shadow-2xl transition-all duration-300">
            {/* Image Box */}
            <div className="relative h-64 lg:h-full bg-slate-900 overflow-hidden">
              {featuredArticle.coverImage ? (
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 p-8 flex flex-col justify-between">
                  <span className="bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full w-fit">
                    Featured
                  </span>
                  <BookOpen className="w-16 h-16 text-blue-400/40" />
                </div>
              )}
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                <span className="bg-orange-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  ★ Spotlight Guide
                </span>
              </div>
            </div>

            {/* Content Box */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200/50">
                    {featuredArticle.categoryName || "Spring Boot"}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">• {featuredArticle.readingTime || 5} min read</span>
                </div>

                <Link href={`/blog/${featuredArticle.slug}`}>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                    {featuredArticle.authorName ? featuredArticle.authorName.charAt(0).toUpperCase() : "T"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{featuredArticle.authorName || "Techvora Staff"}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}</p>
                  </div>
                </div>

                <Link href={`/blog/${featuredArticle.slug}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Latest Articles & Tutorials
            </h3>
            <span className="text-xs font-bold text-slate-400">{articles.length} Published Posts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <Link href={`/blog/${article.slug}`} key={article.id} className="group flex">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-full overflow-hidden hover:-translate-y-1">
                  {/* Card Cover Image */}
                  <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-slate-900 p-6 flex flex-col justify-between text-white">
                        <BookOpen className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-bold text-blue-200">{article.categoryName || "Engineering"}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/80 text-white backdrop-blur-xs font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20">
                        {article.categoryName || "Engineering"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-extrabold flex items-center justify-center text-[10px]">
                          {article.authorName ? article.authorName.charAt(0).toUpperCase() : "T"}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                          {article.authorName || "Techvora"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
