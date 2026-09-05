"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import PageHeader from "@/components/shared/PageHeader";
import { getInitials } from "@/lib/utils";
import { User, Mail, Phone, MapPin, Award, ShieldCheck, Building2, Landmark } from "lucide-react";

export default function ManagementProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Board of Management & Trustee Profile"
        subtitle="Governing board credentials, executive committee roles, and institutional oversight"
      />

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
            {getInitials(user?.name || "Dr. Rajesh Gupta")}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">{user?.name || "Dr. Rajesh Gupta"}</h2>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  Managing Trustee & Member of the Governing Council • Maviqo Educational Trust
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-semibold self-center sm:self-auto flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> Trustee ID: TR-001
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary-500" />
                {user?.email || "rajesh.gupta@maviqo.edu"}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                +91 98400 12345
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Trustee Secretariat, 5th Floor, Tower 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Board Roles & Governance Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            <span>Statutory Committee Appointments</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 space-y-0.5">
              <p className="font-bold text-[var(--foreground)]">Chairman, Finance & Infrastructure Committee</p>
              <p className="text-[var(--muted-foreground)]">Oversees capital projects, endowment funds, and fiscal audits</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 space-y-0.5">
              <p className="font-bold text-[var(--foreground)]">Member, Academic Quality Council</p>
              <p className="text-[var(--muted-foreground)]">Accreditation steering, faculty appointments, and international MOUs</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Institutional Vision & Milestones</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 space-y-0.5">
              <p className="font-bold text-[var(--foreground)]">Vision 2030 Campus Expansion</p>
              <p className="text-[var(--muted-foreground)]">Establishing cutting-edge Quantum Computing & Biomedical Labs</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 space-y-0.5">
              <p className="font-bold text-[var(--foreground)]">Student Merit Scholarship Endowment</p>
              <p className="text-[var(--muted-foreground)]">₹1.5 Crore annual endowment for first-generation graduates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
