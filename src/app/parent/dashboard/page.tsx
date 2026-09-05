"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import StatCard from "@/components/shared/StatCard";
import { demoParentChild, demoAttendance, demoResults, demoUpcomingExams, demoNotifications, demoFeeStatus } from "@/lib/demo-data";
import { getGreeting, formatCurrency, cn } from "@/lib/utils";
import {
  CalendarCheck, Trophy, CreditCard, GraduationCap,
  ChevronRight, Bell, AlertCircle, Clock,
} from "lucide-react";
import Link from "next/link";

export default function ParentDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const child = demoParentChild;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl gradient-parent p-6 text-white">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">{getGreeting()} 👋</p>
          <h2 className="text-2xl font-bold mt-1">{user.name}</h2>
          <p className="text-white/70 text-sm mt-1">
            Viewing: <span className="font-semibold text-white">{child.name}</span> • {child.department}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title="Attendance" value={`${child.attendance}%`} subtitle="This semester" icon={CalendarCheck} color="emerald" />
        <StatCard title="CGPA" value={child.cgpa.toFixed(2)} subtitle="Cumulative" icon={Trophy} color="amber" />
        <StatCard title="Pending Fees" value={formatCurrency(child.pendingFees)} subtitle={`Due: Oct 15`} icon={CreditCard} color="rose" />
        <StatCard title="Next Exam" value="Sep 15" subtitle={child.nextExam.split(" - ")[0]} icon={GraduationCap} color="violet" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Subject Attendance</h3>
            </div>
            <Link href="/parent/attendance" className="text-sm text-primary-500 hover:underline">Details</Link>
          </div>
          <div className="p-5 space-y-3">
            {demoAttendance.subjects.slice(0, 4).map((sub) => (
              <div key={sub.code} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sub.subject}</p>
                  <div className="h-1.5 rounded-full bg-[var(--muted)] mt-1.5">
                    <div
                      className={cn("h-full rounded-full", sub.percentage >= 75 ? "bg-emerald-500" : "bg-rose-500")}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>
                <span className={cn("text-sm font-semibold", sub.percentage >= 75 ? "text-emerald-500" : "text-rose-500")}>
                  {sub.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-500" />
              <h3 className="font-semibold">Important Updates</h3>
            </div>
            <Link href="/parent/notifications" className="text-sm text-primary-500 hover:underline">All</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {demoNotifications.slice(0, 4).map((n) => (
              <div key={n.id} className="p-4">
                <p className={cn("text-sm", !n.read && "font-medium")}>{n.title}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
