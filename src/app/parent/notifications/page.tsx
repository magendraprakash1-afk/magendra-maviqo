"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { DataStore, type NotificationItem } from "@/lib/data-store";
import { demoParentChild } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { Bell, CreditCard, Calendar, CheckCheck, Users, AlertCircle } from "lucide-react";

export default function ParentNotificationsPage() {
  const child = demoParentChild;
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    DataStore.getNotifications("parent")
  );

  useEffect(() => {
    const handleSync = () => {
      setNotifications(DataStore.getNotifications("parent"));
    };
    window.addEventListener("maviqo_datastore_change", handleSync);
    return () => window.removeEventListener("maviqo_datastore_change", handleSync);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Parent Alerts & Notices"
          subtitle={`Important updates regarding ${child.name}, fee reminders, and institutional circulars`}
        />
        {unreadCount > 0 && (
          <button
            onClick={() => DataStore.markAllNotificationsRead("parent")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors self-start sm:self-center"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>Mark all read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="divide-y divide-[var(--border)]">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => DataStore.markNotificationRead(n.id)}
              className={cn(
                "flex items-start gap-4 p-5 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer",
                !n.read && "bg-primary-500/5"
              )}
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm text-[var(--foreground)]", !n.read && "font-bold")}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">{n.message}</p>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-2 font-medium">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
