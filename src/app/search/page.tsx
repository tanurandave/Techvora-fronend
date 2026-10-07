import React from "react";
import Link from "next/link";
import { searchArticles } from "@/lib/api";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  
  let results = null;
  if (query) {
    try {
      results = await searchArticles(query);
    } catch (error) {
      console.error("Failed to search", error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Search</h1>
        <form method="GET" action="/search" className="flex gap-2">
          <input 
            type="search" 
            name="q"
            defaultValue={query}
            placeholder="Search articles, tags, technologies..." 
            className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button type="submit" className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold">
            Search
          </button>
        </form>
      </div>

      {query && results && (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Found {results.totalElements} results for "{query}"
          </h2>
          
          <div className="space-y-6">
            {results.content.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="block group">
                <div className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {query && (!results || results.content.length === 0) && (
        <p className="text-muted-foreground text-center py-12 text-lg">
          No results found for "{query}". Try a different keyword.
        </p>
      )}
    </div>
  );
}
