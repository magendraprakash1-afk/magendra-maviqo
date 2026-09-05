"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { demoFacultyClasses } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Hash,
  Search,
  UserPlus,
  ListFilter,
  Sparkles,
  Info,
} from "lucide-react";
import { DataStore } from "@/lib/data-store";

interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  status: "present" | "absent" | "late";
}

const initialStudents: StudentRecord[] = [
  { id: "s1", rollNo: "22CSE101", name: "Karthik Raj", status: "present" },
  { id: "s2", rollNo: "22CSE102", name: "Ananya Sharma", status: "present" },
  { id: "s3", rollNo: "22CSE103", name: "Bala Murugan", status: "present" },
  { id: "s4", rollNo: "22CSE104", name: "Deepa Lakshmi", status: "absent" },
  { id: "s5", rollNo: "22CSE105", name: "Gokul Nath", status: "present" },
  { id: "s6", rollNo: "22CSE106", name: "Harini S", status: "present" },
  { id: "s7", rollNo: "22CSE107", name: "Ishwarya R", status: "late" },
  { id: "s8", rollNo: "22CSE108", name: "Jagan Mohan", status: "present" },
  { id: "s9", rollNo: "22CSE109", name: "Keerthi Vasan", status: "present" },
  { id: "s10", rollNo: "22CSE110", name: "Lavanya P", status: "present" },
];

export default function FacultyAttendancePage() {
  const [selectedClass, setSelectedClass] = useState(demoFacultyClasses[0].id);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [period, setPeriod] = useState("1");
  const [topic, setTopic] = useState("Dynamic Programming - 0/1 Knapsack Problem");
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Roll Number Direct Actions
  const [quickRollNo, setQuickRollNo] = useState("");
  const [rollFeedback, setRollFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Batch Absent Input
  const [batchAbsentees, setBatchAbsentees] = useState("");
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Add Unlisted Student
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newRollNo, setNewRollNo] = useState("");
  const [newName, setNewName] = useState("");

  // Table Search Filter
  const [searchQuery, setSearchQuery] = useState("");

  const setAllStatus = (status: "present" | "absent") => {
    setStudents(students.map((s) => ({ ...s, status })));
    setSaved(false);
  };

  const toggleStatus = (id: string, status: "present" | "absent" | "late") => {
    setStudents(students.map((s) => (s.id === id ? { ...s, status } : s)));
    setSaved(false);
  };

  // Mark single student by Roll No
  const handleMarkByRollNo = (status: "present" | "absent" | "late") => {
    if (!quickRollNo.trim()) return;

    const trimmed = quickRollNo.trim().toUpperCase();
    const index = students.findIndex((s) => s.rollNo.toUpperCase() === trimmed);

    if (index === -1) {
      setRollFeedback({
        type: "error",
        message: `Roll No "${trimmed}" not found in current class roster. Use "Add Student" below if needed.`,
      });
      return;
    }

    const updated = [...students];
    updated[index].status = status;
    setStudents(updated);
    setSaved(false);
    setRollFeedback({
      type: "success",
      message: `Marked ${updated[index].rollNo} (${updated[index].name}) as ${status.toUpperCase()}!`,
    });
    setQuickRollNo("");
    setTimeout(() => setRollFeedback(null), 4000);
  };

  // Process Batch Absentees by Roll No
  const handleApplyBatchAbsentees = () => {
    if (!batchAbsentees.trim()) return;

    const rollList = batchAbsentees
      .split(/[,\s\n]+/)
      .map((r) => r.trim().toUpperCase())
      .filter((r) => r.length > 0);

    let matchCount = 0;
    const updated = students.map((s) => {
      if (rollList.includes(s.rollNo.toUpperCase())) {
        matchCount++;
        return { ...s, status: "absent" as const };
      }
      return s;
    });

    setStudents(updated);
    setSaved(false);
    setBatchAbsentees("");
    setShowBatchModal(false);
    setRollFeedback({
      type: "success",
      message: `Successfully marked ${matchCount} student(s) as Absent from roll list!`,
    });
    setTimeout(() => setRollFeedback(null), 4500);
  };

  // Add new student by roll no
  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRollNo.trim() || !newName.trim()) return;

    const cleanRoll = newRollNo.trim().toUpperCase();
    if (students.some((s) => s.rollNo.toUpperCase() === cleanRoll)) {
      setRollFeedback({ type: "error", message: `Roll No "${cleanRoll}" already exists in roster.` });
      return;
    }

    const newEntry: StudentRecord = {
      id: `s_${Date.now()}`,
      rollNo: cleanRoll,
      name: newName.trim(),
      status: "present",
    };

    setStudents([...students, newEntry]);
    setNewRollNo("");
    setNewName("");
    setShowAddStudent(false);
    setRollFeedback({
      type: "success",
      message: `Added ${cleanRoll} (${newEntry.name}) to class roster as PRESENT!`,
    });
    setTimeout(() => setRollFeedback(null), 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const cls = demoFacultyClasses.find((c) => c.id === selectedClass);
    await DataStore.recordAttendanceSession({
      classId: selectedClass,
      subject: cls?.subject || "Design & Analysis of Algorithms",
      date,
      period: Number(period),
      topic,
      records: students,
    });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const lateCount = students.filter((s) => s.status === "late").length;
  const percent = Math.round((presentCount / students.length) * 100);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Faculty Attendance System"
        subtitle="Mark, verify, and register student attendance by Roll Number"
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Session</span>
        </button>
      </PageHeader>

      {saved && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 animate-slide-in-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium">Attendance successfully recorded for {date} (Period {period})!</p>
        </div>
      )}

      {/* Class & Session Controls */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
            Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm font-medium outline-none"
          >
            {demoFacultyClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subject} ({c.code} - Sec {c.section})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm font-medium outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
            Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm font-medium outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((p) => (
              <option key={p} value={p}>
                Period {p} (0{8 + p}:30 - 0{9 + p}:30)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
            Topic Covered
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Graph Algorithms"
            className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* SPECIAL FEATURE: ATTENDANCE BY ROLL NUMBER TOOLBAR */}
      <div className="p-5 rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/5 via-[var(--card)] to-accent-500/5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)]">
              <Hash className="w-4 h-4 text-primary-500" />
              <span>Mark Attendance by Student Roll Number</span>
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Type or scan a roll number to mark attendance instantly, or paste a list of absent roll numbers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBatchModal(!showBatchModal)}
              className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ListFilter className="w-3.5 h-3.5 text-rose-500" />
              <span>Batch Absent List</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-primary-500" />
              <span>Add Unlisted Student</span>
            </button>
          </div>
        </div>

        {/* Single Roll Number Input */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Enter Student Roll No (e.g. 22CSE104)..."
              value={quickRollNo}
              onChange={(e) => setQuickRollNo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleMarkByRollNo("present");
                }
              }}
              className="w-full h-11 pl-9 pr-3 rounded-xl bg-[var(--card)] border border-[var(--border)] focus:border-primary-500 text-xs font-mono font-semibold uppercase outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkByRollNo("present")}
              className="px-3.5 h-11 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-sm"
            >
              Mark Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkByRollNo("absent")}
              className="px-3.5 h-11 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors shadow-sm"
            >
              Mark Absent
            </button>
            <button
              type="button"
              onClick={() => handleMarkByRollNo("late")}
              className="px-3.5 h-11 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-sm"
            >
              Mark Late
            </button>
          </div>
        </div>

        {/* Roll Action Feedback Banner */}
        {rollFeedback && (
          <div
            className={cn(
              "p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in",
              rollFeedback.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
            )}
          >
            {rollFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{rollFeedback.message}</span>
          </div>
        )}

        {/* Batch Absent Modal / Drawer */}
        {showBatchModal && (
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <ListFilter className="w-4 h-4 text-rose-500" />
                <span>Quick Batch Absentees Entry</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ✕ Cancel
              </button>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Paste or type roll numbers separated by commas or spaces. All listed roll numbers will be marked Absent.
            </p>
            <textarea
              rows={2}
              placeholder="e.g. 22CSE104, 22CSE107, 22CSE110"
              value={batchAbsentees}
              onChange={(e) => setBatchAbsentees(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs font-mono uppercase outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleApplyBatchAbsentees}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Apply Absent Status to Roll Numbers
              </button>
            </div>
          </div>
        )}

        {/* Add Student to Roster Form */}
        {showAddStudent && (
          <form
            onSubmit={handleAddNewStudent}
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-primary-500" />
                <span>Enroll Unlisted Student by Roll Number</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddStudent(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ✕ Cancel
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 22CSE111"
                  value={newRollNo}
                  onChange={(e) => setNewRollNo(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--muted)] text-xs font-mono uppercase outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-[var(--muted-foreground)] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manisha Krishnan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--muted)] text-xs outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Add Student & Mark Present
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Summary Chips & Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border)]">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-emerald-500 font-bold">Present: {presentCount}</span>
          <span className="text-rose-500 font-bold">Absent: {absentCount}</span>
          <span className="text-amber-500 font-bold">Late: {lateCount}</span>
          <span className="text-primary-500 font-bold">Rate: {percent}%</span>
          <span className="text-xs text-[var(--muted-foreground)]">Total: {students.length} students</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAllStatus("present")}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
          >
            All Present
          </button>
          <button
            onClick={() => setAllStatus("absent")}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Live Table Filter */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Filter roster by Roll No or Student Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs outline-none"
          />
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>

      {/* Student List */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] bg-[var(--muted)]/40 text-xs">
                <th className="text-left p-4 font-semibold uppercase tracking-wider">Roll No</th>
                <th className="text-left p-4 font-semibold uppercase tracking-wider">Student Name</th>
                <th className="text-center p-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="text-right p-4 font-semibold uppercase tracking-wider">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-xs text-primary-600 dark:text-primary-400">
                    {student.rollNo}
                  </td>
                  <td className="p-4 font-semibold text-xs text-[var(--foreground)]">{student.name}</td>
                  <td className="p-4 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase inline-flex items-center gap-1",
                        student.status === "present" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                        student.status === "absent" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
                        student.status === "late" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      )}
                    >
                      {student.status === "present" && "✓"}
                      {student.status === "absent" && "✗"}
                      {student.status === "late" && "⏱"}
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        title="Mark Present"
                        onClick={() => toggleStatus(student.id, "present")}
                        className={cn(
                          "w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                          student.status === "present"
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-[var(--muted)] hover:bg-emerald-500/20 text-[var(--foreground)]"
                        )}
                      >
                        P
                      </button>
                      <button
                        title="Mark Absent"
                        onClick={() => toggleStatus(student.id, "absent")}
                        className={cn(
                          "w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                          student.status === "absent"
                            ? "bg-rose-500 text-white shadow-sm"
                            : "bg-[var(--muted)] hover:bg-rose-500/20 text-[var(--foreground)]"
                        )}
                      >
                        A
                      </button>
                      <button
                        title="Mark Late"
                        onClick={() => toggleStatus(student.id, "late")}
                        className={cn(
                          "w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                          student.status === "late"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "bg-[var(--muted)] hover:bg-amber-500/20 text-[var(--foreground)]"
                        )}
                      >
                        L
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
