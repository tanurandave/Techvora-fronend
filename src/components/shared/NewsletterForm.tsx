"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("http://localhost:8080/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(responseText);
      }

      setStatus("success");
      setMessage(responseText);
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to subscribe");
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center my-12">
      <h3 className="text-2xl font-bold mb-3">Subscribe to Techvora</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Get the latest articles, tutorials, and roadmaps delivered straight to your inbox. No spam, ever.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {message && (
        <p className={`mt-4 text-sm font-medium ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
