"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Reset your password</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Enter your registered email and we&apos;ll send you recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">
            Password reset email sent!
          </h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            If an account exists for {email}, a recovery link has been delivered to your inbox.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:underline pt-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-sm outline-none"
                placeholder="name@maviqo.edu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-500/25"
          >
            Send Reset Link
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
