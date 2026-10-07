"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="border-t py-12 bg-card">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-primary">TECHVORA</h3>
          <p className="text-sm text-muted-foreground">
            Learn. Build. Grow. The premium ecosystem for modern developers.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Content</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/roadmaps" className="hover:text-primary">Roadmaps</Link></li>
            <li><Link href="/interview-prep" className="hover:text-primary">Interview Prep</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/technologies" className="hover:text-primary">Technologies</Link></li>
            <li><Link href="/tags" className="hover:text-primary">Tags</Link></li>
            <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Techvora. All rights reserved.</p>
      </div>
    </footer>
  );
}
