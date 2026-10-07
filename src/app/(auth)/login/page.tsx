"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [selectedRole, setSelectedRole] = useState("USER");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Access Denied: Invalid credentials or role.");
      }

      const data = await res.json();
      setAuthToken(data.token); // Save token

      // Decode JWT to get role
      try {
        const payload = data.token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        if (decoded.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } catch (e) {
        router.push("/dashboard");
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-md">
      <div className="glass-card p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gradient">Welcome Back</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
          Sign in to your Techvora account.
        </p>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 border border-destructive/20">
            {error}
          </div>
        )}

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${selectedRole === 'ADMIN' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            onClick={() => setSelectedRole('ADMIN')}
          >
            ADMIN
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${selectedRole === 'USER' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            onClick={() => setSelectedRole('USER')}
          >
            USER
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border rounded-md bg-white/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              placeholder="you@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border rounded-md bg-white/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm font-medium flex flex-col space-y-2">
          <Link href="/forgot-password" className="text-slate-500 hover:text-slate-700 transition-colors">
            Forgot Password?
          </Link>
          <div>
            Don't have an account? <Link href="/register" className="text-primary hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
