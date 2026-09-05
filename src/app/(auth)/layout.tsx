import { Sparkles } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-primary-50/20 to-violet-50/30 dark:from-slate-950 dark:via-primary-950/20 dark:to-violet-950/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white font-bold shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight gradient-text">{APP_NAME}</span>
        </Link>
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
          AI-Powered College Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-2xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
