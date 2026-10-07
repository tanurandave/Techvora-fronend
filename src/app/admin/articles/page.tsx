"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/api";
import { Plus, Edit3, Trash2, FileText, Search, ExternalLink } from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
};

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/admin/articles`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      setError("Error loading articles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete article");
      }
      
      fetchArticles();
    } catch (err) {
      alert("Error deleting article");
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            Articles Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create, edit, publish, and delete blog articles</p>
        </div>

        <Button
          onClick={() => router.push("/admin/articles/create")}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md rounded-xl px-5 py-2.5 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </Button>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by article title or slug..."
              className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs font-bold text-slate-400">
            Total: {filteredArticles.length} Articles
          </span>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-xs font-bold p-4 border-b">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Sr. No</th>
                <th className="px-6 py-4">Article Title</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-orange-500 rounded-full animate-spin mr-2"></div>
                    Loading articles...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No articles found. Click "+ Create New Article" to start!
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article, index) => (
                  <tr key={article.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                      {article.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          article.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push(`/admin/articles/edit/${article.id}`)}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs font-bold bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
