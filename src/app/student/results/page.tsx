"use client";

import PageHeader from "@/components/shared/PageHeader";
import { demoResults } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, BookOpen } from "lucide-react";

export default function StudentResults() {
  const { currentSemester, cgpa, semesterGPAs } = demoResults;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Results" subtitle="Academic performance across semesters" />

      {/* CGPA & GPA */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-3">
            <span className="text-2xl font-bold">{cgpa}</span>
          </div>
          <p className="text-sm font-semibold">CGPA</p>
          <p className="text-xs text-[var(--muted-foreground)]">Cumulative</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 text-white mb-3">
            <span className="text-2xl font-bold">{currentSemester.gpa}</span>
          </div>
          <p className="text-sm font-semibold">Latest GPA</p>
          <p className="text-xs text-[var(--muted-foreground)]">Semester {currentSemester.semester}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" /> GPA Trend
          </p>
          <div className="flex items-end gap-3 h-20">
            {semesterGPAs.map((s) => (
              <div key={s.semester} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-primary-500">{s.gpa}</span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary-500 to-primary-400"
                  style={{ height: `${(s.gpa / 10) * 100}%` }}
                />
                <span className="text-[10px] text-[var(--muted-foreground)]">S{s.semester}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Results */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold">Semester {currentSemester.semester} Results</h3>
          </div>
          <span className="text-sm font-medium text-primary-500">GPA: {currentSemester.gpa}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="text-left p-4 font-medium">Subject</th>
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-center p-4 font-medium">Credits</th>
                <th className="text-center p-4 font-medium">Grade</th>
                <th className="text-center p-4 font-medium">Grade Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {currentSemester.subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-[var(--muted)]/50 transition-colors">
                  <td className="p-4 font-medium">{sub.subject}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">{sub.code}</td>
                  <td className="p-4 text-center">{sub.credits}</td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold",
                      sub.grade === "O" ? "bg-emerald-500/10 text-emerald-500" :
                      sub.grade === "A+" ? "bg-blue-500/10 text-blue-500" :
                      sub.grade === "A" ? "bg-primary-500/10 text-primary-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {sub.grade}
                    </span>
                  </td>
                  <td className="p-4 text-center font-semibold">{sub.gradePoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
