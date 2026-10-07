"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword, verifyOtp, resetPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob animation-delay-2000"></div>
      
      <div className="glass-card w-full max-w-md p-8 relative z-10 mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Password Reset</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {step === 1 && "Enter your email to receive an OTP."}
            {step === 2 && "Enter the 6-digit OTP sent to your email."}
            {step === 3 && "Create a new secure password."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 rounded-lg border bg-white/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="otp">
                Enter 6-Digit OTP
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                className="w-full p-3 rounded-lg border bg-white/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm text-center tracking-widest text-lg font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full p-3 rounded-lg border bg-white/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full p-3 rounded-lg border bg-white/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center flex flex-col space-y-2">
          {step > 1 && (
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Start Over
            </button>
          )}
          <Link href="/login" className="text-sm text-primary hover:underline font-medium transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
