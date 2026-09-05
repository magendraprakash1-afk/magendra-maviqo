"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { BookOpen, Plus, Users, Award, CheckCircle2, Search, Building2 } from "lucide-react";

interface ProgramItem {
  id: string;
  code: string;
  name: string;
  department: string;
  degree: "B.E." | "B.Tech" | "M.Tech" | "MBA";
  durationYears: number;
  approvedIntake: number;
  enrolledStudents: number;
  status: "Active" | "NBA Accredited";
}

const initialPrograms: ProgramItem[] = [
  { id: "prg_1", code: "UG-CSE", name: "Computer Science and Engineering", department: "Computer Science", degree: "B.E.", durationYears: 4, approvedIntake: 180, enrolledStudents: 178, status: "NBA Accredited" },
  { id: "prg_2", code: "UG-AIDS", name: "Artificial Intelligence and Data Science", department: "Artificial Intelligence", degree: "B.Tech", durationYears: 4, approvedIntake: 120, enrolledStudents: 120, status: "NBA Accredited" },
  { id: "prg_3", code: "UG-ECE", name: "Electronics and Communication Engineering", department: "Electronics", degree: "B.E.", durationYears: 4, approvedIntake: 120, enrolledStudents: 114, status: "NBA Accredited" },
  { id: "prg_4", code: "UG-MECH", name: "Mechanical Engineering", department: "Mechanical", degree: "B.E.", durationYears: 4, approvedIntake: 60, enrolledStudents: 52, status: "Active" },
  { id: "prg_5", code: "PG-CSE", name: "M.Tech Computer Science (Data Systems)", department: "Computer Science", degree: "M.Tech", durationYears: 2, approvedIntake: 30, enrolledStudents: 28, status: "Active" },
  { id: "prg_6", code: "PG-MBA", name: "Master of Business Administration", department: "Management Studies", degree: "MBA", durationYears: 2, approvedIntake: 60, enrolledStudents: 60, status: "Active" },
];

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>(initialPrograms);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [dept, setDept] = useState("Computer Science");
  const [intake, setIntake] = useState("60");
  const [toast, setToast] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrg: ProgramItem = {
      id: `prg_${Date.now()}`,
      code,
      name,
      department: dept,
      degree: "B.E.",
      durationYears: 4,
      approvedIntake: Number(intake),
      enrolledStudents: 0,
      status: "Active",
    };
    setPrograms([...programs, newPrg]);
    setShowAddModal(false);
    setToast(`Academic Program "${name}" created successfully.`);
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Degree Programs & Academic Offerings"
          subtitle="AICTE/UGC approved programs, intake capacity, and enrollment quotas"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
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
        <StatCard title="Total Programs" value={programs.length.toString()} icon={BookOpen} color="blue" />
        <StatCard title="Approved Intake" value={programs.reduce((s, p) => s + p.approvedIntake, 0).toString()} icon={Users} color="purple" />
        <StatCard title="Total Enrolled" value={programs.reduce((s, p) => s + p.enrolledStudents, 0).toString()} icon={CheckCircle2} color="emerald" />
        <StatCard title="NBA Accredited" value={programs.filter(p => p.status === "NBA Accredited").length.toString()} icon={Award} color="amber" />
      </div>

      {/* Programs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prg) => (
          <div
            key={prg.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded bg-primary-500/10">
                  {prg.code}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {prg.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-[var(--foreground)] mt-3">{prg.name}</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{prg.degree} • {prg.durationYears} Years Full Time</p>

              <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2 text-xs text-[var(--muted-foreground)]">
                <div className="flex items-center justify-between">
                  <span>Department:</span>
                  <strong className="text-[var(--foreground)]">{prg.department}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Approved Intake:</span>
                  <strong className="text-[var(--foreground)]">{prg.approvedIntake} Seats</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enrolled:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{prg.enrolledStudents} Students</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="w-full">
                <div className="flex justify-between text-[11px] font-semibold mb-1 text-[var(--muted-foreground)]">
                  <span>Occupancy</span>
                  <span>{Math.round((prg.enrolledStudents / prg.approvedIntake) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${(prg.enrolledStudents / prg.approvedIntake) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Add Degree Program</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Program Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Cybersecurity & Privacy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="UG-CYBER"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Approved Seats</label>
                  <input
                    type="number"
                    required
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
