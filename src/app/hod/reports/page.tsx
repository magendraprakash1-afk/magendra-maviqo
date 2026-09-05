"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { FileBarChart, Download, CheckCircle2, TrendingUp, Award, Calendar, FileText } from "lucide-react";

export default function HODReportsPage() {
  const reports = [
    { title: "NBA Criterion 3 - Course Outcomes & Attainment", period: "Semester 5 (2026-27)", size: "2.4 MB", type: "PDF Audit Report", ready: true },
    { title: "NAAC SSR Metric 2.6 - Student Performance & Learning Outcomes", period: "Academic Year 2025-26", size: "4.1 MB", type: "Comprehensive SSR", ready: true },
    { title: "Mid-Term Academic Pass Percentage & Defaulters Analysis", period: "Internal Assessment 1", size: "840 KB", type: "Spreadsheet & Analytics", ready: true },
    { title: "Faculty Student Feedback Rating Summary", period: "Odd Semester 2026", size: "1.2 MB", type: "Evaluation Dossier", ready: true },
    { title: "Department Placement & Higher Studies Progress Dossier", period: "Batch 2023-2027", size: "3.6 MB", type: "Placement Cell Record", ready: true },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Department Academic & Accreditation Reports"
          subtitle="NBA/NAAC compliance metrics, pass percentages, faculty evaluations, and audit exports"
        />
        <button
          onClick={() => alert("Compiling full NBA Criteria 1-10 ZIP bundle for Department of Computer Science...")}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export Full NBA Dossier</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="NBA Accreditation" value="Tier-1 (Valid)" icon={Award} color="emerald" />
        <StatCard title="Avg Pass Percentage" value="95.4%" trend={{ value: "+3.1%", positive: true }} icon={TrendingUp} color="blue" />
        <StatCard title="Faculty Rating" value="4.8 / 5.0" icon={CheckCircle2} color="purple" />
        <StatCard title="Total Publications" value="48 Scopus" icon={FileText} color="amber" />
      </div>

      {/* Reports List */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--foreground)]">Official Department Reports & Audits</h3>
          <span className="text-xs text-[var(--muted-foreground)]">{reports.length} Verified Documents</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {reports.map((r, idx) => (
            <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--muted)]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 shrink-0">
                  <FileBarChart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{r.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)] mt-1">
                    <span>{r.period}</span>
                    <span>•</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{r.type}</span>
                    <span>•</span>
                    <span className="font-mono">{r.size}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading verified document: "${r.title}" (${r.size})`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors self-start sm:self-center"
              >
                <Download className="w-3.5 h-3.5 text-primary-500" />
                <span>Download Report</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
