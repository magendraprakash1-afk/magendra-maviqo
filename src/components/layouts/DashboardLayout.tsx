"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Sidebar from "@/components/shared/Sidebar";
import TopBar from "@/components/shared/TopBar";
import { cn } from "@/lib/utils";
import { NAV_BY_ROLE } from "@/lib/constants";
import { initializeMobileApp } from "@/lib/mobile/native";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarCheck, Clock, FileText, GraduationCap,
  Trophy, CreditCard, Bell, Bot, User, Users, BarChart3, BookOpen,
  Building2, Library, Settings, UserCheck, FileBarChart, IndianRupee, X,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, CalendarCheck, Clock, FileText, GraduationCap,
  Trophy, CreditCard, Bell, Bot, User, Users, BarChart3, BookOpen,
  Building2, Library, Settings, UserCheck, FileBarChart, IndianRupee,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    initializeMobileApp();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Please log in</h2>
          <p className="text-[var(--muted-foreground)] mt-2">You need to be authenticated to access this page.</p>
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
