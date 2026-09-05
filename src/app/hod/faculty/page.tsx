"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Users, Mail, Phone, BookOpen, Award } from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  phone: string;
  workloadHours: number;
  subjectsCount: number;
}

const facultyList: FacultyMember[] = [
  {
    id: "f1",
    name: "Dr. Priya Lakshmi",
    designation: "Associate Professor",
    qualification: "Ph.D in AI & Algorithms",
    specialization: "Machine Learning, Graph Theory",
    email: "priya@maviqo.edu",
    phone: "+91 98450 12345",
    workloadHours: 16,
    subjectsCount: 2,
  },
  {
    id: "f2",
    name: "Prof. Suresh K",
    designation: "Assistant Professor",
    qualification: "M.Tech in Operating Systems",
    specialization: "Distributed Systems, Cloud Architecture",
    email: "suresh@maviqo.edu",
    phone: "+91 98450 23456",
    workloadHours: 18,
    subjectsCount: 2,
  },
  {
    id: "f3",
    name: "Dr. Meenakshi S",
    designation: "Professor",
    qualification: "Ph.D in Database Systems",
    specialization: "Distributed Databases, Big Data",
    email: "meenakshi@maviqo.edu",
    phone: "+91 98450 34567",
    workloadHours: 14,
    subjectsCount: 2,
  },
  {
    id: "f4",
    name: "Prof. Rajesh V",
    designation: "Assistant Professor",
    qualification: "M.Tech in Network Security",
    specialization: "Cybersecurity, Cryptography",
    email: "rajesh@maviqo.edu",
    phone: "+91 98450 45678",
    workloadHours: 20,
    subjectsCount: 3,
  },
];

export default function HODFacultyPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Department Faculty" subtitle="Faculty roster, designations, and teaching workloads" />

      <div className="grid md:grid-cols-2 gap-6">
        {facultyList.map((f) => (
          <div
            key={f.id}
            className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-primary-500/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{f.name}</h3>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{f.designation}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{f.qualification}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--muted)]/50 text-xs space-y-1">
              <p className="font-medium text-[var(--foreground)]">Specialization:</p>
              <p className="text-[var(--muted-foreground)]">{f.specialization}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)] text-xs">
              <div>
                <span className="text-[var(--muted-foreground)]">Weekly Workload</span>
                <p className="text-sm font-bold text-[var(--foreground)] mt-0.5">{f.workloadHours} Hours</p>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Assigned Subjects</span>
                <p className="text-sm font-bold text-[var(--foreground)] mt-0.5">{f.subjectsCount} Subjects</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {f.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {f.phone}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
