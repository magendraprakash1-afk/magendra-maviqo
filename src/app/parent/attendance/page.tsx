"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { demoAttendance, demoParentChild } from "@/lib/demo-data";
import { CalendarCheck, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ParentAttendancePage() {
  const child = demoParentChild;
  const { overall, subjects, monthlyTrend } = demoAttendance;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title={`${child.name}'s Attendance`}
        subtitle={`${child.department} • Semester ${child.semester} • Roll No: ${child.rollNumber}`}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overall}%`}
          subtitle="Requirement: Minimum 75%"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Classes Attended"
          value="248 / 272"
          subtitle="91.2% attendance rate"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Attendance Status"
          value="Optimal"
          subtitle="No condonation risk"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)]">
          <h3 className="font-semibold">Subject-wise Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="text-left p-4 font-medium">Subject</th>
                <th className="text-center p-4 font-medium">Present</th>
                <th className="text-center p-4 font-medium">Total</th>
                <th className="text-center p-4 font-medium">Percentage</th>
                <th className="text-center p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {subjects.map((s) => (
                <tr key={s.code} className="hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold">{s.subject}</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">{s.code}</p>
                  </td>
                  <td className="p-4 text-center">{s.present}</td>
                  <td className="p-4 text-center">{s.total}</td>
                  <td className="p-4 text-center font-bold">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold",
                        s.percentage >= 90 && "bg-emerald-500/10 text-emerald-500",
                        s.percentage >= 75 && s.percentage < 90 && "bg-amber-500/10 text-amber-500",
                        s.percentage < 75 && "bg-rose-500/10 text-rose-500"
                      )}
                    >
                      {s.percentage}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {s.percentage >= 75 ? (
                      <span className="text-xs text-emerald-500 font-semibold">Safe</span>
                    ) : (
                      <span className="text-xs text-rose-500 font-semibold flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Warning
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
