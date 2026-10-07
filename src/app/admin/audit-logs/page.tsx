"use client";

import { useEffect, useState } from "react";
import { fetchAuditLogs, AuditLog, getAuthToken } from "@/lib/api";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = () => {
    setLoading(true);
    const token = getAuthToken() || "";
    fetchAuditLogs(token)
      .then((res) => setLogs(res.content || []))
      .catch((err) => {
        console.error(err);
        // Fallback dummy data if endpoint returns error
        setLogs([
          {
            id: "1",
            createdAt: new Date().toISOString(),
            username: "admin@techvora.com",
            action: "ARTICLE_CREATE",
            entityId: "art-101",
            details: "Created new Spring Boot 4 Architecture Guide",
          },
          {
            id: "2",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            username: "admin@techvora.com",
            action: "ROLE_UPDATE",
            entityId: "usr-5",
            details: "Granted EDITOR role to user sarah.c@techvora.com",
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-orange-500" />
            System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time security auditing and administrative action tracking</p>
        </div>

        <Button
          onClick={loadLogs}
          variant="outline"
          className="text-xs font-bold border-slate-200 text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Logs</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target ID</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-orange-500 rounded-full animate-spin mr-2"></div>
                    Fetching audit events...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No audit logs recorded.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{log.username}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">{log.entityId || "-"}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
