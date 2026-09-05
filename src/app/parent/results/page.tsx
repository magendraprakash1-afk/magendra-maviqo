"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { demoParentChild, demoResults } from "@/lib/demo-data";
import { Trophy, Download, Award, CheckCircle2, TrendingUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ParentResultsPage() {
  const child = demoParentChild;
  const current = demoResults.currentSemester;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={`${child.name}'s Academic Results`}
          subtitle="Semester performance, official SGPA/CGPA marksheets, and subject grade reports"
        />
        <button
          onClick={() => alert(`Downloading official consolidated marksheet for ${child.name} (${child.rollNo})`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Download Semester Marksheet</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Cumulative CGPA" value={demoResults.cgpa.toFixed(2)} icon={Trophy} color="emerald" />
        <StatCard title={`Latest SGPA (Sem ${current.semester})`} value={current.gpa.toFixed(2)} icon={TrendingUp} color="blue" />
        <StatCard title="Total Credits Earned" value="88 Credits" icon={Award} color="purple" />
        <StatCard title="Standing Status" value="First Class Distinction" icon={CheckCircle2} color="amber" />
      </div>

      {/* Semester GPA History Overview */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-[var(--foreground)]">Semester GPA Progression</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {demoResults.semesterGPAs.map((sg) => (
            <div key={sg.semester} className="p-3 rounded-xl bg-[var(--muted)]/40 text-center">
              <p className="text-xs text-[var(--muted-foreground)]">Semester {sg.semester}</p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-0.5">{sg.gpa.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Semester Subjects Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--muted)]/40">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">Semester {current.semester} Examination Marksheet</h3>
              <p className="text-xs text-[var(--muted-foreground)]">SGPA: <strong className="text-primary-600 dark:text-primary-400">{current.gpa}</strong></p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
            All Cleared
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--muted)]/20 border-b border-[var(--border)] text-[var(--muted-foreground)] uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-4">Subject Name</th>
                <th className="p-4">Course Code</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Grade Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {current.subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-[var(--muted)]/20 transition-colors">
                  <td className="p-4 font-semibold text-[var(--foreground)]">{sub.subject}</td>
                  <td className="p-4 font-mono font-medium text-primary-600 dark:text-primary-400">{sub.code}</td>
                  <td className="p-4 font-medium">{sub.credits}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full font-bold text-[10px] border",
                      sub.grade === "O" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      sub.grade === "A+" ? "bg-teal-500/10 text-teal-600 border-teal-500/20" :
                      "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    )}>
                      {sub.grade}
                    </span>
                  </td>
                  <td className="p-4 font-bold">{sub.gradePoint} / 10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
