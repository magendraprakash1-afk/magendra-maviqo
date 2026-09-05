"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { demoParentChild, demoWeeklyTimetable } from "@/lib/demo-data";
import { Clock, MapPin, User, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ParentTimetablePage() {
  const child = demoParentChild;
  const [selectedDay, setSelectedDay] = useState("Monday");

  const timetableMap = demoWeeklyTimetable as Record<string, Array<{
    period: number;
    time: string;
    subject: string | null;
    code: string | null;
    faculty: string | null;
    room: string | null;
    type: string;
  }>>;

  const todaySlots = timetableMap[selectedDay] || [];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title={`${child.name}'s Class Timetable`}
        subtitle={`Semester 5 • Section ${child.section} • Department of ${child.department}`}
      />

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              selectedDay === d
                ? "bg-primary-600 text-white shadow-md shadow-primary-500/25"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)]"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Timetable Period List */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/40 flex items-center justify-between">
          <span className="font-bold text-sm text-[var(--foreground)]">Schedule for {selectedDay}</span>
          <span className="text-xs text-[var(--muted-foreground)]">{todaySlots.length} Scheduled Periods</span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {todaySlots.map((slot, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--muted)]/30 transition-colors">
              <div className="flex items-start sm:items-center gap-4">
                <div className="px-3 py-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-mono text-xs font-bold shrink-0 text-center">
                  <Clock className="w-3.5 h-3.5 mx-auto mb-0.5" />
                  <span>{slot.time}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{slot.subject || "Break / Recess"}</h4>
                  {slot.faculty && (
                    <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-1">
                      <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary-500" /> {slot.faculty}</span>
                      {slot.room && (
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> {slot.room}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="self-start sm:self-center">
                <span className="px-3 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)] font-semibold text-[11px] capitalize">
                  {slot.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
