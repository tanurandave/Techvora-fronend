"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch(e) { }
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    setRole(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b-0 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-extrabold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">TECHVORA</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/blog" className="transition-all hover:text-primary text-foreground/80 hover:-translate-y-0.5">
              Blog
            </Link>
            <Link href="/roadmaps" className="transition-all hover:text-primary text-foreground/80 hover:-translate-y-0.5">
              Roadmaps
            </Link>
            <Link href="/technologies" className="transition-all hover:text-primary text-foreground/80 hover:-translate-y-0.5">
              Technologies
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search Placeholder */}
          </div>
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border-2 border-background"></span>
                </button>
                <Link href={role === 'ADMIN' ? "/admin/articles/create" : "/dashboard"}>
                  <Button variant="ghost" className="text-sm font-semibold hover:text-primary transition-colors flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 mr-1" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="text-sm font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors">
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-semibold hover:text-primary transition-colors">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="text-sm font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary hover:to-orange-600 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
