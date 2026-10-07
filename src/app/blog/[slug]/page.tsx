import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { fetchArticleBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import {
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  ArrowLeft,
  Tag as TagIcon,
  Sparkles,
  CheckCircle,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await fetchArticleBySlug(slug);
    return {
      title: article.seoTitle || `${article.title} - Techvora`,
      description: article.seoDescription || article.excerpt,
      openGraph: {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt,
        images: [article.coverImage || "https://techvora.com/default-cover.jpg"],
      },
    };
  } catch (e) {
    return { title: "Article Not Found - Techvora" };
  }
}

// Markdown parser helper for structured HTML rendering
function renderMarkdown(content: string) {
  if (!content) return "";

  let raw = content;

  // Code Blocks ```lang ... ```
  raw = raw.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || "code";
    const cleanCode = code
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<div class="my-6 rounded-2xl bg-slate-900 text-slate-100 p-5 overflow-x-auto font-mono text-xs shadow-lg border border-slate-800 relative group"><div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider"><span>${language}</span><span>CODE</span></div><pre class="m-0 leading-relaxed font-mono"><code>${cleanCode.trim()}</code></pre></div>`;
  });

  // Inline Code `code`
  raw = raw.replace(/`([^`]+)`/g, '<code class="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-xs px-2 py-0.5 rounded-md border border-blue-200/50">$1</code>');

  // Headings
  raw = raw.replace(/^### (.*$)/gim, '<h3 class="text-xl font-extrabold text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">$1</h3>');
  raw = raw.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight border-b border-slate-200/60 dark:border-slate-800 pb-2">$1</h2>');
  raw = raw.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">$1</h1>');

  // Blockquotes
  raw = raw.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 pl-4 py-3 my-6 italic text-slate-700 dark:text-slate-300 text-sm rounded-r-xl">$1</blockquote>');

  // Bold & Italic
  raw = raw.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900 dark:text-white">$1</strong>');
  raw = raw.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>');

  // Bullet Lists
  raw = raw.replace(/^\- (.*$)/gim, '<li class="ml-5 list-disc my-1 text-slate-700 dark:text-slate-300 text-sm">$1</li>');

  // Line breaks
  raw = raw.replace(/\n\n/g, '</p><p class="my-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">');
  raw = raw.replace(/\n/g, '<br/>');

  return `<p class="my-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">${raw}</p>`;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let article = null;
  try {
    article = await fetchArticleBySlug(slug);
  } catch (error) {
    notFound();
  }

  // Safe Date Formatting Helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const d = new Date(dateStr);
    if (isNaN(d.getTime()) || d.getFullYear() <= 1970) {
      return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    image: article.coverImage || 'https://techvora.com/default-cover.jpg',
    author: {
      '@type': 'Person',
      name: article.authorName || 'Techvora Team',
    },
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
  };

  const formattedHtml = renderMarkdown(article.content || "");

  return (
    <main className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header Navigation Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-4 px-4">
        <div className="container mx-auto max-w-5xl flex items-center justify-between text-xs">
          <Link
            href="/blog"
            className="flex items-center space-x-2 font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          {/* Category & Subcategory Breadcrumbs */}
          <div className="flex items-center space-x-2 font-semibold text-slate-400">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-slate-600">Blog</Link>
            {article.categoryName && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-blue-600 font-bold">{article.categoryName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Hero Container */}
      <article className="container mx-auto px-4 pt-10 max-w-4xl space-y-8">
        {/* Article Meta Badges */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-blue-200/50">
              {article.categoryName || "Engineering"}
            </span>
            {article.subcategory && (
              <span className="bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-orange-200/50">
                {article.subcategory}
              </span>
            )}
            {article.isFeatured && (
              <span className="bg-amber-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Excerpt Subtitle */}
          {article.excerpt && (
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              {article.excerpt}
            </p>
          )}

          {/* Author & Publish Info Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-600 dark:text-slate-400 border-t border-b border-slate-200/60 dark:border-slate-800 py-3">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md ring-2 ring-white dark:ring-slate-900">
                {article.authorName ? article.authorName.charAt(0).toUpperCase() : "T"}
              </div>
              <div className="text-left">
                <p className="font-extrabold text-slate-900 dark:text-white">{article.authorName || "Techvora Staff"}</p>
                <p className="text-[10px] text-blue-600 font-bold">Author</p>
              </div>
            </div>

            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>

            {/* Date */}
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </div>

            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>

            {/* Reading Time */}
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{article.readingTime || 5} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        {article.coverImage ? (
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 aspect-video relative group">
            <img
              src={article.coverImage}
              alt={article.imageAltText || article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {article.imageAltText && (
              <p className="text-[11px] text-center text-slate-400 py-2 bg-slate-900/80 text-white backdrop-blur-xs absolute bottom-0 inset-x-0">
                {article.imageAltText}
              </p>
            )}
          </div>
        ) : (
          <div className="w-full h-64 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 p-8 flex flex-col justify-end text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-2">
              <span className="bg-orange-500 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
                {article.categoryName || "Techvora Article"}
              </span>
              <h2 className="text-xl font-bold text-slate-100">{article.title}</h2>
            </div>
          </div>
        )}

        {/* Article Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-8">
          {/* Formatted Content */}
          <div
            className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />

          {/* Tags List */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                <TagIcon className="w-3.5 h-3.5 text-orange-500" /> Article Tags:
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs px-3 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Author Bio Footer Card */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-2xl text-white shadow-lg flex-shrink-0">
            {article.authorName ? article.authorName.charAt(0).toUpperCase() : "T"}
          </div>
          <div className="space-y-1 text-center md:text-left flex-1">
            <h4 className="font-extrabold text-base text-white">{article.authorName || "Techvora Staff"}</h4>
            <p className="text-xs text-blue-200 leading-relaxed">
              Senior Software Architect & Technical Contributor at Techvora. Writing deep-dive guides on Spring Boot, Java 21, and Cloud Engineering.
            </p>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="pt-6">
          <NewsletterForm />
        </div>
      </article>
    </main>
  );
}
