"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { BarChart3, TrendingUp, AlertTriangle, Users, Award, Sparkles, CheckCircle2 } from "lucide-react";

export default function FacultyAnalyticsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Course Analytics & Performance Intelligence"
        subtitle="Grade distributions, attendance correlations, and predictive student risk alerts"
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Course Pass Rate" value="94.2%" trend={{ value: "+2.4%", positive: true }} icon={TrendingUp} color="emerald" />
        <StatCard title="Avg Internal Score" value="41.5 / 50" trend={{ value: "+1.8", positive: true }} icon={Award} color="blue" />
        <StatCard title="Class Attendance" value="86.8%" trend={{ value: "-0.5%", positive: false }} icon={Users} color="purple" />
        <StatCard title="At-Risk Alerts" value="4 Students" icon={AlertTriangle} color="amber" />
      </div>

      {/* AI Performance Insights */}
      <div className="rounded-2xl border border-primary-500/30 bg-primary-500/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm">
          <Sparkles className="w-5 h-5" />
          <span>Maviqo AI Academic Intelligence Insights</span>
        </div>
        <p className="text-xs text-[var(--foreground)] leading-relaxed">
          Based on the last 3 internal quizzes and assignment submissions in <strong>Design & Analysis of Algorithms</strong>, 
          students scored 18% lower on <em>Dynamic Programming</em> compared to <em>Divide & Conquer</em>. 
          Suggest organizing a 45-minute interactive tutorial on memoization before the end-semester exams.
        </p>
        <div className="flex items-center gap-2 pt-2">
          <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-xs">
            Action: 4 Students identified for remedial session
          </span>
        </div>
      </div>

      {/* Grade Distribution & Attendance Trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-bold text-sm">Grade Distribution Curve (Internal 1)</h3>
            <span className="text-xs text-[var(--muted-foreground)]">Total 65 Students</span>
          </div>

          <div className="space-y-3">
            {[
              { grade: "O Grade (90-100)", count: 14, pct: 21, color: "bg-emerald-500" },
              { grade: "A+ Grade (80-89)", count: 26, pct: 40, color: "bg-teal-500" },
              { grade: "A Grade (70-79)", count: 16, pct: 25, color: "bg-blue-500" },
              { grade: "B+ Grade (60-69)", count: 6, pct: 9, color: "bg-amber-500" },
              { grade: "Below 60 (Remedial)", count: 3, pct: 5, color: "bg-rose-500" },
            ].map((g) => (
              <div key={g.grade} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">{g.grade}</span>
                  <span className="text-[var(--muted-foreground)] font-medium">{g.count} students ({g.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div className={`h-full rounded-full ${g.color}`} style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-bold text-sm">Attendance vs Exam Score Correlation</h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+0.82 High Positive</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--muted)]/40 text-xs space-y-3">
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Students maintaining <strong>&gt;85% attendance</strong> scored an average of <strong>44.2 / 50</strong> in internal assessments.
              Students with <strong>&lt;75% attendance</strong> had an average of <strong>29.6 / 50</strong>.
            </p>
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-medium text-[var(--muted-foreground)]">
              <span>High Attendance Tier: 48 students</span>
              <span className="text-emerald-600 font-bold">Avg Grade: A+</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-[var(--muted-foreground)]">
              <span>Attendance Shortage Tier: 4 students</span>
              <span className="text-rose-600 font-bold">Avg Grade: C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
