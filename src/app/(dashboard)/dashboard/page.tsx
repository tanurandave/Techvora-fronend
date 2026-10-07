"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getUserProfile, getUserNotifications } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [profileData, notifData] = await Promise.all([
          getUserProfile(token),
          getUserNotifications(token)
        ]);

        setProfile(profileData);
        setNotifications(notifData);
      } catch (err: any) {
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-bold text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 text-gradient">Welcome back, {profile?.firstName}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here is a summary of your account and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content Area: Recommended Reading & Roadmaps */}
        <div className="lg:col-span-2 space-y-8">

          {/* SEO Friendly Content: Recommended Reading */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Recommended for You</h2>
            <div className="space-y-6">
              {[
                { title: "The Future of Microservices Architecture", category: "System Design", time: "5 min read", desc: "Explore how serverless and microservices are converging in modern cloud infrastructure." },
                { title: "Mastering React Server Components", category: "Frontend", time: "8 min read", desc: "A deep dive into Next.js App Router and how Server Components change the way we build React." },
                { title: "Zero Trust Security in 2026", category: "Security", time: "6 min read", desc: "Why traditional perimeter security is dead and how to implement zero trust architecture." }
              ].map((article, i) => (
                <article key={i} className="group p-4 rounded-xl border bg-white/30 dark:bg-slate-900/30 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{article.category}</span>
                    <span className="text-xs text-slate-500">{article.time}</span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{article.desc}</p>
                </article>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">Browse All Articles</Button>
          </section>

          {/* Activity & Notifications */}
          <section className="glass-card p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-xl font-bold">Recent Notifications</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                {notifications.length} New
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                  <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <p className="font-medium text-lg">You're all caught up!</p>
                  <p className="text-sm mt-1">Check back later for updates on your articles and roadmaps.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 rounded-xl border transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${notif.isRead ? 'bg-transparent border-slate-100' : 'bg-primary/5 border-primary/20'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-primary'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Profile Card */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="glass-card p-6 border-t-4 border-t-primary sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-center">Your Profile</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center text-4xl text-white font-bold mb-4 shadow-lg ring-4 ring-white/50">
                {profile?.firstName?.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold">{profile?.firstName} {profile?.lastName}</h3>
              <span className="bg-secondary/50 text-primary px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase tracking-widest">
                {profile?.role}
              </span>
            </div>

            <div className="space-y-4 border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-slate-700 dark:text-slate-300 break-all">{profile?.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Joined Date</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-md transition-all">Edit Profile</Button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
