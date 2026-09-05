"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { demoWeeklyTimetable } from "@/lib/demo-data";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Clock,
  MapPin,
  User,
  BookOpen,
  FlaskConical,
  AlertTriangle,
  Send,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

type DayKey = keyof typeof demoWeeklyTimetable;

interface TimetableIssue {
  id: string;
  category: string;
  day: string;
  period: string;
  description: string;
  status: "Under Review" | "Resolved";
  timestamp: string;
}

const initialNotices = [
  {
    id: "n1",
    title: "Projector Maintenance in Hall LH-201",
    desc: "Period 5 Computer Networks is temporarily shifted to Hall LH-204 for this week.",
    type: "room_change",
  },
];

export default function StudentTimetable() {
  const todayRaw = new Date().toLocaleDateString("en-US", { weekday: "long" }) as DayKey;
  const today: DayKey = (DAYS_OF_WEEK as readonly string[]).includes(todayRaw) ? todayRaw : "Monday";

  const [selectedDay, setSelectedDay] = useState<DayKey>(today);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [typeFilter, setTypeFilter] = useState<"all" | "lecture" | "lab">("all");

  // Problem Reporting Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [issueCategory, setIssueCategory] = useState("Period Clash / Double Booking");
  const [issueDay, setIssueDay] = useState(today);
  const [issuePeriod, setIssuePeriod] = useState("Period 3");
  const [issueDescription, setIssueDescription] = useState("");
  const [reportedIssues, setReportedIssues] = useState<TimetableIssue[]>([]);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  const slots = demoWeeklyTimetable[selectedDay] || [];
  const filteredSlots = slots.filter((slot) => {
    if (typeFilter === "all") return true;
    return slot.type === typeFilter;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) return;

    const newIssue: TimetableIssue = {
      id: `TT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: issueCategory,
      day: issueDay,
      period: issuePeriod,
      description: issueDescription.trim(),
      status: "Under Review",
      timestamp: "Just now",
    };

    setReportedIssues([newIssue, ...reportedIssues]);
    setIssueDescription("");
    setShowReportModal(false);
    setReportSuccess(
      `Your timetable problem (#${newIssue.id}) has been submitted to the Academic Department Dean.`
    );
    setTimeout(() => setReportSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Class Timetable"
        subtitle="Your weekly academic schedule, lecture halls, and problem reporting"
      >
        <div className="flex items-center gap-2">
          {/* Day / Week View Toggle */}
          <div className="flex items-center rounded-xl bg-[var(--muted)] p-1 border border-[var(--border)]">
            <button
              onClick={() => setViewMode("day")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                viewMode === "day"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                viewMode === "week"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              Week Grid
            </button>
          </div>

          {/* Problem in Timetable Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Problem in Timetable?</span>
          </button>
        </div>
      </PageHeader>

      {/* Success Notification */}
      {reportSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{reportSuccess}</span>
        </div>
      )}

      {/* Active Notices / Timetable Problem Alerts */}
      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Timetable Notice & Updates
          </h4>
        </div>
        {initialNotices.map((n) => (
          <div key={n.id} className="text-xs text-[var(--foreground)] pl-6">
            <span className="font-semibold">{n.title}: </span>
            <span className="text-[var(--muted-foreground)]">{n.desc}</span>
          </div>
        ))}
        {reportedIssues.length > 0 && (
          <div className="pt-2 border-t border-amber-500/15 pl-6 space-y-1">
            <p className="text-[11px] font-bold text-[var(--foreground)]">Your Reported Grievances:</p>
            {reportedIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between text-xs py-1">
                <span>
                  #{issue.id}: {issue.category} ({issue.day} - {issue.period})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Day Selector & Type Filters (For Day View) */}
      {viewMode === "day" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day as DayKey)}
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

          <div className="flex items-center gap-1 bg-[var(--muted)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
            <button
              onClick={() => setTypeFilter("all")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all",
                typeFilter === "all" ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs" : "text-[var(--muted-foreground)]"
              )}
            >
              All Slots
            </button>
            <button
              onClick={() => setTypeFilter("lecture")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all",
                typeFilter === "lecture" ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs" : "text-[var(--muted-foreground)]"
              )}
            >
              Lectures
            </button>
            <button
              onClick={() => setTypeFilter("lab")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all",
                typeFilter === "lab" ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs" : "text-[var(--muted-foreground)]"
              )}
            >
              Labs
            </button>
          </div>
        </div>
      )}

      {/* DAY VIEW CARDS */}
      {viewMode === "day" && (
        <div className="space-y-3">
          {filteredSlots.map((slot, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-primary-500/30 shadow-sm",
                slot.type === "break" && "bg-[var(--muted)]/40 border-dashed"
              )}
            >
              {slot.type === "break" ? (
                <div className="text-center py-2">
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Break / Lunch Interval</p>
                  <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">{slot.time}</p>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  {/* Time Badge */}
                  <div className="text-center min-w-[75px] shrink-0 p-2 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)]">
                    <p className="text-sm font-bold font-mono text-primary-600 dark:text-primary-400">
                      {slot.time.split(" - ")[0]}
                    </p>
                    <p className="text-[10px] text-[var(--muted-foreground)] font-mono">
                      to {slot.time.split(" - ")[1]}
                    </p>
                  </div>

                  {/* Vertical indicator */}
                  <div
                    className={cn(
                      "w-1 self-stretch rounded-full shrink-0",
                      slot.type === "lab" ? "bg-violet-500" : "bg-primary-500"
                    )}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[var(--foreground)]">{slot.subject || "Elective"}</h4>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                          slot.type === "lab"
                            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
                            : "bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20"
                        )}
                      >
                        {slot.type === "lab" ? "Laboratory" : "Lecture"}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">
                      Course Code: {slot.code || "—"}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2.5">
                      <span className="flex items-center gap-1.5 text-xs text-[var(--foreground)] font-medium">
                        <User className="w-3.5 h-3.5 text-primary-500" />
                        {slot.faculty || "Faculty Assigned"}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {slot.room || "Main Auditorium"}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "p-2.5 rounded-xl shrink-0 hidden sm:flex",
                      slot.type === "lab" ? "bg-violet-500/10" : "bg-primary-500/10"
                    )}
                  >
                    {slot.type === "lab" ? (
                      <FlaskConical className="w-5 h-5 text-violet-500" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredSlots.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)]">
              <Clock className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
              <p className="text-base font-semibold">No classes matching current criteria</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Enjoy your free time!</p>
            </div>
          )}
        </div>
      )}

      {/* WEEK GRID VIEW */}
      {viewMode === "week" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40 text-[var(--muted-foreground)]">
                  <th className="p-3 text-left font-bold uppercase tracking-wider">Day</th>
                  <th className="p-3 text-left font-bold uppercase tracking-wider">Period 1 (09:00)</th>
                  <th className="p-3 text-left font-bold uppercase tracking-wider">Period 2 (10:00)</th>
                  <th className="p-3 text-left font-bold uppercase tracking-wider">Period 3 (11:00)</th>
                  <th className="p-3 text-left font-bold uppercase tracking-wider">Period 4 (14:00)</th>
                  <th className="p-3 text-left font-bold uppercase tracking-wider">Period 5 (15:00)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {DAYS_OF_WEEK.map((day) => {
                  const daySlots = (demoWeeklyTimetable[day as DayKey] || []).filter((s) => s.type !== "break");
                  return (
                    <tr key={day} className="hover:bg-[var(--muted)]/30">
                      <td className="p-3 font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">
                        {day}
                      </td>
                      {[0, 1, 2, 3, 4].map((idx) => {
                        const sl = daySlots[idx];
                        if (!sl) {
                          return (
                            <td key={idx} className="p-3 text-[var(--muted-foreground)] italic">
                              Free
                            </td>
                          );
                        }
                        return (
                          <td key={idx} className="p-3">
                            <div className="font-semibold text-[var(--foreground)]">{sl.subject}</div>
                            <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                              <span>{sl.room}</span> • <span>{sl.faculty?.split(" ")[1] || sl.faculty}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT TIMETABLE PROBLEM MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">Report Timetable Problem</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Report schedule clashes, hall conflicts, or missing faculties
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                  Problem Type
                </label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs font-medium outline-none"
                >
                  <option value="Period Clash / Double Booking">Period Clash / Double Booking</option>
                  <option value="Hall Overlap / Room Capacity Issue">Hall Overlap / Room Capacity Issue</option>
                  <option value="Faculty Unavailable / Substitution Missing">Faculty Unavailable / Substitution Missing</option>
                  <option value="Lab Hardware / System Failure">Lab Hardware / System Failure</option>
                  <option value="Timing Mismatch / Bell Discrepancy">Timing Mismatch / Bell Discrepancy</option>
                  <option value="Other Timetable Discrepancy">Other Timetable Discrepancy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                    Day
                  </label>
                  <select
                    value={issueDay}
                    onChange={(e) => setIssueDay(e.target.value as DayKey)}
                    className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs font-medium outline-none"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                    Affected Period
                  </label>
                  <select
                    value={issuePeriod}
                    onChange={(e) => setIssuePeriod(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs font-medium outline-none"
                  >
                    <option value="Period 1 (09:00 - 09:50)">Period 1 (09:00 - 09:50)</option>
                    <option value="Period 2 (10:00 - 10:50)">Period 2 (10:00 - 10:50)</option>
                    <option value="Period 3 (11:00 - 11:50)">Period 3 (11:00 - 11:50)</option>
                    <option value="Period 4 (14:00 - 14:50)">Period 4 (14:00 - 14:50)</option>
                    <option value="Period 5 (15:00 - 15:50)">Period 5 (15:00 - 15:50)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                  Problem Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue in detail (e.g., Two batches assigned to Lab 1 at 11:00 AM)..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors shadow-md shadow-rose-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Problem Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
