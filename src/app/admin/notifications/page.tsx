"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { DataStore, type NotificationItem } from "@/lib/data-store";
import { type UserRole } from "@/lib/constants";
import { Bell, Send, CheckCircle2, Users, FileText, Megaphone } from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    DataStore.getNotifications()
  );
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState<string>("all");
  const [notifType, setNotifType] = useState<string>("event");
  const [toast, setToast] = useState<string | null>(null);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const item = DataStore.addNotification({
      title,
      message,
      type: notifType as any,
      targetRole: targetRole as any,
    });
    setNotifications([item, ...notifications]);
    setTitle("");
    setMessage("");
    setToast(`Notice broadcasted successfully to target audience (${targetRole.toUpperCase()}).`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Campus Notification Broadcaster & Announcements"
        subtitle="Broadcast campus-wide notices, emergency alerts, circulars, and role-targeted notifications"
      />

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Broadcast Form */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-primary-500" />
          <span>Compose New Institutional Announcement</span>
        </h3>

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1">Notice Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. End-Semester Examination Hall Tickets Released"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Target Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold"
              >
                <option value="all">Everyone (All Campus)</option>
                <option value="student">Students Only</option>
                <option value="faculty">Faculty Members Only</option>
                <option value="parent">Parents Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Announcement Body / Content</label>
            <textarea
              required
              rows={3}
              placeholder="Detailed notification text for the bulletin board and mobile push alert..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold">Type Category:</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs"
              >
                <option value="event">Campus Event</option>
                <option value="exam">Examination</option>
                <option value="fee">Fee Reminder</option>
                <option value="placement">Placement Drive</option>
                <option value="assignment">Academic Assignment</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--foreground)]">Recent Campus Broadcasts</h3>
          <span className="text-xs text-[var(--muted-foreground)]">{notifications.length} Broadcasts Sent</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 hover:bg-[var(--muted)]/40 transition-colors flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{n.title}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] uppercase">
                    Target: {n.targetRole || "All"}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{n.message}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-2 font-medium">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
