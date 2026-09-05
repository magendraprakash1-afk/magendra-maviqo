"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { Clock, Building2, CheckCircle2, AlertTriangle, RefreshCw, Calendar } from "lucide-react";

export default function AdminTimetablePage() {
  const [generating, setGenerating] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState<string | null>(null);

  const handleRegenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedMsg("Campus master schedules optimized with zero hall and faculty conflicts.");
      setTimeout(() => setGeneratedMsg(null), 4000);
    }, 1400);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Campus Master Timetable & Facility Scheduling"
          subtitle="Lecture hall allocations, smart conflict detection, and institutional scheduler"
        />
        <button
          onClick={handleRegenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
          <span>{generating ? "Detecting Conflicts..." : "Optimize Schedule Engine"}</span>
        </button>
      </div>

      {generatedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {generatedMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Active Classrooms" value="42 Halls" icon={Building2} color="blue" />
        <StatCard title="Lab Facilities" value="18 Labs" icon={Clock} color="purple" />
        <StatCard title="Room Utilization" value="89.2%" icon={CheckCircle2} color="emerald" />
        <StatCard title="Schedule Conflicts" value="0 Detected" icon={CheckCircle2} color="emerald" />
      </div>

      {/* Hall Utilization Grid */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="font-bold text-sm text-[var(--foreground)]">Facility Hall Utilization Status (Real-Time)</h3>
          <span className="text-xs text-[var(--muted-foreground)]">Academic Block A, B & Tech Park</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { room: "Lecture Hall 301", capacity: 70, status: "In Use (CSE-A)", period: "09:00 - 10:00", faculty: "Dr. Priya Sharma" },
            { room: "Lecture Hall 302", capacity: 70, status: "In Use (CSE-B)", period: "09:00 - 10:00", faculty: "Prof. Suresh Kumar" },
            { room: "Computing Lab 4", capacity: 60, status: "In Use (Algorithms Lab)", period: "09:00 - 11:00", faculty: "Dr. Ananya Ray" },
            { room: "Seminar Hall 1", capacity: 200, status: "Available", period: "Next: 02:00 PM Guest Lecture", faculty: "Placement Cell" },
            { room: "Electronics Lab 2", capacity: 45, status: "In Use (DSP Lab)", period: "09:00 - 11:00", faculty: "Dr. K. Venkatesh" },
            { room: "Auditorium Main", capacity: 800, status: "Booked (Alumni Meet)", period: "All Day", faculty: "Dean Student Affairs" },
          ].map((h, i) => (
            <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-[var(--foreground)]">{h.room}</h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  h.status === "Available" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                }`}>
                  {h.status === "Available" ? "Available" : "Occupied"}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">Capacity: {h.capacity} seats</p>
              <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] space-y-0.5">
                <p>Activity: <strong className="text-[var(--foreground)]">{h.status}</strong></p>
                <p>In charge: {h.faculty} ({h.period})</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
