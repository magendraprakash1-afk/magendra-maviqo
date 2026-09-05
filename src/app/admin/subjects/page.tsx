"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { BookOpen, Plus, Search, CheckCircle2, Award, Layers } from "lucide-react";

interface SubjectDirectoryItem {
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  lectureHours: number;
  labHours: number;
  type: "Core" | "Elective" | "Practical" | "Value-Added";
}

const campusSubjects: SubjectDirectoryItem[] = [
  { code: "CS3501", name: "Design and Analysis of Algorithms", department: "Computer Science", semester: 5, credits: 4, lectureHours: 3, labHours: 2, type: "Core" },
  { code: "CS3502", name: "Operating Systems", department: "Computer Science", semester: 5, credits: 3, lectureHours: 3, labHours: 0, type: "Core" },
  { code: "CS3503", name: "Database Management Systems", department: "Computer Science", semester: 5, credits: 3, lectureHours: 3, labHours: 0, type: "Core" },
  { code: "CS3504", name: "Artificial Intelligence", department: "Computer Science", semester: 5, credits: 3, lectureHours: 3, labHours: 0, type: "Elective" },
  { code: "EC3401", name: "Digital Signal Processing", department: "Electronics", semester: 4, credits: 4, lectureHours: 3, labHours: 2, type: "Core" },
  { code: "ME3302", name: "Thermodynamics & Heat Transfer", department: "Mechanical", semester: 3, credits: 4, lectureHours: 4, labHours: 0, type: "Core" },
  { code: "CS3511", name: "Algorithms Laboratory", department: "Computer Science", semester: 5, credits: 2, lectureHours: 0, labHours: 4, type: "Practical" },
  { code: "GE3151", name: "Problem Solving and Python", department: "Science & Humanities", semester: 1, credits: 3, lectureHours: 3, labHours: 0, type: "Core" },
];

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectDirectoryItem[]>(campusSubjects);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const filtered = subjects.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === "All" || s.department === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Master Course & Subject Directory"
          subtitle="Campus-wide curriculum catalog, credit structures, and university syllabus codes"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Science & Humanities">Science & Humanities</option>
          </select>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search course code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Catalog Courses" value={subjects.length.toString()} icon={BookOpen} color="blue" />
        <StatCard title="Core Subjects" value={subjects.filter(s => s.type === "Core").length.toString()} icon={Layers} color="purple" />
        <StatCard title="Electives" value={subjects.filter(s => s.type === "Elective").length.toString()} icon={Award} color="emerald" />
        <StatCard title="Lab Practicals" value={subjects.filter(s => s.type === "Practical").length.toString()} icon={CheckCircle2} color="amber" />
      </div>

      {/* Subjects Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--muted)]/50 border-b border-[var(--border)] font-semibold text-[var(--muted-foreground)] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Course Title</th>
                <th className="p-4">Code</th>
                <th className="p-4">Department</th>
                <th className="p-4">Sem</th>
                <th className="p-4">Type</th>
                <th className="p-4">Credits</th>
                <th className="p-4">L-T-P Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((s) => (
                <tr key={s.code} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="p-4 font-bold text-sm text-[var(--foreground)]">{s.name}</td>
                  <td className="p-4 font-mono font-bold text-primary-600 dark:text-primary-400">{s.code}</td>
                  <td className="p-4 font-semibold text-[var(--foreground)]">{s.department}</td>
                  <td className="p-4 font-semibold">{s.semester}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--foreground)] font-medium text-[10px]">
                      {s.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{s.credits}</td>
                  <td className="p-4 font-mono text-[var(--muted-foreground)]">{s.lectureHours}-0-{s.labHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
