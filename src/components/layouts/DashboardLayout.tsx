"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Sidebar from "@/components/shared/Sidebar";
import TopBar from "@/components/shared/TopBar";
import { cn } from "@/lib/utils";
import { NAV_BY_ROLE } from "@/lib/constants";
import { initializeMobileApp } from "@/lib/mobile/native";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarCheck, Clock, FileText, GraduationCap,
  Trophy, CreditCard, Bell, Bot, User, Users, BarChart3, BookOpen,
  Building2, Library, Settings, UserCheck, FileBarChart, IndianRupee, X,
  Lock, ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, CalendarCheck, Clock, FileText, GraduationCap,
  Trophy, CreditCard, Bell, Bot, User, Users, BarChart3, BookOpen,
  Building2, Library, Settings, UserCheck, FileBarChart, IndianRupee,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    initializeMobileApp();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[var(--muted-foreground)]">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center shadow-xl space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">Authentication Required</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Please sign in to access your institutional portal.
            </p>
          </div>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold shadow-lg shadow-primary-500/25 transition-all"
          >
            Go to Sign In <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const navItems = NAV_BY_ROLE[user.role];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-[var(--sidebar-border)]">
              <span className="font-bold gradient-text text-lg">Maviqo</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("sidebar-link", isActive && "active")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          "lg:ml-[var(--sidebar-width)]",
          sidebarCollapsed && "lg:ml-[var(--sidebar-collapsed-width)]"
        )}
      >
        <TopBar onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-lg pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors",
                  isActive ? "text-primary-500" : "text-[var(--muted-foreground)]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
