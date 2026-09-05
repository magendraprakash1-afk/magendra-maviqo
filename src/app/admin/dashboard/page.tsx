"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import StatCard from "@/components/shared/StatCard";
import { demoAdminStats, demoDepartments } from "@/lib/demo-data";
import { getGreeting, formatCurrency, cn } from "@/lib/utils";
import {
  Users, GraduationCap, Building2, CalendarCheck, CreditCard,
  Award, UserPlus, TrendingUp, ChevronRight, Settings, Bell,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const s = demoAdminStats;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl gradient-admin p-6 text-white">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">{getGreeting()} 👋</p>
          <h2 className="text-2xl font-bold mt-1">{user.name}</h2>
          <p className="text-white/70 text-sm mt-1">Administrator • {user.collegeName}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/users/create" className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
              <UserPlus className="w-4 h-4" /> Add User
            </Link>
            <Link href="/admin/notifications" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
              <Bell className="w-4 h-4" /> Send Notification
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title="Total Students" value={s.totalStudents.toLocaleString()} subtitle={`${s.newAdmissions} new admissions`} icon={GraduationCap} color="blue" trend={{ value: 6.2, label: "vs last year" }} />
        <StatCard title="Total Faculty" value={s.totalFaculty} subtitle={`${s.totalDepartments} departments`} icon={Users} color="violet" />
        <StatCard title="Fee Collection" value={formatCurrency(s.feeCollection)} subtitle={`Pending: ${formatCurrency(s.pendingFees)}`} icon={CreditCard} color="emerald" />
        <StatCard title="Placement %" value={`${s.placementPercentage}%`} subtitle="Current batch" icon={Award} color="amber" trend={{ value: 3.2, label: "vs last year" }} />
      </div>

      {/* Departments Table & Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Departments</h3>
            </div>
            <Link href="/admin/departments" className="text-sm text-primary-500 hover:underline flex items-center gap-1">
              Manage <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                  <th className="text-left p-4 font-medium">Department</th>
                  <th className="text-left p-4 font-medium">HOD</th>
                  <th className="text-center p-4 font-medium">Faculty</th>
                  <th className="text-center p-4 font-medium">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {demoDepartments.slice(0, 6).map((dept) => (
                  <tr key={dept.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{dept.code}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{dept.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--muted-foreground)]">{dept.hod}</td>
                    <td className="p-4 text-center">{dept.faculty}</td>
                    <td className="p-4 text-center font-medium">{dept.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)]">
            <h3 className="font-semibold">Admin Actions</h3>
          </div>
          <div className="p-3 space-y-1">
            {[
              { label: "User Management", href: "/admin/users", icon: Users, color: "text-blue-500 bg-blue-500/10" },
              { label: "Departments", href: "/admin/departments", icon: Building2, color: "text-emerald-500 bg-emerald-500/10" },
              { label: "Fee Management", href: "/admin/fees", icon: CreditCard, color: "text-amber-500 bg-amber-500/10" },
              { label: "Timetable Builder", href: "/admin/timetable", icon: CalendarCheck, color: "text-violet-500 bg-violet-500/10" },
              { label: "Exam Schedule", href: "/admin/exams", icon: GraduationCap, color: "text-rose-500 bg-rose-500/10" },
              { label: "Analytics", href: "/admin/analytics", icon: TrendingUp, color: "text-primary-500 bg-primary-500/10" },
              { label: "Settings", href: "/admin/settings", icon: Settings, color: "text-gray-500 bg-gray-500/10" },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--muted)] transition-colors">
                <div className={cn("p-2 rounded-lg", a.color)}><a.icon className="w-4 h-4" /></div>
                <span className="text-sm font-medium">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
