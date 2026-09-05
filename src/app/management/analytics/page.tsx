"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { BarChart3, TrendingUp, Users, Award, IndianRupee, CheckCircle2, ShieldCheck, Globe } from "lucide-react";

export default function ManagementAnalyticsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Executive Strategic Analytics & Board KPIs"
        subtitle="Institutional growth trajectories, accreditation compliance, and multi-year KPIs"
      />

      {/* Strategic Board Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="5-Year Enrollment Growth" value="+24.6%" trend={{ value: "CAGR 5.2%", positive: true }} icon={TrendingUp} color="blue" />
        <StatCard title="Campus Placement Index" value="94.2%" trend={{ value: "Highest ₹44.5L", positive: true }} icon={Award} color="emerald" />
        <StatCard title="Faculty Retention Rate" value="96.5%" icon={CheckCircle2} color="purple" />
        <StatCard title="Annual Research Grants" value="₹4.2 Cr" trend={{ value: "+18% YoY", positive: true }} icon={IndianRupee} color="amber" />
      </div>

      {/* Strategic Initiatives */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Institutional Accreditation & Quality Standards
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">NAAC Grade A++ Accreditation</p>
                <p className="text-[var(--muted-foreground)]">Highest tier autonomous accreditation status</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">CGPA 3.68</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">NBA Tier-1 Global Engineering Washington Accord</p>
                <p className="text-[var(--muted-foreground)]">CSE, AI&DS, ECE accredited for 6 years</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 font-bold">Compliant</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">QS Asia University Ranking Target</p>
                <p className="text-[var(--muted-foreground)]">Scopus indexed citations per faculty: 8.4</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 font-bold">Top 300 Target</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Campus Infrastructure & Capital Projects
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <div className="flex justify-between font-bold">
                <span>AI & Robotics Center of Excellence</span>
                <span className="text-emerald-600 dark:text-emerald-400">90% Completed</span>
              </div>
              <p className="text-[var(--muted-foreground)]">Budget: ₹3.5 Cr • Handover: November 2026</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <div className="flex justify-between font-bold">
                <span>New 500-Bed International Student Hostel</span>
                <span className="text-primary-600 dark:text-primary-400">75% Completed</span>
              </div>
              <p className="text-[var(--muted-foreground)]">Budget: ₹8.2 Cr • Handover: January 2027</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Green Solar Rooftop Grid (500 kW)</span>
                <span className="text-emerald-600 dark:text-emerald-400">Commissioned</span>
              </div>
              <p className="text-[var(--muted-foreground)]">Reduces campus carbon footprint by 42%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
