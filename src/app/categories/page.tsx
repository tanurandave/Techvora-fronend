import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - Techvora",
};

export default function CategoriesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Categories</h1>
      <p className="text-muted-foreground text-lg">
        This page is under construction. Stay tuned for curated learning paths!
      </p>
    </div>
  );
}
