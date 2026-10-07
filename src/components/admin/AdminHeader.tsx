"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Plus, CheckCircle2, ShieldCheck, Sparkles, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  profile?: any;
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles, users, logs or system tags..."
            className="w-full bg-slate-100/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* System Health Status Badge */}
        <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/60 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>System Operational</span>
        </div>

        {/* Quick Action Button */}
        <Link href="/admin/articles/create">
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all rounded-xl px-4 py-2 flex items-center space-x-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Article</span>
          </Button>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  System Notifications
                </h4>
                <span className="bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700/50">
                  <p className="font-bold text-blue-900 dark:text-blue-300">Neon PostgreSQL Connected</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Database status verified and healthy.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-800 dark:text-slate-200">New User Registration</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">User john.doe@techvora.io joined platform.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {profile?.firstName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <span className="hidden md:inline font-bold text-xs text-slate-800 dark:text-slate-200">
              {profile?.firstName || "Admin"}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-xs text-slate-900 dark:text-white">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{profile?.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                  {profile?.role || "ADMIN"}
                </span>
              </div>
              <div className="pt-2 space-y-1">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Public Platform</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
