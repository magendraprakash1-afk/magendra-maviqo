"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import PageHeader from "@/components/shared/PageHeader";
import { getInitials } from "@/lib/utils";
import { User, Mail, Phone, MapPin, Award, BookOpen, Clock, ShieldCheck, Building2 } from "lucide-react";

export default function HODProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Head of Department Profile"
        subtitle="Department leadership credentials, sponsored research, and academic oversight"
      />

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
            {getInitials(user?.name || "Dr. Ramesh Kumar")}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">{user?.name || "Dr. Ramesh Kumar"}</h2>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  Professor & Head of the Department • Computer Science & Engineering
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 text-xs font-semibold self-center sm:self-auto flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> HOD ID: HOD-CSE-001
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary-500" />
                {user?.email || "hod.cse@maviqo.edu"}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                +91 98765 11223
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                HOD Suite 101, Main Admin Block
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Oversight & Research Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-500" />
            <span>Department Oversight & Administration</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--foreground)]">Faculty Members Supervised</p>
                <p className="text-[var(--muted-foreground)]">Full-time Professors, Assoc & Asst Professors</p>
              </div>
              <span className="font-bold text-base text-primary-600 dark:text-primary-400">28 Faculty</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--foreground)]">Undergraduate & PG Enrolled</p>
                <p className="text-[var(--muted-foreground)]">B.E. CSE, M.Tech Data Science, Ph.D.</p>
              </div>
              <span className="font-bold text-base text-purple-600 dark:text-purple-400">720 Students</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Funded Projects & Patents</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <p className="font-bold text-[var(--foreground)]">DST-SERB Sponsored Research Grant (₹42 Lakhs)</p>
              <p className="text-[var(--muted-foreground)]">"Autonomous Multi-Agent Systems for Disaster Management" (2024-2027)</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <p className="font-bold text-[var(--foreground)]">Published Patent (Indian Patent Office)</p>
              <p className="text-[var(--muted-foreground)]">"Edge-Computing Framework for Smart Campus Energy Optimization"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
