"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ROLE_LABELS, type UserRole, ROLES } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import {
  Sun, Moon, Bell, Search, Menu, LogOut,
  ChevronDown, User, Settings, Sparkles,
} from "lucide-react";
import { DataStore, type NotificationItem } from "@/lib/data-store";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { user, switchRole, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    user ? DataStore.getNotifications(user.role) : []
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const sync = () => setNotifications(DataStore.getNotifications(user.role));
    sync();
    window.addEventListener("maviqo_datastore_change", sync);
    return () => window.removeEventListener("maviqo_datastore_change", sync);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowRoleSwitcher(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-[var(--muted)]"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary-500" />
        <span className="font-bold gradient-text">Maviqo</span>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[var(--muted)] border border-transparent
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-[var(--background)]
                     text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)] bg-[var(--background)] rounded border">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Role Switcher (Demo) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ROLE_LABELS[user.role]}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showRoleSwitcher && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl py-1 animate-slide-in-up">
              <div className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Switch Role (Demo)
              </div>
              {Object.values(ROLES).map((role) => (
                <button
                  key={role}
                  onClick={() => { switchRole(role as UserRole); setShowRoleSwitcher(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--muted)] transition-colors capitalize ${
                    user.role === role ? "text-primary-500 font-medium" : ""
                  }`}
                >
                  {ROLE_LABELS[role as UserRole]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[var(--background)]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl py-2 z-50 animate-slide-in-up">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
                <span className="font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => DataStore.markAllNotificationsRead(user.role)}
                    className="text-[11px] font-semibold text-primary-500 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
                {notifications.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      DataStore.markNotificationRead(n.id);
                    }}
                    className={`p-3.5 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer flex gap-3 items-start ${
                      !n.read ? "bg-primary-500/5" : ""
                    }`}
                  >
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!n.read ? "font-bold text-[var(--foreground)]" : "font-medium text-[var(--foreground)]/80"}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-[var(--muted-foreground)] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[var(--border)] text-center">
                <Link
                  href={`/${user.role}/notifications`}
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-primary-500 hover:underline block py-1"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-xs font-semibold">
              {getInitials(user.name)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)] hidden sm:block" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl py-1 animate-slide-in-up">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
              </div>
              <Link
                href={`/${user.role}/profile`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--muted)] transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link
                href={`/${user.role}/settings`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--muted)] transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="border-t border-[var(--border)] mt-1 pt-1">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
