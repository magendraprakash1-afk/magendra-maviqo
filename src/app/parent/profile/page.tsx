"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import PageHeader from "@/components/shared/PageHeader";
import { demoParentChild } from "@/lib/demo-data";
import { getInitials } from "@/lib/utils";
import { User, Mail, Phone, MapPin, Award, Heart, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function ParentProfilePage() {
  const { user } = useAuth();
  const child = demoParentChild;
  const [toast, setToast] = useState<string | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setToast("Guardian profile and emergency contact preferences updated.");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Parent / Guardian Profile"
        subtitle="Registered contact details, emergency notifications, and student linkage"
      />

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 shrink-0">
            {getInitials(user?.name || "Mr. S. Sundararajan")}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">{user?.name || "Mr. S. Sundararajan"}</h2>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Father & Primary Guardian of <strong>{child.name}</strong> ({child.rollNo})</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold self-center sm:self-auto flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Guardian
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary-500" />
                {user?.email || "parent@maviqo.edu"}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                +91 98410 98765
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Chennai, Tamil Nadu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ward Details & Contact Preferences */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Registered Ward Details
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[var(--border)]/50">
              <span className="text-[var(--muted-foreground)]">Student Name:</span>
              <strong className="text-[var(--foreground)]">{child.name}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]/50">
              <span className="text-[var(--muted-foreground)]">Roll Number:</span>
              <strong className="font-mono text-primary-600 dark:text-primary-400">{child.rollNo}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]/50">
              <span className="text-[var(--muted-foreground)]">Program & Department:</span>
              <strong className="text-[var(--foreground)]">B.E. {child.department}</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--muted-foreground)]">Class Section:</span>
              <strong className="text-[var(--foreground)]">Section {child.section} (3rd Year)</strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Emergency Notification Channels
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">SMS Alerts for Attendance</p>
                <p className="text-[var(--muted-foreground)]">Receive alert if ward is absent for period 1</p>
              </div>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">Fee & Examination WhatsApp Updates</p>
                <p className="text-[var(--muted-foreground)]">Official receipts and exam date sheets</p>
              </div>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
