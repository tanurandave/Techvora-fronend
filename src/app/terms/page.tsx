import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Techvora",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-slate dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: August 21, 2026</p>
      <p>This is a placeholder for the Techvora Terms of Service.</p>
    </div>
  );
}
