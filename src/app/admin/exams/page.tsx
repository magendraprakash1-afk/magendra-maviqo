"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { GraduationCap, Calendar, Download, CheckCircle2, AlertCircle, FileText, Send } from "lucide-react";

export default function AdminExamsPage() {
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleGenerateHallTickets = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setToast("Digital Hall Tickets generated for 2,040 eligible students and pushed to student portals.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Office of the Controller of Examinations (COE)"
          subtitle="Semester examinations schedule, hall tickets generation, and results publication"
        />
        <button
          onClick={handleGenerateHallTickets}
          disabled={publishing}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{publishing ? "Generating Hall Tickets..." : "Release Digital Hall Tickets"}</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Upcoming Exam Cycle" value="End-Sem 2026" icon={GraduationCap} color="blue" />
        <StatCard title="Eligible Candidates" value="2,040 Students" icon={CheckCircle2} color="emerald" />
        <StatCard title="Exam Venues" value="16 Exam Halls" icon={Calendar} color="purple" />
        <StatCard title="Invigilation Roster" value="84 Faculty" icon={FileText} color="amber" />
      </div>

      {/* Exam Timetable Overview */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--foreground)]">End-Semester University Exam Schedule</h3>
          <span className="text-xs text-[var(--muted-foreground)]">Anna University / Autonomous Curriculum</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[
            { date: "2026-10-12", code: "CS3501", name: "Design & Analysis of Algorithms", time: "10:00 AM - 01:00 PM", halls: "Halls 101 to 108", students: 300 },
            { date: "2026-10-15", code: "CS3502", name: "Operating Systems", time: "10:00 AM - 01:00 PM", halls: "Halls 101 to 108", students: 300 },
            { date: "2026-10-18", code: "CS3503", name: "Database Management Systems", time: "10:00 AM - 01:00 PM", halls: "Halls 101 to 108", students: 300 },
            { date: "2026-10-21", code: "CS3504", name: "Artificial Intelligence", time: "10:00 AM - 01:00 PM", halls: "Halls 101 to 108", students: 300 },
          ].map((ex) => (
            <div key={ex.code} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--muted)]/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded bg-primary-500/10">
                    {ex.code}
                  </span>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{ex.name}</h4>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {ex.date} • {ex.time} • Assigned {ex.halls}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert(`Seating chart downloaded for ${ex.code}`)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold"
                >
                  Seating Chart
                </button>
                <button
                  onClick={() => alert(`Invigilation squad duties dispatched for ${ex.code}`)}
                  className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm"
                >
                  Squad Allocation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
