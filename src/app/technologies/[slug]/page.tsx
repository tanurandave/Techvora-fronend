import React from "react";
import Link from "next/link";
import { fetchPublishedArticles } from "@/lib/api"; // Mapped from fetchArticles for MVP
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace("-", " ");
  return {
    title: `${title} Articles - Techvora`,
    description: `Latest articles, tutorials, and roadmaps for ${title}.`,
  };
}

export default async function TechnologyPage({ params }: Props) {
  const { slug } = await params;
  const techName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  let results = null;
  try {
    // For MVP, we can reuse the search API to fetch articles related to this technology
    // In production, this would be a specific endpoint /api/v1/technologies/{slug}/articles
    results = await fetchPublishedArticles(0, 20); 
    // Just a placeholder mock for compilation.
  } catch (error) {
    console.error("Failed to fetch articles for tech", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-primary/5 rounded-3xl p-12 mb-12 border border-primary/10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-primary">{techName}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore the latest articles, best practices, and tutorials for {techName}. Learn, build, and grow your expertise.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6">Latest in {techName}</h2>
      
      {results && results.content && results.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.content.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="block group">
              <div className="p-6 h-full bg-card border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="text-sm font-semibold text-primary">Read more &rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No articles found for {techName} yet.</p>
      )}
    </div>
  );
}
