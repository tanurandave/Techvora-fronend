import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Techvora",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-slate dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: August 21, 2026</p>
      <p>This is a placeholder for the Techvora Privacy Policy.</p>
    </div>
  );
}
