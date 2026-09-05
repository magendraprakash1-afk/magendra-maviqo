"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { DataStore } from "@/lib/data-store";
import { cn } from "@/lib/utils";
import { CalendarCheck, TrendingUp, AlertCircle } from "lucide-react";

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState(() => DataStore.getAttendanceOverview());

  useEffect(() => {
    const handleUpdate = () => {
      setAttendance(DataStore.getAttendanceOverview());
    };
    window.addEventListener("maviqo_datastore_change", handleUpdate);
    return () => window.removeEventListener("maviqo_datastore_change", handleUpdate);
  }, []);

  const { overall, subjects, monthlyTrend } = attendance;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Attendance" subtitle="Track your attendance across all subjects" />

      {/* Overall */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-emerald-500/20 mb-3">
            <span className={cn("text-2xl font-bold", overall >= 75 ? "text-emerald-500" : "text-rose-500")}>
              {overall}%
            </span>
          </div>
          <p className="text-sm font-medium">Overall Attendance</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">This semester</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
          <p className="text-3xl font-bold text-primary-500">{subjects.filter(s => s.percentage >= 75).length}/{subjects.length}</p>
          <p className="text-sm font-medium mt-2">Subjects Above 75%</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Minimum requirement</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" /> Monthly Trend
          </p>
          <div className="flex items-end gap-2 h-16">
            {monthlyTrend.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary-500/70 hover:bg-primary-500 transition-colors"
                  style={{ height: `${(m.percentage / 100) * 100}%` }}
                />
                <span className="text-[10px] text-[var(--muted-foreground)]">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject-wise Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold">Subject-wise Attendance</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="text-left p-4 font-medium">Subject</th>
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-center p-4 font-medium">Present</th>
                <th className="text-center p-4 font-medium">Total</th>
                <th className="text-center p-4 font-medium">Percentage</th>
                <th className="text-center p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-[var(--muted)]/50 transition-colors">
                  <td className="p-4 font-medium">{sub.subject}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">{sub.code}</td>
                  <td className="p-4 text-center">{sub.present}</td>
                  <td className="p-4 text-center">{sub.total}</td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      sub.percentage >= 90 ? "attendance-good" :
                      sub.percentage >= 75 ? "attendance-warning" : "attendance-danger"
                    )}>
                      {sub.percentage}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {sub.percentage < 75 ? (
                      <span className="flex items-center justify-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="w-3 h-3" /> Low
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-500">Good</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress bars */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h3 className="font-semibold mb-4">Visual Breakdown</h3>
        <div className="space-y-4">
          {subjects.map((sub) => (
            <div key={sub.code}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">{sub.subject}</span>
                <span className={cn("font-semibold", sub.percentage >= 75 ? "text-emerald-500" : "text-rose-500")}>
                  {sub.percentage}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-[var(--muted)] overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    sub.percentage >= 90 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                    sub.percentage >= 75 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                    "bg-gradient-to-r from-rose-500 to-rose-400"
                  )}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
