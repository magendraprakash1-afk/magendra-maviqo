"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Settings, Shield, Database, Bell, CheckCircle2, Save, Key, Globe, Building2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [collegeName, setCollegeName] = useState("Maviqo Institute of Technology");
  const [collegeCode, setCollegeCode] = useState("MIT-3104");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [currentTerm, setCurrentTerm] = useState("Odd Semester (July - Dec)");
  const [gradingScale, setGradingScale] = useState("10-Point Relative Grading (UGC)");
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast("System and institutional settings updated successfully.");
    setTimeout(() => setToast(null), 4000);
  };

  const supabaseActive = isSupabaseConfigured();

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Institutional & System Settings"
          subtitle="Configure academic term parameters, institutional metadata, and cloud integrations"
        />
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: General Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Building2 className="w-4 h-4 text-primary-500" />
              <span>Institutional Identity</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Institution Name</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] font-medium"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Institutional Code / Affiliation</label>
                <input
                  type="text"
                  value={collegeCode}
                  onChange={(e) => setCollegeCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] font-medium"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Active Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] font-medium"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Current Academic Term</label>
                <input
                  type="text"
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] font-medium"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Academic Regulations & Grading Standard</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Grading Scale</label>
                <select
                  value={gradingScale}
                  onChange={(e) => setGradingScale(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] font-medium"
                >
                  <option>10-Point Relative Grading (UGC)</option>
                  <option>10-Point Absolute Scale (Anna University)</option>
                  <option>4-Point Scale (US Equivalent)</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--muted)]/40">
                <div>
                  <p className="font-bold text-[var(--foreground)]">Minimum Attendance for Exam Eligibility</p>
                  <p className="text-[var(--muted-foreground)]">Students with &lt;75% required to seek condonation permission</p>
                </div>
                <span className="font-bold text-sm text-primary-600 dark:text-primary-400">75% Mandatory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Integrations & Cloud Health */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Database className="w-4 h-4 text-primary-500" />
              <span>Database & Cloud Backend</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)]/40">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">PostgreSQL (Supabase)</p>
                  <p className="text-[var(--muted-foreground)]">
                    {supabaseActive ? "Active live database connection" : "Local DataStore with active schema migrations"}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  supabaseActive
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                }`}>
                  {supabaseActive ? "Connected" : "Local Sync"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)]/40">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Mobile Capacitor Engine</p>
                  <p className="text-[var(--muted-foreground)]">Android & iOS Native Shell Bridge</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  Ready (v7.0)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)]/40">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">AI Assistant (Gemini 2.5)</p>
                  <p className="text-[var(--muted-foreground)]">Natural language tutoring & insights</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
