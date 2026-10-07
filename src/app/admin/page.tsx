"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthToken, getUserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Mail,
  Database,
  Search,
  CheckCircle,
  Clock,
  Settings,
  MoreVertical,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock Dynamic Analytics Data
const trafficDataMap: Record<string, Array<{ name: string; views: number; visitors: number }>> = {
  "7d": [
    { name: "Mon", views: 2400, visitors: 1400 },
    { name: "Tue", views: 3200, visitors: 1900 },
    { name: "Wed", views: 4100, visitors: 2500 },
    { name: "Thu", views: 3800, visitors: 2100 },
    { name: "Fri", views: 5200, visitors: 3200 },
    { name: "Sat", views: 6100, visitors: 3900 },
    { name: "Sun", views: 7400, visitors: 4800 },
  ],
  "30d": [
    { name: "Week 1", views: 18400, visitors: 11200 },
    { name: "Week 2", views: 24500, visitors: 15400 },
    { name: "Week 3", views: 31200, visitors: 19800 },
    { name: "Week 4", views: 42800, visitors: 26500 },
  ],
  "90d": [
    { name: "Month 1", views: 68000, visitors: 42000 },
    { name: "Month 2", views: 95000, visitors: 58000 },
    { name: "Month 3", views: 124500, visitors: 78000 },
  ],
};

const categoryData = [
  { name: "Spring Boot", count: 124 },
  { name: "React & Next.js", count: 98 },
  { name: "Java 21", count: 65 },
  { name: "Architecture", count: 32 },
  { name: "DevOps", count: 23 },
];

const categoryColors = ["#2563EB", "#F97316", "#3B82F6", "#FB923C", "#60A5FA"];

const initialUsers = [
  { id: "1", name: "Super Admin", email: "admin@techvora.com", role: "ADMIN", status: "Active", joined: "2026-08-21" },
  { id: "2", name: "Sarah Connor", email: "sarah.c@techvora.com", role: "EDITOR", status: "Active", joined: "2026-09-02" },
  { id: "3", name: "Alex Mercer", email: "alex.m@dev.io", role: "USER", status: "Active", joined: "2026-09-14" },
  { id: "4", name: "Elena Rostova", email: "elena@code.net", role: "USER", status: "Inactive", joined: "2026-10-01" },
];

const mockAuditLogs = [
  { id: "1", action: "Article Published", details: "Spring Boot 4 Architecture Guide", time: "10 mins ago", type: "success" },
  { id: "2", action: "User Role Updated", details: "sarah.c@techvora.com set to EDITOR", time: "1 hour ago", type: "info" },
  { id: "3", action: "Database Backup", details: "Neon Postgres automated snapshot", time: "3 hours ago", type: "success" },
  { id: "4", action: "Security Check", details: "JWT token validation refreshed", time: "5 hours ago", type: "info" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "health">("overview");
  const [usersList, setUsersList] = useState(initialUsers);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const profileData = await getUserProfile(token);
        setProfile(profileData);
      } catch (err) {
        console.error("Failed loading admin profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const toggleUserRole = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextRole = u.role === "USER" ? "EDITOR" : u.role === "EDITOR" ? "ADMIN" : "USER";
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow decorative blobs */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/2 -top-10 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-orange-500 text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                Admin Control Center
              </span>
              <span className="text-blue-200 text-xs font-medium">| {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">{profile?.firstName || "Super Admin"}</span> 👋
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              Monitor real-time platform metrics, manage user roles, and publish developer articles from your dynamic dashboard.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <Link href="/admin/articles/create">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Publish Article
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Section Tabs */}
        <div className="flex items-center space-x-2 border-t border-blue-800/80 mt-6 pt-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "overview"
                ? "bg-white text-blue-900 shadow-md font-extrabold"
                : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
            }`}
          >
            Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "users"
                ? "bg-white text-blue-900 shadow-md font-extrabold"
                : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
            }`}
          >
            User Management ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "health"
                ? "bg-white text-blue-900 shadow-md font-extrabold"
                : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
            }`}
          >
            System Infrastructure
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Platform Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">1,248</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">184 new registrations this week</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Published Articles
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">342</span>
            <span className="inline-flex items-center text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" /> +28 this mo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">12 drafts pending review</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Platform Views
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">124.5k</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" /> +19.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Average 4.2m reading time</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              System Uptime
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">99.98%</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              Healthy
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Postgres & Spring Boot online</p>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Traffic Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    Traffic & Engagement Stream
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  </h3>
                  <p className="text-xs text-slate-400">Total page views vs unique developer visitors</p>
                </div>

                {/* Filter Timeframe Buttons */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold self-start">
                  {(["7d", "30d", "90d"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        timeframe === tf
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
                      }`}
                    >
                      {tf.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Chart Container */}
              <div className="h-72 mt-6 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficDataMap[timeframe]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748B" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderColor: "#1E293B",
                        borderRadius: "12px",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Total Views" />
                    <Area type="monotone" dataKey="visitors" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" name="Unique Visitors" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center space-x-6 pt-4 text-xs font-bold">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-slate-600 dark:text-slate-300">Total Views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-slate-600 dark:text-slate-300">Unique Visitors</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown Bar Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white pb-1">
                  Articles by Technology
                </h3>
                <p className="text-xs text-slate-400 mb-4">Content category distribution</p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#475569" }} width={90} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderRadius: "8px",
                          color: "#FFF",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Link
                href="/admin/articles"
                className="w-full text-center py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl transition-colors border border-slate-100 dark:border-slate-700/60 block mt-4"
              >
                Manage All Articles →
              </Link>
            </div>
          </div>

          {/* Quick Actions & Audit Trail Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions Panel */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">
                Administrative Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/articles/create"
                  className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 hover:border-orange-400 transition-all flex flex-col justify-between group"
                >
                  <FileText className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform mb-3" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-orange-600">New Article</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Write technical post</p>
                  </div>
                </Link>

                <button
                  onClick={() => setActiveTab("users")}
                  className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 hover:border-blue-400 transition-all flex flex-col justify-between text-left group"
                >
                  <Users className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform mb-3" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">User Roles</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Edit access levels</p>
                  </div>
                </button>

                <Link
                  href="/admin/media"
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  <Server className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform mb-3" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Media Library</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Manage S3 assets</p>
                  </div>
                </Link>

                <Link
                  href="/admin/audit-logs"
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-orange-300 transition-all flex flex-col justify-between group"
                >
                  <ShieldCheck className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform mb-3" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Audit Logs</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">System security log</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Live System Activity Stream
                  </h3>
                  <Link href="/admin/audit-logs" className="text-xs font-bold text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {mockAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            log.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{log.action}</p>
                          <p className="text-[11px] text-slate-400">{log.details}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">User Access & Role Management</h3>
              <p className="text-xs text-slate-400">View registered platform users and grant administrator privileges</p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Filter by name or email..."
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                  <th className="p-3.5 rounded-l-xl">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Joined Date</th>
                  <th className="p-3.5 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div>{user.name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{user.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          user.role === "ADMIN"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400"
                            : user.role === "EDITOR"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="flex items-center space-x-1.5 font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{user.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{user.joined}</td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserRole(user.id)}
                        className="text-[11px] font-bold border-slate-200 dark:border-slate-700 hover:bg-blue-50 text-blue-600"
                      >
                        Cycle Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Health */}
      {activeTab === "health" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 text-blue-600">
              <Database className="w-6 h-6" />
              <h4 className="font-extrabold text-slate-900 dark:text-white">PostgreSQL Database</h4>
            </div>
            <p className="text-xs text-slate-500">Hosted on Neon Tech (AWS us-east-2)</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">SSL Connection</span>
                <span className="text-emerald-600 font-bold">Encrypted</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Pool Driver</span>
                <span className="text-slate-800 dark:text-slate-200">HikariCP Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 text-orange-500">
              <Server className="w-6 h-6" />
              <h4 className="font-extrabold text-slate-900 dark:text-white">Spring Boot 4 Service</h4>
            </div>
            <p className="text-xs text-slate-500">Running on Java LTS 21 runtime</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Backend Port</span>
                <span className="text-blue-600 font-bold">8080</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Security</span>
                <span className="text-slate-800 dark:text-slate-200">Spring Security JWT</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 text-blue-500">
              <Mail className="w-6 h-6" />
              <h4 className="font-extrabold text-slate-900 dark:text-white">SMTP Mailer</h4>
            </div>
            <p className="text-xs text-slate-500">Google SMTP Relay Engine</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Port</span>
                <span className="text-slate-800 dark:text-slate-200">587 TLS</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">OTP Auth</span>
                <span className="text-emerald-600 font-bold">10 min expiry</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
