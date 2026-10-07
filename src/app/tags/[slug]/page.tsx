import React from "react";
import Link from "next/link";
import { fetchPublishedArticles } from "@/lib/api"; // MVP Placeholder
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Topic: ${slug} - Techvora`,
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tagName = slug;

  let results = null;
  try {
    results = await fetchPublishedArticles(0, 20); 
  } catch (error) {
    console.error("Failed to fetch articles for tag", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          <span className="text-muted-foreground">#</span>{tagName}
        </h1>
        <p className="text-lg text-muted-foreground">Articles tagged with {tagName}</p>
      </div>

      <div className="space-y-6">
        {results && results.content && results.content.length > 0 ? (
          results.content.map((article) => (
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
          ))
        ) : (
          <p className="text-muted-foreground">No articles found with this tag.</p>
        )}
      </div>
    </div>
  );
}
