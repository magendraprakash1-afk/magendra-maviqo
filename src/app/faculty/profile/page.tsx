"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import PageHeader from "@/components/shared/PageHeader";
import { getInitials } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Clock,
  FileText,
  CheckCircle2,
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  Share2,
} from "lucide-react";
import { useState } from "react";

export default function FacultyProfilePage() {
  const { user } = useAuth();
  const [toast, setToast] = useState<string | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setToast("Faculty dossier & office hours updated successfully.");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Faculty Profile & Dossier"
        subtitle="Academic credentials, courses taught, research specializations, and office hours"
      />

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-primary-500/25 shrink-0">
            {getInitials(user?.name || "Dr. Priya Lakshmi")}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">{user?.name || "Dr. Priya Lakshmi"}</h2>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                  {user?.designation || "Associate Professor"} • {user?.department || "Computer Science & Engineering"}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-primary-500" />
                  <span>{user?.collegeName || "Sri Maviqo Engineering College"}</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-mono font-bold self-center sm:self-auto">
                ID: {user?.employeeId || "FAC2024001"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary-500" />
                {user?.email || "priya@maviqo.edu"}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                {user?.phone || "+91 98765 43210"}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {user?.cabin || "Cabin 402, CS Tech Park"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Load & Allocated Courses */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            <span>Currently Allocated Courses & Teaching Workload (Odd Sem 2026)</span>
          </h3>
          <span className="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 text-xs font-bold">
            14 Teaching Hours / Week
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">CS3301</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600">Theory</span>
            </div>
            <p className="text-xs font-bold text-[var(--foreground)]">Data Structures</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">3rd Year • Section A & B • 120 Students</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">CS3501</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600">Theory</span>
            </div>
            <p className="text-xs font-bold text-[var(--foreground)]">Algorithm Design & Analysis</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">4th Year • Section A • 45 Students</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">CS3311</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600">Lab</span>
            </div>
            <p className="text-xs font-bold text-[var(--foreground)]">Data Structures Laboratory</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">Lab 1 • Batch 1 & 2 • 62 Students</p>
          </div>
        </div>
      </div>

      {/* Qualifications, Research & Office Hours */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Academic Qualifications & Specializations</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <p className="font-bold text-[var(--foreground)]">Ph.D. in Computer Science (Distributed Systems)</p>
              <p className="text-[var(--muted-foreground)]">Indian Institute of Technology, Madras (2018)</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <p className="font-bold text-[var(--foreground)]">M.Tech in Software Engineering (Gold Medalist)</p>
              <p className="text-[var(--muted-foreground)]">National Institute of Technology, Trichy (2012)</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <p className="font-bold text-[var(--foreground)]">Research Areas & Citations</p>
              <p className="text-[var(--muted-foreground)]">
                18 Scopus Publications • 420 Citations • h-index: 12 • Distributed Cloud & Edge AI
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>Office Hours & Mentorship Appointments</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">Monday & Wednesday</p>
                <p className="text-[var(--muted-foreground)]">03:30 PM - 05:00 PM (Cabin 402)</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-semibold text-[11px]">
                Student Consultation
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">Friday (Research Lab)</p>
                <p className="text-[var(--muted-foreground)]">02:00 PM - 04:00 PM</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 font-semibold text-[11px]">
                Final Year Project Reviews
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <p className="font-bold text-[var(--foreground)]">Departmental Responsibilities</p>
              <p className="text-[var(--muted-foreground)]">
                NBA Accreditation Coordinator • Class Advisor (3rd Year CSE-A) • ACM Student Chapter Mentor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
