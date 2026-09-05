"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Clock,
  MapPin,
  Users,
  BookOpen,
  CalendarCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
  Calendar,
  Building,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface FacultyClassSlot {
  period: number;
  time: string;
  subject: string;
  code: string;
  section: string;
  room: string;
  type: "lecture" | "lab";
  students: number;
}

const facultyWeeklySchedule: Record<string, FacultyClassSlot[]> = {
  Monday: [
    { period: 1, time: "09:00 - 09:50", subject: "Data Structures", code: "CS3301", section: "Sec A", room: "LH-201", type: "lecture", students: 62 },
    { period: 2, time: "10:00 - 10:50", subject: "Data Structures", code: "CS3301", section: "Sec B", room: "LH-203", type: "lecture", students: 58 },
  ],
  Tuesday: [
    { period: 2, time: "10:00 - 10:50", subject: "Data Structures", code: "CS3301", section: "Sec A", room: "LH-201", type: "lecture", students: 62 },
    { period: 3, time: "11:00 - 12:50", subject: "DS & Algorithms Lab", code: "CS3311", section: "Sec A (Batch 1)", room: "Lab-1", type: "lab", students: 31 },
  ],
  Wednesday: [
    { period: 5, time: "15:00 - 15:50", subject: "Data Structures", code: "CS3301", section: "Sec A", room: "LH-201", type: "lecture", students: 62 },
  ],
  Thursday: [
    { period: 2, time: "10:00 - 10:50", subject: "Algorithm Design", code: "CS3501", section: "Sec A", room: "LH-301", type: "lecture", students: 45 },
    { period: 4, time: "14:00 - 15:50", subject: "Advanced Algorithms Lab", code: "CS3511", section: "Sec A", room: "Lab-4", type: "lab", students: 45 },
  ],
  Friday: [
    { period: 1, time: "09:00 - 09:50", subject: "Data Structures", code: "CS3301", section: "Sec A", room: "LH-201", type: "lecture", students: 62 },
    { period: 3, time: "11:00 - 11:50", subject: "Mentorship & Doubt Clearing", code: "MENT", section: "Sec A", room: "Cabin 402", type: "lecture", students: 20 },
  ],
  Saturday: [
    { period: 2, time: "10:00 - 10:50", subject: "Special Remedial Lecture", code: "CS3301", section: "Sec A", room: "LH-201", type: "lecture", students: 25 },
  ],
};

export default function FacultyTimetablePage() {
  const todayRaw = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const today = DAYS_OF_WEEK.includes(todayRaw as typeof DAYS_OF_WEEK[number]) ? todayRaw : "Monday";

  const [selectedDay, setSelectedDay] = useState(today);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState("Request Class Substitute");
  const [affectedPeriod, setAffectedPeriod] = useState("Period 1 (09:00 - 09:50)");
  const [issueReason, setIssueReason] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const slots = facultyWeeklySchedule[selectedDay] || [];

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueReason.trim()) return;

    setNotification(
      `Request submitted to HOD Chamber: ${issueType} on ${selectedDay} (${affectedPeriod}). Reference: #REQ-${Math.floor(1000 + Math.random() * 9000)}`
    );
    setIssueReason("");
    setShowIssueModal(false);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Faculty Teaching Timetable"
        subtitle="Weekly lecture schedule, laboratory rosters, and substitution management"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIssueModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Report Issue / Substitute</span>
          </button>
          <Link
            href="/faculty/attendance"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Attendance</span>
          </Link>
        </div>
      </PageHeader>

      {/* Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Teaching Workload Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="p-3 rounded-xl bg-[var(--muted)]/50">
          <p className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">Weekly Workload</p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-0.5">14 Hours</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Theory + Labs</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--muted)]/50">
          <p className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">Allocated Classes</p>
          <p className="text-xl font-bold text-violet-600 dark:text-violet-400 mt-0.5">3 Batches</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">CSE-A, CSE-B & Final Year</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--muted)]/50">
          <p className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">Total Students</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">165</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Enrolled in courses</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--muted)]/50">
          <p className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">Timetable Status</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">0 Clashes</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Verified by HOD</p>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              selectedDay === day
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
            )}
          >
            {day}
            {day === today && <span className="ml-1 text-[10px] text-amber-300 font-bold">• Today</span>}
          </button>
        ))}
      </div>

      {/* Schedule for Selected Day */}
      <div className="space-y-3">
        {slots.map((slot, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:border-primary-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-center min-w-[85px] shrink-0">
                <span className="text-sm font-bold font-mono text-primary-600 dark:text-primary-400">
                  {slot.time.split(" - ")[0]}
                </span>
                <span className="block text-[10px] text-[var(--muted-foreground)] font-mono">
                  to {slot.time.split(" - ")[1]}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{slot.subject}</h4>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      slot.type === "lab"
                        ? "bg-violet-500/10 text-violet-600 border border-violet-500/20"
                        : "bg-primary-500/10 text-primary-600 border border-primary-500/20"
                    )}
                  >
                    {slot.type === "lab" ? "Lab Session" : "Theory Class"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)] mt-1.5">
                  <span className="font-mono">{slot.code}</span>
                  <span>•</span>
                  <span className="font-medium text-[var(--foreground)]">{slot.section}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {slot.room}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary-500" /> {slot.students} Students
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Link
                href="/faculty/attendance"
                className="px-3.5 py-1.5 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Mark Attendance</span>
              </Link>
            </div>
          </div>
        ))}

        {slots.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)]">
            <Clock className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
            <p className="text-base font-semibold">No teaching sessions scheduled for {selectedDay}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Time available for research, mentorship, and paper evaluation.
            </p>
          </div>
        )}
      </div>

      {/* ISSUE / SUBSTITUTE REPORTING MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">Timetable Problem / Substitution</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Report schedule clash, hall unavailability or request class substitute
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                  Request / Problem Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs font-medium outline-none"
                >
                  <option value="Request Class Substitute">Request Class Substitute (Faculty Leave / Duty)</option>
                  <option value="Lecture Hall Double-Booking / Conflict">Lecture Hall Double-Booking / Conflict</option>
                  <option value="Lab Equipment / Projector Disruption">Lab Equipment / Projector Disruption</option>
                  <option value="Reschedule Class Slot">Reschedule Class Slot</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                  Affected Period
                </label>
                <select
                  value={affectedPeriod}
                  onChange={(e) => setAffectedPeriod(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs font-medium outline-none"
                >
                  <option value="Period 1 (09:00 - 09:50)">Period 1 (09:00 - 09:50)</option>
                  <option value="Period 2 (10:00 - 10:50)">Period 2 (10:00 - 10:50)</option>
                  <option value="Period 3 (11:00 - 12:50)">Period 3 (11:00 - 12:50 - Lab)</option>
                  <option value="Period 4 (14:00 - 15:50)">Period 4 (14:00 - 15:50 - Lab)</option>
                  <option value="Period 5 (15:00 - 15:50)">Period 5 (15:00 - 15:50)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                  Reason & Substitute Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Attending AI Research Conference. Dr. Ramesh has agreed to handle Period 2..."
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-colors shadow-md shadow-primary-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit to HOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
