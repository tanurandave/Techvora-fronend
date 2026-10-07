import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags - Techvora",
};

export default function TagsIndexPage() {
  const tags = ["architecture", "backend", "frontend", "database", "devops", "security"];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Explore by Tags</h1>
      <div className="flex flex-wrap gap-4">
        {tags.map((tag) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <span className="px-6 py-3 bg-secondary/20 text-secondary-foreground rounded-full text-lg font-medium hover:bg-secondary/40 transition-colors cursor-pointer">
              #{tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
