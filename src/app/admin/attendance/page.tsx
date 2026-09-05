"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { Users, AlertTriangle, CheckCircle2, Download, Filter, Search, Calendar } from "lucide-react";
import { useState } from "react";

export default function AdminAttendancePage() {
  const [selectedDept, setSelectedDept] = useState("All");

  const deptAttendance = [
    { dept: "Computer Science & Engg", totalStudents: 720, presentToday: 672, percentage: 93.3, defaulters: 12 },
    { dept: "AI & Data Science", totalStudents: 480, presentToday: 456, percentage: 95.0, defaulters: 6 },
    { dept: "Electronics & Communication", totalStudents: 480, presentToday: 432, percentage: 90.0, defaulters: 18 },
    { dept: "Mechanical Engineering", totalStudents: 240, presentToday: 211, percentage: 87.9, defaulters: 14 },
    { dept: "Management Studies (MBA)", totalStudents: 120, presentToday: 114, percentage: 95.0, defaulters: 2 },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Campus Attendance & Biometric Monitoring"
          subtitle="Real-time campus biometric attendance tracking, department averages, and shortage alerts"
        />
        <button
          onClick={() => alert("Downloading official campus-wide attendance shortage list (<75%) for parent notification...")}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export Defaulter Shortage List</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Overall Campus Attendance" value="92.6%" trend={{ value: "+1.2%", positive: true }} icon={CheckCircle2} color="emerald" />
        <StatCard title="Students Present Today" value="1,885 / 2,040" icon={Users} color="blue" />
        <StatCard title="Faculty Attendance" value="98.1%" icon={CheckCircle2} color="purple" />
        <StatCard title="Attendance Defaulters" value="52 Students" icon={AlertTriangle} color="rose" />
      </div>

      {/* Department Breakdown */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--foreground)]">Department Attendance Rates (Today)</h3>
          <span className="text-xs text-[var(--muted-foreground)]">Live Biometric Feed</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {deptAttendance.map((d) => (
            <div key={d.dept} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--muted)]/40 transition-colors">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[var(--foreground)]">{d.dept}</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {d.presentToday} present out of {d.totalStudents} enrolled students
                </p>
              </div>

              <div className="flex items-center gap-6 self-start sm:self-center">
                <div className="text-right">
                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{d.percentage}%</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Daily Avg</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold text-xs border border-rose-500/20">
                    {d.defaulters} Defaulters
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
