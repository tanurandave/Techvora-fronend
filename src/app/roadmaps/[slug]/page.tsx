import React from "react";
import Link from "next/link";
import { fetchRoadmaps, Roadmap } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function RoadmapTimelinePage({ params }: { params: { slug: string } }) {
  let roadmaps: Roadmap[] = [];
  try {
    roadmaps = await fetchRoadmaps();
  } catch (error) {
    notFound();
  }

  const roadmap = roadmaps.find((r) => r.slug === params.slug);
  if (!roadmap) {
    notFound();
  }

  // Sort nodes by orderIndex
  const sortedNodes = roadmap.nodes.sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{roadmap.title} Roadmap</h1>
        <p className="text-lg text-muted-foreground">{roadmap.description}</p>
      </div>

      <div className="relative border-l-4 border-muted ml-4 md:ml-8">
        {sortedNodes.map((node, index) => (
          <div key={node.id} className="mb-10 ml-8 relative">
            <div className="absolute -left-[43px] top-1 h-6 w-6 rounded-full border-4 border-background bg-primary"></div>
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{node.title}</h3>
                <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
              </div>
              <p className="text-muted-foreground mb-4">{node.description}</p>
              {node.linkedArticleSlug && (
                <Link href={`/blog/${node.linkedArticleSlug}`} className="text-sm font-medium text-primary hover:underline">
                  Read related article &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
