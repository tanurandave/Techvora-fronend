"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Image as ImageIcon,
  ShieldAlert,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { removeAuthToken } from "@/lib/api";

interface AdminSidebarProps {
  profile?: any;
}

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: "Main",
    },
    {
      name: "Articles & Posts",
      href: "/admin/articles",
      icon: FileText,
      badge: null,
    },
    {
      name: "Media Library",
      href: "/admin/media",
      icon: ImageIcon,
      badge: null,
    },
    {
      name: "System Audit Logs",
      href: "/admin/audit-logs",
      icon: ShieldAlert,
      badge: "Live",
    },
  ];

  const quickActions = [
    {
      name: "Create Article",
      href: "/admin/articles/create",
      icon: PlusCircle,
    },
    {
      name: "View Main Site",
      href: "/",
      icon: ExternalLink,
      target: "_blank",
    },
  ];

  return (
    <aside
      className={`relative min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110 focus:outline-none"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand / Logo Header */}
      <div className="h-16 px-5 flex items-center border-b border-slate-100 dark:border-slate-800/80">
        <Link href="/admin" className="flex items-center space-x-3 group overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-orange-500 p-0.5 shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                TECHVORA
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                Admin Portal
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Core Management
            </p>
          )}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Links */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Shortcuts
            </p>
          )}
          <div className="space-y-1.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  target={action.target}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all border border-transparent hover:border-orange-200/50"
                  title={isCollapsed ? action.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 text-orange-500" />
                  {!isCollapsed && <span>{action.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin User Profile & Logout Bottom Box */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm`}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 ring-2 ring-blue-100 dark:ring-slate-700">
              {profile?.firstName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {profile?.firstName || "Admin"} {profile?.lastName || ""}
                </p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                  {profile?.email || "admin@techvora.com"}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
