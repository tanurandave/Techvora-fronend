"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getUserProfile } from "@/lib/api";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      
      if (decoded.role === "ADMIN") {
        setIsAuthorized(true);
        // Fetch user profile info
        getUserProfile(token)
          .then((data) => setProfile(data))
          .catch(() => {});
      } else {
        router.push("/");
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Verifying Admin Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex flex-row font-sans">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={profile} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
