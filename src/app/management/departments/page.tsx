"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { Building2, Users, Award, BookOpen, IndianRupee, CheckCircle2 } from "lucide-react";

interface DeptSummary {
  name: string;
  hod: string;
  enrolledStudents: number;
  facultyCount: number;
  phdFacultyCount: number;
  annualBudget: string;
  placementRate: number;
}

const depts: DeptSummary[] = [
  { name: "Computer Science & Engineering", hod: "Dr. Ramesh Kumar", enrolledStudents: 720, facultyCount: 28, phdFacultyCount: 18, annualBudget: "₹2.8 Cr", placementRate: 96.5 },
  { name: "Artificial Intelligence & Data Science", hod: "Dr. Priya Varma", enrolledStudents: 480, facultyCount: 18, phdFacultyCount: 12, annualBudget: "₹2.1 Cr", placementRate: 98.0 },
  { name: "Electronics & Communication Engg", hod: "Dr. K. Venkatesh", enrolledStudents: 480, facultyCount: 22, phdFacultyCount: 14, annualBudget: "₹1.9 Cr", placementRate: 91.2 },
  { name: "Mechanical Engineering", hod: "Dr. S. Mohan", enrolledStudents: 240, facultyCount: 14, phdFacultyCount: 10, annualBudget: "₹1.4 Cr", placementRate: 85.0 },
  { name: "Management Studies (MBA)", hod: "Dr. Geetha Balan", enrolledStudents: 120, facultyCount: 8, phdFacultyCount: 6, annualBudget: "₹0.9 Cr", placementRate: 94.0 },
];

export default function ManagementDepartmentsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Department Portfolios & Faculty Allocation"
        subtitle="Department leadership, student strength, doctoral faculty ratio, and placement ratings"
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Academic Departments" value="5 Departments" icon={Building2} color="blue" />
        <StatCard title="Total Faculty Strength" value="90 Professors" icon={Users} color="purple" />
        <StatCard title="Doctoral (Ph.D.) Faculty" value="66.7%" icon={Award} color="emerald" />
        <StatCard title="Avg Department Budget" value="₹1.82 Cr" icon={IndianRupee} color="amber" />
      </div>

      {/* Departments Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {depts.map((d) => (
          <div
            key={d.name}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="p-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {d.placementRate}% Placement
                </span>
              </div>

              <h3 className="font-bold text-base text-[var(--foreground)] mt-3">{d.name}</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Head of Dept: <strong>{d.hod}</strong></p>

              <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2 text-xs text-[var(--muted-foreground)]">
                <div className="flex items-center justify-between">
                  <span>Student Enrollment:</span>
                  <strong className="text-[var(--foreground)]">{d.enrolledStudents} Students</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Faculty Members:</span>
                  <strong className="text-[var(--foreground)]">{d.facultyCount} ({d.phdFacultyCount} Ph.D.)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Annual Operating Budget:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{d.annualBudget}</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => alert(`Reviewing complete governance dossier for ${d.name}`)}
                className="w-full py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors"
              >
                View Department Audit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
