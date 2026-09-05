"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import StatCard from "@/components/shared/StatCard";
import { demoManagementStats, demoAdminStats } from "@/lib/demo-data";
import { getGreeting, formatCurrency } from "@/lib/utils";
import {
  IndianRupee, Users, GraduationCap, CalendarCheck, Award,
  TrendingUp, Building2,
} from "lucide-react";

export default function ManagementDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const ms = demoManagementStats;
  const as = demoAdminStats;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl gradient-management p-6 text-white">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">{getGreeting()} 👋</p>
          <h2 className="text-2xl font-bold mt-1">{user.name}</h2>
          <p className="text-white/70 text-sm mt-1">{user.designation} • {user.collegeName}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title="Total Revenue" value={formatCurrency(ms.totalRevenue)} subtitle="Academic Year 2026-27" icon={IndianRupee} color="emerald" trend={{ value: 12.5, label: "vs last year" }} />
        <StatCard title="Student Strength" value={as.totalStudents.toLocaleString()} icon={GraduationCap} color="blue" trend={{ value: 6.2, label: "growth" }} />
        <StatCard title="Overall Attendance" value={`${as.overallAttendance}%`} icon={CalendarCheck} color="amber" />
        <StatCard title="Placement Rate" value={`${as.placementPercentage}%`} icon={Award} color="violet" trend={{ value: 3.2, label: "improvement" }} />
      </div>

      {/* Revenue Chart & Department Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Monthly Revenue</h3>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-3 h-40">
              {ms.monthlyRevenue.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 transition-colors"
                    style={{ height: `${(m.amount / 55000000) * 100}%` }}
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold">Department Performance</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                  <th className="text-left p-3 font-medium">Dept</th>
                  <th className="text-center p-3 font-medium">Attend.</th>
                  <th className="text-center p-3 font-medium">Pass %</th>
                  <th className="text-center p-3 font-medium">Placed %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {ms.departmentPerformance.map((d) => (
                  <tr key={d.department} className="hover:bg-[var(--muted)]/50">
                    <td className="p-3 font-medium">{d.department}</td>
                    <td className="p-3 text-center">{d.attendance}%</td>
                    <td className="p-3 text-center">{d.passPercentage}%</td>
                    <td className="p-3 text-center font-medium text-emerald-500">{d.placement}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Strength Trend */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Student Strength Trend</h3>
        </div>
        <div className="flex items-end gap-6 h-32">
          {ms.studentStrength.map((s) => (
            <div key={s.year} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-sm font-bold">{s.count.toLocaleString()}</span>
              <div
                className="w-full max-w-[60px] rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400"
                style={{ height: `${(s.count / 3500) * 100}%` }}
              />
              <span className="text-xs text-[var(--muted-foreground)]">{s.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
