"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import PageHeader from "@/components/shared/PageHeader";
import { getInitials } from "@/lib/utils";
import { DEFAULT_COLLEGE } from "@/lib/constants";
import {
  User,
  Mail,
  BookOpen,
  Hash,
  Building2,
  Calendar,
  GraduationCap,
  Phone,
  ShieldCheck,
  HeartPulse,
  BookMarked,
  Bus,
  QrCode,
  Award,
  Sparkles,
  CheckCircle2,
  Download,
} from "lucide-react";
import { useState } from "react";

export default function StudentProfile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const academicFields = [
    { icon: Hash, label: "Roll Number", value: user.rollNumber || "22CSE101" },
    { icon: BookOpen, label: "Program", value: user.program || "B.Tech Computer Science & Engineering" },
    { icon: Building2, label: "Department", value: user.department || "Computer Science & Engineering" },
    { icon: Calendar, label: "Batch & Year", value: user.batch || "2022 - 2026 (3rd Year)" },
    { icon: GraduationCap, label: "Semester & Section", value: `Semester ${user.semester || 5} • Section ${user.section || "A"}` },
    { icon: User, label: "Academic Advisor", value: user.advisor || "Dr. Priya Lakshmi (Assoc. Professor)" },
  ];

  const personalFields = [
    { icon: Mail, label: "Institutional Email", value: user.email },
    { icon: Phone, label: "Student Contact Phone", value: user.phone || "+91 98401 23456" },
    { icon: HeartPulse, label: "Blood Group", value: user.bloodGroup || "O+ (Positive)" },
    { icon: BookMarked, label: "Library Card ID", value: user.libraryId || "LIB-2022-101" },
    { icon: Bus, label: "Transportation / Hostel", value: user.hostelStatus || "Day Scholar (College Bus Route #14)" },
    { icon: ShieldCheck, label: "Guardian Contact", value: `${user.guardianName || "Rajesh Raj"} (${user.guardianPhone || "+91 98401 98765"})` },
  ];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(user.rollNumber || "22CSE101");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Student Profile & Identity"
        subtitle="Verified student academic dossier, digital identity, and institutional records"
      />

      {/* Header Profile & Digital ID Card Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Profile Summary Card */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-primary-500/25 shrink-0">
            {getInitials(user.name)}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">{user.name}</h2>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                  {user.program || "B.Tech Computer Science"} • Semester {user.semester || 5}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold self-center sm:self-auto flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled & Active
              </span>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              <Building2 className="w-3.5 h-3.5 text-primary-500" />
              <span className="font-semibold text-[var(--foreground)]">{user.collegeName || DEFAULT_COLLEGE}</span>
            </p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--muted)] text-[11px] font-mono font-bold text-[var(--foreground)]">
                Roll No: {user.rollNumber || "22CSE101"}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--muted)] text-[11px] font-semibold text-[var(--muted-foreground)]">
                CGPA: 8.45 / 10.0
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--muted)] text-[11px] font-semibold text-[var(--muted-foreground)]">
                Attendance: 87.5%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Digital Smart ID Card */}
        <div className="rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-900/90 via-slate-900 to-indigo-950 p-5 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] font-bold tracking-wider uppercase text-white/70">DIGITAL STUDENT ID</p>
                <p className="text-xs font-bold truncate max-w-[180px]">{user.collegeName || "Sri Maviqo Institute"}</p>
              </div>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg font-bold">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-[10px] font-mono text-white/80">{user.rollNumber || "22CSE101"}</p>
                <p className="text-[10px] text-white/60">{user.department || "Computer Science"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-white/80" />
              <div className="text-[9px] font-mono text-white/60">
                <p>VALID THRU: 2026</p>
                <p>AUT-BARCODE: OK</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[10px] font-bold transition-colors"
            >
              {copied ? "Copied!" : "Copy Roll No"}
            </button>
          </div>
        </div>
      </div>

      {/* Academic Details Section */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/40 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary-500" />
            <span>Academic Curriculum & Program Details</span>
          </h3>
          <span className="text-xs text-primary-500 font-semibold">Semester 5 Ongoing</span>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          <div className="divide-y divide-[var(--border)]">
            {academicFields.slice(0, 3).map((f) => (
              <div key={f.label} className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] shrink-0">
                  <f.icon className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">{f.label}</p>
                  <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-[var(--border)]">
            {academicFields.slice(3).map((f) => (
              <div key={f.label} className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] shrink-0">
                  <f.icon className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">{f.label}</p>
                  <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact & Institutional Dossier */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/40 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary-500" />
            <span>Campus, Contact & Emergency Records</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          <div className="divide-y divide-[var(--border)]">
            {personalFields.slice(0, 3).map((f) => (
              <div key={f.label} className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] shrink-0">
                  <f.icon className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">{f.label}</p>
                  <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-[var(--border)]">
            {personalFields.slice(3).map((f) => (
              <div key={f.label} className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] shrink-0">
                  <f.icon className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">{f.label}</p>
                  <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Skills & Certifications */}
      <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Accredited Technical Skills & Badges</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Data Structures & Algorithms (Advanced)",
            "Database Systems & SQL Optimization",
            "Cloud Computing & Edge AI",
            "React & Next.js Full-Stack",
            "Operating Systems & Linux Kernel",
            "ACM ICPC Regional Finalist",
          ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 text-xs font-semibold"
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
