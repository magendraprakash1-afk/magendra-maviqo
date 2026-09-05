"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Clock, Calendar, MapPin, User, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = [
  { time: "09:00 - 10:00", label: "Period 1" },
  { time: "10:00 - 11:00", label: "Period 2" },
  { time: "11:15 - 12:15", label: "Period 3" },
  { time: "12:15 - 01:15", label: "Period 4" },
  { time: "02:00 - 03:00", label: "Period 5" },
  { time: "03:00 - 04:00", label: "Period 6" },
];

const mockTimetable: Record<string, { subject: string; code: string; faculty: string; room: string }[]> = {
  Monday: [
    { subject: "Algorithms (CS3501)", code: "CS3501", faculty: "Dr. Priya", room: "Hall 302" },
    { subject: "Operating Systems (CS3502)", code: "CS3502", faculty: "Prof. Suresh", room: "Hall 302" },
    { subject: "DBMS (CS3503)", code: "CS3503", faculty: "Dr. Ananya", room: "Hall 302" },
    { subject: "Artificial Intelligence (CS3504)", code: "CS3504", faculty: "Dr. Ramesh", room: "Hall 302" },
    { subject: "Algorithms Lab", code: "CS3511", faculty: "Dr. Priya", room: "Lab 4" },
    { subject: "Algorithms Lab", code: "CS3511", faculty: "Dr. Priya", room: "Lab 4" },
  ],
  Tuesday: [
    { subject: "DBMS (CS3503)", code: "CS3503", faculty: "Dr. Ananya", room: "Hall 302" },
    { subject: "Algorithms (CS3501)", code: "CS3501", faculty: "Dr. Priya", room: "Hall 302" },
    { subject: "Operating Systems (CS3502)", code: "CS3502", faculty: "Prof. Suresh", room: "Hall 302" },
    { subject: "Library / Mentorship", code: "LIB", faculty: "All Mentors", room: "Library" },
    { subject: "DBMS Lab", code: "CS3512", faculty: "Dr. Ananya", room: "Lab 2" },
    { subject: "DBMS Lab", code: "CS3512", faculty: "Dr. Ananya", room: "Lab 2" },
  ],
  Wednesday: [
    { subject: "Artificial Intelligence (CS3504)", code: "CS3504", faculty: "Dr. Ramesh", room: "Hall 302" },
    { subject: "Algorithms (CS3501)", code: "CS3501", faculty: "Dr. Priya", room: "Hall 302" },
    { subject: "Operating Systems (CS3502)", code: "CS3502", faculty: "Prof. Suresh", room: "Hall 302" },
    { subject: "DBMS (CS3503)", code: "CS3503", faculty: "Dr. Ananya", room: "Hall 302" },
    { subject: "Technical Seminar", code: "SEM", faculty: "Dr. Ramesh", room: "Seminar Hall" },
    { subject: "Sports / Extra-Curricular", code: "SPT", faculty: "Physical Dir", room: "Sports Ground" },
  ],
  Thursday: [
    { subject: "Operating Systems (CS3502)", code: "CS3502", faculty: "Prof. Suresh", room: "Hall 302" },
    { subject: "Artificial Intelligence (CS3504)", code: "CS3504", faculty: "Dr. Ramesh", room: "Hall 302" },
    { subject: "Algorithms (CS3501)", code: "CS3501", faculty: "Dr. Priya", room: "Hall 302" },
    { subject: "DBMS (CS3503)", code: "CS3503", faculty: "Dr. Ananya", room: "Hall 302" },
    { subject: "Web Programming Elective", code: "CS3505", faculty: "Prof. Rajesh", room: "Hall 302" },
    { subject: "Aptitude & Soft Skills", code: "APT", faculty: "Placement Cell", room: "Hall 302" },
  ],
  Friday: [
    { subject: "Algorithms (CS3501)", code: "CS3501", faculty: "Dr. Priya", room: "Hall 302" },
    { subject: "DBMS (CS3503)", code: "CS3503", faculty: "Dr. Ananya", room: "Hall 302" },
    { subject: "Operating Systems (CS3502)", code: "CS3502", faculty: "Prof. Suresh", room: "Hall 302" },
    { subject: "Artificial Intelligence (CS3504)", code: "CS3504", faculty: "Dr. Ramesh", room: "Hall 302" },
    { subject: "Project Work Review", code: "PROJ", faculty: "All Faculty", room: "Project Labs" },
    { subject: "Project Work Review", code: "PROJ", faculty: "All Faculty", room: "Project Labs" },
  ],
};

export default function HODTimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedSection, setSelectedSection] = useState("CSE-A");

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Department Master Timetable"
          subtitle="Class schedules, hall allocation, and zero-conflict laboratory rosters"
        />
        <div className="flex items-center gap-3">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold"
          >
            <option value="CSE-A">Section: CSE-A (3rd Year)</option>
            <option value="CSE-B">Section: CSE-B (3rd Year)</option>
            <option value="CSE-C">Section: CSE-C (3rd Year)</option>
          </select>
        </div>
      </div>

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

      {/* Timetable Period Grid */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/40 flex items-center justify-between">
          <span className="font-bold text-sm text-[var(--foreground)]">Schedule for {selectedDay} ({selectedSection})</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 0 Hall Conflicts
          </span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {(mockTimetable[selectedDay] || []).map((slot, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--muted)]/30 transition-colors">
              <div className="flex items-start sm:items-center gap-4">
                <div className="px-3 py-1.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-mono text-xs font-bold shrink-0 text-center">
                  <p>{periods[idx]?.label}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] font-normal">{periods[idx]?.time}</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{slot.subject}</h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-1">
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary-500" /> {slot.faculty}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> {slot.room}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => alert(`Assigning substitution for ${slot.subject} on ${selectedDay} period ${idx + 1}`)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors"
                >
                  Assign Substitute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
