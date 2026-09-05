"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { NAV_BY_ROLE, APP_NAME } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard, CalendarCheck, Clock, FileText, GraduationCap,
  Trophy, CreditCard, Bell, Bot, User, Users, BarChart3, BookOpen,
  Building2, Library, Settings, UserCheck, FileBarChart, IndianRupee,
  ChevronLeft, Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, CalendarCheck, Clock, FileText, GraduationCap,
  Trophy, CreditCard, Bell, Bot, User, Users, BarChart3, BookOpen,
  Building2, Library, Settings, UserCheck, FileBarChart, IndianRupee,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = NAV_BY_ROLE[user.role];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out",
        "border-r bg-[var(--sidebar-bg)] border-[var(--sidebar-border)]",
        collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]",
        "max-lg:hidden"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white font-bold text-sm shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold gradient-text tracking-tight">{APP_NAME}</h1>
            <p className="text-[10px] text-[var(--muted-foreground)] -mt-0.5 font-medium">
              AI College Platform
            </p>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "ml-auto p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors",
            collapsed && "ml-0"
          )}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-link", isActive && "active")}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && item.badge > 0 && (
                <span className="ml-auto text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-[var(--sidebar-border)]">
        <div className={cn("flex items-center gap-3 p-2 rounded-xl", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-sm font-semibold shrink-0">
            {getInitials(user.name)}
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-[var(--muted-foreground)] truncate capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
