"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { demoStudentSubjects } from "@/lib/demo-data";
import { BookOpen, UserCheck, Plus, CheckCircle2, Search, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartmentSubject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  facultyAssigned: string;
  syllabusCovered: number;
  totalHours: number;
  type: "Core Theory" | "Practical Lab" | "Professional Elective";
}

const initialDeptSubjects: DepartmentSubject[] = [
  { code: "CS3501", name: "Design & Analysis of Algorithms", credits: 4, semester: 5, facultyAssigned: "Dr. Priya Sharma", syllabusCovered: 65, totalHours: 45, type: "Core Theory" },
  { code: "CS3502", name: "Operating Systems", credits: 3, semester: 5, facultyAssigned: "Prof. Suresh Kumar", syllabusCovered: 58, totalHours: 45, type: "Core Theory" },
  { code: "CS3503", name: "Database Management Systems", credits: 3, semester: 5, facultyAssigned: "Dr. Ananya Ray", syllabusCovered: 70, totalHours: 45, type: "Core Theory" },
  { code: "CS3504", name: "Artificial Intelligence", credits: 3, semester: 5, facultyAssigned: "Dr. Ramesh Kumar", syllabusCovered: 60, totalHours: 45, type: "Professional Elective" },
  { code: "CS3511", name: "Algorithms Laboratory", credits: 2, semester: 5, facultyAssigned: "Dr. Priya Sharma", syllabusCovered: 75, totalHours: 30, type: "Practical Lab" },
  { code: "CS3512", name: "DBMS Laboratory", credits: 2, semester: 5, facultyAssigned: "Dr. Ananya Ray", syllabusCovered: 68, totalHours: 30, type: "Practical Lab" },
];

export default function HODSubjectsPage() {
  const [subjects, setSubjects] = useState<DepartmentSubject[]>(initialDeptSubjects);
  const [search, setSearch] = useState("");
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedSubCode, setSelectedSubCode] = useState("CS3501");
  const [selectedFaculty, setSelectedFaculty] = useState("Dr. Priya Sharma");
  const [toast, setToast] = useState<string | null>(null);

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubjects(subjects.map((s) => s.code === selectedSubCode ? { ...s, facultyAssigned: selectedFaculty } : s));
    setShowAllocateModal(false);
    setToast(`Subject ${selectedSubCode} reallocated to ${selectedFaculty} for Semester 5.`);
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.facultyAssigned.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Curriculum & Faculty Subject Allocation"
          subtitle="Department course catalog, credits allocation, and syllabus progress tracking"
        />
        <button
          onClick={() => setShowAllocateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Faculty</span>
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
        <StatCard title="Active Courses" value={subjects.length.toString()} icon={BookOpen} color="blue" />
        <StatCard title="Total Credits" value="17 Credits" icon={Award} color="purple" />
        <StatCard title="Faculty Assigned" value="100%" icon={UserCheck} color="emerald" />
        <StatCard title="Avg Syllabus Covered" value="66%" icon={CheckCircle2} color="amber" />
      </div>

      {/* Subjects Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--muted)]/50 border-b border-[var(--border)] font-semibold text-[var(--muted-foreground)] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Faculty In Charge</th>
                <th className="p-4">Syllabus Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((s) => (
                <tr key={s.code} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm text-[var(--foreground)]">{s.name}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Semester {s.semester} • {s.totalHours} Lecture Hours</p>
                  </td>
                  <td className="p-4 font-mono font-bold text-primary-600 dark:text-primary-400">{s.code}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--foreground)] font-medium text-[10px]">
                      {s.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold">{s.credits}</td>
                  <td className="p-4 font-semibold text-[var(--foreground)]">{s.facultyAssigned}</td>
                  <td className="p-4">
                    <div className="space-y-1 w-32">
                      <div className="flex justify-between text-[10px] font-semibold">
                        <span>{s.syllabusCovered}%</span>
                        <span className="text-[var(--muted-foreground)]">On Track</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${s.syllabusCovered}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Assign Course Faculty</h3>
            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Select Course</label>
                <select
                  value={selectedSubCode}
                  onChange={(e) => setSelectedSubCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs"
                >
                  {subjects.map((s) => (
                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Select Faculty Member</label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs"
                >
                  <option>Dr. Priya Sharma</option>
                  <option>Prof. Suresh Kumar</option>
                  <option>Dr. Ananya Ray</option>
                  <option>Dr. Ramesh Kumar</option>
                  <option>Prof. Rajesh Varma</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
