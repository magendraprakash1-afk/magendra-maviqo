"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { demoFacultyClasses } from "@/lib/demo-data";
import { DataStore, type AssignmentItem } from "@/lib/data-store";
import { FileText, Plus, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FacultyAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => DataStore.getAssignments());
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState(demoFacultyClasses[0].subject);
  const [newDueDate, setNewDueDate] = useState("2026-09-25");
  const [newMarks, setNewMarks] = useState("50");

  useEffect(() => {
    const handleSync = () => {
      setAssignments(DataStore.getAssignments());
    };
    window.addEventListener("maviqo_datastore_change", handleSync);
    return () => window.removeEventListener("maviqo_datastore_change", handleSync);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await DataStore.createAssignment({
      title: newTitle,
      subject: newSubject,
      code: "CS3501",
      section: "A",
      dueDate: newDueDate,
      maxMarks: Number(newMarks),
    });
    setShowModal(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Assignments" subtitle="Manage and evaluate student assignments">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </PageHeader>

      <div className="grid gap-4">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-primary-500/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base">{asg.title}</h3>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                        asg.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-gray-500/10 text-[var(--muted-foreground)]"
                      )}
                    >
                      {asg.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {asg.subject} ({asg.code}) • Section {asg.section} • Max Marks: {asg.maxMarks}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Due: {asg.dueDate}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-primary-500">
                      Submissions: {asg.totalSubmissions}/60
                    </span>
                    <span>Graded: {asg.gradedSubmissions}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button className="px-3.5 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] text-xs font-semibold transition-colors">
                  View Submissions
                </button>
                <button className="px-3.5 py-1.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 text-xs font-semibold transition-colors">
                  Grade Submissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-2xl space-y-4 animate-slide-in-up">
            <h3 className="text-lg font-bold">Create New Assignment</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms Implementation"
                  className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm outline-none"
                >
                  {demoFacultyClasses.map((c) => (
                    <option key={c.id} value={c.subject}>
                      {c.subject} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    required
                    value={newMarks}
                    onChange={(e) => setNewMarks(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--muted)] text-sm font-medium hover:bg-[var(--border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 shadow-lg shadow-primary-500/25"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
