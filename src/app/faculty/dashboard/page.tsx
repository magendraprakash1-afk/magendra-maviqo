"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import StatCard from "@/components/shared/StatCard";
import { demoFacultyStats, demoFacultyClasses } from "@/lib/demo-data";
import { getGreeting, cn } from "@/lib/utils";
import {
  Users, CalendarCheck, FileText, GraduationCap, Clock,
  ChevronRight, CheckCircle2, BarChart3, BookOpen, PlusCircle,
} from "lucide-react";
import Link from "next/link";

export default function FacultyDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const s = demoFacultyStats;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl gradient-faculty p-6 text-white">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">{getGreeting()} 👋</p>
          <h2 className="text-2xl font-bold mt-1">{user.name}</h2>
          <p className="text-white/70 text-sm mt-1">{user.designation} • {user.department}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/faculty/attendance" className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
              <CalendarCheck className="w-4 h-4" /> Mark Attendance
            </Link>
            <Link href="/faculty/assignments/create" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
              <PlusCircle className="w-4 h-4" /> Create Assignment
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title="Total Students" value={s.totalStudents} subtitle="Across all classes" icon={Users} color="blue" />
        <StatCard title="Classes Today" value={s.classesToday} subtitle="Scheduled" icon={Clock} color="violet" />
        <StatCard title="Pending Evaluations" value={s.pendingEvaluations} subtitle="Assignments to grade" icon={FileText} color="amber" />
        <StatCard title="Avg. Attendance" value={`${s.averageAttendance}%`} subtitle="This semester" icon={CalendarCheck} color="emerald" trend={{ value: 1.5, label: "vs last month" }} />
      </div>

      {/* Classes & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-500" />
              <h3 className="font-semibold">My Classes</h3>
            </div>
            <Link href="/faculty/classes" className="text-sm text-primary-500 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {demoFacultyClasses.map((cls) => (
              <div key={cls.id} className="flex items-center gap-4 p-4 hover:bg-[var(--muted)]/50 transition-colors">
                <div className="p-2.5 rounded-xl bg-violet-500/10">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{cls.subject}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {cls.code} • Section {cls.section} • Sem {cls.semester}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{cls.students} students</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{cls.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)]">
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-1">
            {[
              { icon: CalendarCheck, label: "Mark Attendance", href: "/faculty/attendance", color: "text-emerald-500 bg-emerald-500/10" },
              { icon: PlusCircle, label: "Create Assignment", href: "/faculty/assignments/create", color: "text-violet-500 bg-violet-500/10" },
              { icon: GraduationCap, label: "Enter Marks", href: "/faculty/exams", color: "text-amber-500 bg-amber-500/10" },
              { icon: BarChart3, label: "View Analytics", href: "/faculty/analytics", color: "text-blue-500 bg-blue-500/10" },
              { icon: Users, label: "Student List", href: "/faculty/students", color: "text-primary-500 bg-primary-500/10" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--muted)] transition-colors"
              >
                <div className={cn("p-2 rounded-lg", action.color)}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
