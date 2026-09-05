"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { CalendarCheck, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sectionAttendance = [
  { section: "5-A", students: 60, avgAttendance: 89.4, below75: 2 },
  { section: "5-B", students: 60, avgAttendance: 87.1, below75: 4 },
  { section: "3-A", students: 62, avgAttendance: 91.5, below75: 1 },
  { section: "3-B", students: 61, avgAttendance: 85.8, below75: 5 },
  { section: "7-A", students: 58, avgAttendance: 92.0, below75: 0 },
  { section: "7-B", students: 57, avgAttendance: 88.6, below75: 3 },
];

export default function HODAttendancePage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Department Attendance Analytics" subtitle="Comprehensive attendance trends and alert reports" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Department Average" value="88.7%" icon={CalendarCheck} color="emerald" trend={{ value: 1.2, label: "vs last month" }} />
        <StatCard title="Total Enrolled" value="358" icon={Users} color="blue" />
        <StatCard title="Defaulters (< 75%)" value="15" subtitle="Require counseling" icon={AlertTriangle} color="rose" />
        <StatCard title="Optimal (> 90%)" value="184" subtitle="51.3% of students" icon={CheckCircle2} color="violet" />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)]">
          <h3 className="font-semibold text-base">Section-wise Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="text-left p-4 font-medium">Class / Section</th>
                <th className="text-center p-4 font-medium">Total Students</th>
                <th className="text-center p-4 font-medium">Average Attendance</th>
                <th className="text-center p-4 font-medium">Defaulters (&lt;75%)</th>
                <th className="text-right p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {sectionAttendance.map((sec) => (
                <tr key={sec.section} className="hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="p-4 font-bold text-sm">Semester {sec.section}</td>
                  <td className="p-4 text-center">{sec.students}</td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-emerald-500">{sec.avgAttendance}%</span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold",
                        sec.below75 > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                      )}
                    >
                      {sec.below75} students
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-3 py-1 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] text-xs font-semibold transition-colors">
                      Notify Parents
                    </button>
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
