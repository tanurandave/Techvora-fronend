"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Registration failed. Email might already be in use.");
      }

      // Success, route to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-md">
      <div className="bg-card border rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-center mb-6">Join Techvora</h1>
        <p className="text-center text-muted-foreground mb-8">
          Create an account to track your learning progress.
        </p>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input 
                type="text" 
                required
                className="w-full p-2 border rounded-md" 
                placeholder="John" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input 
                type="text" 
                required
                className="w-full p-2 border rounded-md" 
                placeholder="Doe" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border rounded-md" 
              placeholder="you@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border rounded-md" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
