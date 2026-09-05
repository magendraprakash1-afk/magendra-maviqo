"use client";

import PageHeader from "@/components/shared/PageHeader";
import { demoStudentSubjects } from "@/lib/demo-data";
import { BookOpen, FileText, Download, Award, UserCheck, Search } from "lucide-react";
import { useState } from "react";

export default function StudentSubjects() {
  const [search, setSearch] = useState("");

  const filtered = demoStudentSubjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.faculty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Registered Subjects"
          subtitle="Semester 5 courses, syllabus, faculty in charge, and course materials"
        />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search subjects or faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((sub) => (
          <div
            key={sub.code}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 font-mono text-xs font-bold">
                      {sub.code}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {sub.credits} Credits • {sub.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--foreground)] mt-2">
                    {sub.name}
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)]">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <UserCheck className="w-3.5 h-3.5 text-primary-500" />
                  <span>Faculty: <strong className="text-[var(--foreground)]">{sub.faculty}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Internal Assessment: <strong>40%</strong> • End Semester: <strong>60%</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <button
                onClick={() => alert(`Downloading complete syllabus PDF for ${sub.code}: ${sub.name}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors text-[var(--foreground)]"
              >
                <Download className="w-3.5 h-3.5 text-primary-500" />
                <span>Syllabus PDF</span>
              </button>
              <button
                onClick={() => alert(`Accessing LMS lecture notes and slide decks for ${sub.name}`)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lecture Notes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
