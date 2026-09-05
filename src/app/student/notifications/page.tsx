"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { DataStore, type NotificationItem } from "@/lib/data-store";
import { cn } from "@/lib/utils";
import { Bell, GraduationCap, FileText, Briefcase, CreditCard, Calendar, CheckCheck } from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  exam: GraduationCap,
  assignment: FileText,
  placement: Briefcase,
  fee: CreditCard,
  event: Calendar,
};

const typeColors: Record<string, string> = {
  exam: "bg-amber-500/10 text-amber-500",
  assignment: "bg-violet-500/10 text-violet-500",
  placement: "bg-blue-500/10 text-blue-500",
  fee: "bg-rose-500/10 text-rose-500",
  event: "bg-emerald-500/10 text-emerald-500",
};

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    DataStore.getNotifications("student")
  );

  useEffect(() => {
    const handleSync = () => {
      setNotifications(DataStore.getNotifications("student"));
    };
    window.addEventListener("maviqo_datastore_change", handleSync);
    return () => window.removeEventListener("maviqo_datastore_change", handleSync);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    DataStore.markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    DataStore.markAllNotificationsRead("student");
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Notifications & Alerts" 
          subtitle="Stay updated with academic notices, assignments, and campus broadcasts" 
        />
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors self-start sm:self-center"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>Mark all as read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="divide-y divide-[var(--border)]">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-sm text-[var(--muted-foreground)]">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = typeIcons[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={cn(
                    "flex items-start gap-4 p-5 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer",
                    !n.read && "bg-primary-500/5"
                  )}
                >
                  <div className={cn("p-2.5 rounded-xl shrink-0 transition-transform hover:scale-105", typeColors[n.type] || "bg-gray-500/10")}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm text-[var(--foreground)]", !n.read && "font-bold")}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-2 font-medium">{n.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
