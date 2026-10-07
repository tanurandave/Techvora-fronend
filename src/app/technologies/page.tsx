import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technologies - Techvora",
  description: "Browse all technologies and developer roadmaps on Techvora.",
};

const popularTechnologies = [
  { name: "Java", slug: "java", icon: "☕" },
  { name: "Spring Boot", slug: "spring-boot", icon: "🍃" },
  { name: "Next.js", slug: "nextjs", icon: "▲" },
  { name: "React", slug: "react", icon: "⚛️" },
  { name: "PostgreSQL", slug: "postgresql", icon: "🐘" },
  { name: "TypeScript", slug: "typescript", icon: "📘" },
];

export default function TechnologiesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Technologies</h1>
        <p className="text-xl text-muted-foreground">
          Explore our extensive library of articles, tutorials, and interview prep grouped by technology.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {popularTechnologies.map((tech) => (
          <Link key={tech.slug} href={`/technologies/${tech.slug}`}>
            <div className="p-8 border rounded-2xl bg-card hover:border-primary/50 hover:shadow-md transition-all text-center group cursor-pointer">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{tech.icon}</div>
              <h2 className="text-2xl font-bold">{tech.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
