"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import StatCard from "@/components/shared/StatCard";
import { demoHODStats, demoDepartments } from "@/lib/demo-data";
import { getGreeting } from "@/lib/utils";
import { Users, GraduationCap, CalendarCheck, BookOpen, Award, FlaskConical, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HODDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const s = demoHODStats;
  const dept = demoDepartments[0]; // CSE

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl gradient-hod p-6 text-white">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">{getGreeting()} 👋</p>
          <h2 className="text-2xl font-bold mt-1">{user.name}</h2>
          <p className="text-white/70 text-sm mt-1">HOD • {user.department}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
        <StatCard title="Faculty" value={s.totalFaculty} icon={Users} color="violet" />
        <StatCard title="Students" value={s.totalStudents} icon={GraduationCap} color="blue" />
        <StatCard title="Attendance" value={`${s.averageAttendance}%`} icon={CalendarCheck} color="emerald" />
        <StatCard title="Pass %" value={`${s.passPercentage}%`} icon={Award} color="amber" />
        <StatCard title="Subjects" value={s.activeSubjects} icon={BookOpen} color="primary" />
        <StatCard title="Labs" value={s.labsAvailable} icon={FlaskConical} color="rose" />
      </div>

      {/* Faculty & Quick Links */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <h3 className="font-semibold">Department Overview</h3>
            <Link href="/hod/reports" className="text-sm text-primary-500 hover:underline">Reports</Link>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--muted)]">
                <p className="text-2xl font-bold">{dept.programs}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Programs Offered</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--muted)]">
                <p className="text-2xl font-bold">94.5%</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">University Results</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Attendance Trend (This Semester)</p>
              <div className="flex items-end gap-1 h-20">
                {[85, 88, 82, 90, 87, 89, 86, 91, 88, 87, 90, 88].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary-500/70 hover:bg-primary-500 transition-colors"
                    style={{ height: `${v}%` }}
                    title={`Week ${i + 1}: ${v}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[var(--muted-foreground)]">
                <span>W1</span><span>W6</span><span>W12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)]">
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-1">
            {[
              { label: "Faculty Management", href: "/hod/faculty", icon: Users },
              { label: "Student Performance", href: "/hod/students", icon: GraduationCap },
              { label: "Attendance Analytics", href: "/hod/attendance", icon: CalendarCheck },
              { label: "Subject Management", href: "/hod/subjects", icon: BookOpen },
              { label: "Timetable", href: "/hod/timetable", icon: CalendarCheck },
              { label: "Department Reports", href: "/hod/reports", icon: Award },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--muted)] transition-colors">
                <a.icon className="w-5 h-5 text-primary-500" />
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
