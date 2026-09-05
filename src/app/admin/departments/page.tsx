"use client";

import PageHeader from "@/components/shared/PageHeader";
import { demoDepartments } from "@/lib/demo-data";
import { Building2, Plus, Users, GraduationCap, BookOpen } from "lucide-react";

export default function AdminDepartmentsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Departments" subtitle="Academic departments, faculty allocations, and student statistics">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </PageHeader>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoDepartments.map((d) => (
          <div
            key={d.id}
            className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-primary-500/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--muted)]">
                {d.code}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-lg">{d.name}</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Head of Dept: {d.hod}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border)] text-center">
              <div className="p-2 rounded-xl bg-[var(--muted)]/40">
                <p className="text-sm font-bold text-primary-500">{d.programs}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Programs</p>
              </div>
              <div className="p-2 rounded-xl bg-[var(--muted)]/40">
                <p className="text-sm font-bold text-violet-500">{d.faculty}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Faculty</p>
              </div>
              <div className="p-2 rounded-xl bg-[var(--muted)]/40">
                <p className="text-sm font-bold text-emerald-500">{d.students}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Students</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
