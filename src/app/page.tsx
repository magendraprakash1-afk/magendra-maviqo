"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { DASHBOARD_ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(DASHBOARD_ROUTES[user.role]);
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  // Show branded loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white mb-6 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Maviqo</h1>
        <p className="text-[var(--muted-foreground)]">AI College Management Platform</p>
        <div className="mt-8 flex items-center justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
