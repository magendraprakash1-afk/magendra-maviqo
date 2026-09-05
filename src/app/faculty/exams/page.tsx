"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { demoUpcomingExams, demoFacultyClasses } from "@/lib/demo-data";
import { GraduationCap, Calendar, Clock, MapPin, Users, CheckCircle2, Edit3, Award, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamEntry {
  id: string;
  name: string;
  subject: string;
  code: string;
  date: string;
  time: string;
  hall: string;
  studentsCount: number;
  duty: "Chief Invigilator" | "Assistant Invigilator" | "Paper Evaluator";
  status: "Scheduled" | "Marks Pending" | "Completed";
}

const facultyExams: ExamEntry[] = [
  {
    id: "EX-FAC-1",
    name: "Mid-Term Examination (Internal 1)",
    subject: "Design & Analysis of Algorithms",
    code: "CS3501",
    date: "2026-09-15",
    time: "09:30 AM - 12:30 PM",
    hall: "Hall 302, Academic Block A",
    studentsCount: 65,
    duty: "Chief Invigilator",
    status: "Scheduled",
  },
  {
    id: "EX-FAC-2",
    name: "Mid-Term Examination (Internal 1)",
    subject: "Artificial Intelligence",
    code: "CS3504",
    date: "2026-09-19",
    time: "01:30 PM - 04:30 PM",
    hall: "Hall 201, Academic Block B",
    studentsCount: 62,
    duty: "Assistant Invigilator",
    status: "Scheduled",
  },
  {
    id: "EX-FAC-3",
    name: "Laboratory Practical Exam",
    subject: "Algorithms Lab",
    code: "CS3511",
    date: "2026-09-22",
    time: "09:00 AM - 01:00 PM",
    hall: "Computing Lab 4",
    studentsCount: 60,
    duty: "Paper Evaluator",
    status: "Marks Pending",
  },
];

export default function FacultyExamsPage() {
  const [exams, setExams] = useState<ExamEntry[]>(facultyExams);
  const [activeMarksModal, setActiveMarksModal] = useState<ExamEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMarksModal) return;
    setExams(exams.map((ex) => (ex.id === activeMarksModal.id ? { ...ex, status: "Completed" } : ex)));
    setToast(`Marks and rubrics recorded for ${activeMarksModal.subject}! Uploaded to Academic Controller.`);
    setActiveMarksModal(null);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Examinations & Mark Entries"
        subtitle="Invigilation schedule, exam duties, and grade/mark entry submission"
      />

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Assigned Duties" value={exams.length.toString()} icon={GraduationCap} color="blue" />
        <StatCard title="Total Candidates" value="187" icon={Users} color="purple" />
        <StatCard title="Pending Grading" value={exams.filter(e => e.status === "Marks Pending").length.toString()} icon={Clock} color="amber" />
        <StatCard title="Completed" value={exams.filter(e => e.status === "Completed").length.toString()} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Exam Duty Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-[var(--foreground)]">Assigned Duties & Evaluator Roster</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((ex) => (
            <div
              key={ex.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded bg-primary-500/10">
                    {ex.code}
                  </span>
                  <span className={cn(
                    "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                    ex.status === "Completed" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                    ex.status === "Marks Pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                    ex.status === "Scheduled" && "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  )}>
                    {ex.status}
                  </span>
                </div>

                <h4 className="font-bold text-base text-[var(--foreground)] mt-3">{ex.subject}</h4>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{ex.name}</p>

                <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2 text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span>{ex.date} • {ex.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{ex.hall}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-purple-500" />
                    <span>Duty: <strong className="text-[var(--foreground)]">{ex.duty}</strong> ({ex.studentsCount} students)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <button
                  onClick={() => alert(`Attendance sheet for Hall ${ex.hall} generated with candidate roll numbers.`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <span>Hall Roster</span>
                </button>
                <button
                  onClick={() => setActiveMarksModal(ex)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{ex.status === "Completed" ? "Edit Marks" : "Enter Marks"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marks Modal */}
      {activeMarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Enter Assessment Marks</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {activeMarksModal.subject} ({activeMarksModal.code}) • Max Marks: 100
            </p>

            <form onSubmit={handleSaveMarks} className="space-y-4">
              <div className="max-h-60 overflow-y-auto divide-y divide-[var(--border)] pr-2">
                {[
                  { roll: "CS2024001", name: "Aarav Patel", mark: 92 },
                  { roll: "CS2024002", name: "Ananya Sharma", mark: 88 },
                  { roll: "CS2024003", name: "Deepak Kumar", mark: 74 },
                  { roll: "CS2024004", name: "Karthik Raja", mark: 85 },
                  { roll: "CS2024005", name: "Meera Nair", mark: 95 },
                ].map((s) => (
                  <div key={s.roll} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="font-mono text-[10px] text-[var(--muted-foreground)]">{s.roll}</p>
                    </div>
                    <input
                      type="number"
                      defaultValue={s.mark}
                      max={100}
                      min={0}
                      className="w-16 px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] text-right font-bold text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setActiveMarksModal(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm"
                >
                  Submit Final Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
