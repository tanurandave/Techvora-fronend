"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/api";
import {
  FileText,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag as TagIcon,
  Eye,
  Save,
  Send,
  X,
  Plus,
  CheckCircle2,
  Code,
  Bold,
  Italic,
  List,
  Heading,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";

export default function CreateArticlePage() {
  const router = useRouter();

  // Basic Information State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Spring Boot");
  const [subcategory, setSubcategory] = useState("REST APIs");
  const [tags, setTags] = useState<string[]>(["Java", "Spring Boot", "REST API"]);
  const [newTagInput, setNewTagInput] = useState("");

  // Featured Image State
  const [coverImage, setCoverImage] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Blog Content State
  const [content, setContent] = useState(
    "# Write your technical blog here...\n\n### Introduction\nExplain the core concepts clearly with code examples.\n\n```java\n@RestController\npublic class HelloController {\n    @GetMapping(\"/hello\")\n    public String hello() {\n        return \"Hello Techvora!\";\n    }\n}\n```"
  );
  const [autoToc, setAutoToc] = useState(true);
  const [contentTab, setContentTab] = useState<"editor" | "preview">("editor");

  // SEO Settings State
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [showAdvancedSeo, setShowAdvancedSeo] = useState(false);

  // Publishing Settings State
  const [status, setStatus] = useState("DRAFT");
  const [publishDate, setPublishDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Auto generate slug from title when title changes
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
      if (!seoTitle) setSeoTitle(title);
    }
  }, [title]);

  // Tag helper
  const addTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Image Upload helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    
    // Read file as Base64 Data URL so it is permanently self-contained and stored in PostgreSQL DB
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        setCoverImage(base64Data);
      }
      setIsUploadingImage(false);

      // Async log to backend media controller
      try {
        const token = getAuthToken();
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        const formData = new FormData();
        formData.append("file", file);

        await fetch(`${API_BASE_URL}/admin/media/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } catch (err) {
        // Log in background
      }
    };
    reader.readAsDataURL(file);
  };

  // Content Editor Helpers
  const insertMarkdown = (syntax: string) => {
    setContent((prev) => prev + "\n" + syntax);
  };

  // Submit Handler
  const handleSave = async (submitStatus: "DRAFT" | "PUBLISHED") => {
    if (!title.trim()) {
      setError("Blog Title is required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const token = getAuthToken();

      const payload = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        imageAltText,
        subcategory,
        autoToc,
        categoryName: category,
        tags,
        status: submitStatus,
        seoTitle,
        seoDescription,
        focusKeyword,
        canonicalUrl,
        isFeatured,
        allowComments,
      };

      const res = await fetch(`${API_BASE_URL}/admin/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save article");
      }

      router.push("/admin/articles");
    } catch (err) {
      setError("Failed to save blog post. Please verify all inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-orange-500" />
            CREATE NEW BLOG
          </h1>
          <p className="text-xs text-slate-500 mt-1">Author and publish high-impact developer tutorials and articles</p>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave("DRAFT")}
            disabled={isSubmitting}
            className="text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreviewModal(true)}
            className="text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center space-x-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </Button>

          <Button
            type="button"
            onClick={() => handleSave("PUBLISHED")}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing..." : "Publish Blog"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main Form Body */}
      <div className="space-y-8">
        {/* 1. BASIC INFORMATION */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Basic Information
            </h2>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-full">
              * Required Fields
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blog Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Building High-Performance Microservices with Spring Boot 4"
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="building-high-performance-microservices"
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Short Description / Excerpt
              </label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise 2-sentence summary for search feeds & preview cards..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="Spring Boot">Spring Boot</option>
                <option value="Java 21">Java 21</option>
                <option value="React & Next.js">React & Next.js</option>
                <option value="Architecture">Software Architecture</option>
                <option value="DevOps">DevOps & Cloud</option>
                <option value="Database">PostgreSQL & Databases</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="REST APIs">REST APIs & Web MVC</option>
                <option value="Spring Security">Spring Security & JWT</option>
                <option value="Spring Data JPA">Spring Data JPA / Hibernate</option>
                <option value="System Design">System Design & Patterns</option>
                <option value="Performance">Performance Tuning</option>
              </select>
            </div>

            {/* Interactive Tags */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center space-x-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-200/50"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag..."
                    className="bg-white dark:bg-slate-900 text-xs rounded-xl px-3 py-1 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 w-28"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURED IMAGE */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Featured Image
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Upload Drag & Drop Box */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 rounded-3xl p-6 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isUploadingImage ? "Uploading Image..." : "Upload Featured Image"}
                </p>
                <p className="text-[11px] text-slate-400">Drag & drop or click to upload (PNG, JPG, WEBP)</p>
              </div>
            </div>

            {/* Image Preview / Details */}
            <div className="space-y-4">
              {coverImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs font-bold">
                  <ImageIcon className="w-8 h-8 mb-2 text-slate-300" />
                  No Image Uploaded Yet
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Image Alt Text
                </label>
                <input
                  type="text"
                  value={imageAltText}
                  onChange={(e) => setImageAltText(e.target.value)}
                  placeholder="e.g. Architectural diagram of Spring Boot microservices"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 text-xs rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. BLOG CONTENT & MDX EDITOR */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Blog Content
            </h2>

            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setContentTab("editor")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  contentTab === "editor"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Markdown Editor
              </button>
              <button
                type="button"
                onClick={() => setContentTab("preview")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  contentTab === "preview"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Live Preview
              </button>
            </div>
          </div>

          {/* Editor Toolbar */}
          {contentTab === "editor" && (
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => insertMarkdown("## Heading 2")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                title="Heading"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("**Bold Text**")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("*Italic Text*")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("```java\n// Your Code Here\n```")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("- Bullet item")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("[Link Text](https://techvora.com)")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold"
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Editor Input / Preview View */}
          {contentTab === "editor" ? (
            <textarea
              required
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Write your blog post content using Markdown / MDX..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs rounded-2xl p-4 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
            />
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[350px] prose dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {content}
            </div>
          )}

          {/* Table of Contents Checkbox */}
          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="autoToc"
              checked={autoToc}
              onChange={(e) => setAutoToc(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="autoToc" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              ☑ Auto Generate Table of Contents (TOC)
            </label>
          </div>
        </section>

        {/* 4. SEO SETTINGS */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              SEO Settings
            </h2>
            <button
              type="button"
              onClick={() => setShowAdvancedSeo(!showAdvancedSeo)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>{showAdvancedSeo ? "Collapse SEO" : "Advanced SEO"}</span>
              {showAdvancedSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEO Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Targeted title for Google Search results..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Focus Keyword */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. Spring Boot Microservices"
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Meta Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Compelling 155-character meta description for search engine result pages (SERPs)..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Advanced SEO Toggleable Section */}
            {showAdvancedSeo && (
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://techvora.com/blog/original-post-slug"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 text-xs rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 5. PUBLISHING SETTINGS */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Publishing Options
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-extrabold"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Publish Date
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Featured Blog
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    isFeatured ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isFeatured ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isFeatured ? "ON (Featured)" : "OFF"}
                </span>
              </div>
            </div>

            {/* Allow Comments Toggle */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Allow Comments
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setAllowComments(!allowComments)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    allowComments ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      allowComments ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {allowComments ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. BOTTOM ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/articles")}
            className="text-xs font-bold border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave("DRAFT")}
              disabled={isSubmitting}
              className="text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreviewModal(true)}
              className="text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Button>

            <Button
              type="button"
              onClick={() => handleSave("PUBLISHED")}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Publishing..." : "Publish Blog"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full">
                Article Live Preview
              </span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {coverImage && (
              <img src={coverImage} alt={imageAltText || title} className="w-full h-64 object-cover rounded-2xl shadow-md" />
            )}

            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{category} / {subcategory}</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{title || "Untitled Blog Post"}</h1>
              <p className="text-slate-500 text-xs italic">{excerpt}</p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap text-xs leading-relaxed font-sans">
              {content}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setShowPreviewModal(false)} className="bg-blue-600 text-white font-bold text-xs">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
