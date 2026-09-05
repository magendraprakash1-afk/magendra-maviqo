"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { BarChart3, TrendingUp, Users, Award, IndianRupee, CheckCircle2, Building2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title="Institutional Analytics & Intelligence"
        subtitle="Campus-wide student enrollment, faculty metrics, revenue health, and accreditation KPIs"
      />

      {/* Institutional KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Enrolled" value="2,040" trend={{ value: "+8.4% YoY", positive: true }} icon={Users} color="blue" />
        <StatCard title="Faculty-Student Ratio" value="1 : 14.8" icon={Award} color="emerald" />
        <StatCard title="Tuition Fee Realized" value="₹18.4 Cr" trend={{ value: "94.2% collected", positive: true }} icon={IndianRupee} color="purple" />
        <StatCard title="Campus Placement Rate" value="92.4%" trend={{ value: "+4.1%", positive: true }} icon={TrendingUp} color="amber" />
      </div>

      {/* Analytics Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Department Enrollment & Seat Occupancy
          </h3>

          <div className="space-y-4">
            {[
              { name: "Computer Science & Engg", enrolled: 712, total: 720, pct: 98.8 },
              { name: "AI & Data Science", enrolled: 480, total: 480, pct: 100 },
              { name: "Electronics & Communication", enrolled: 456, total: 480, pct: 95.0 },
              { name: "Mechanical Engineering", enrolled: 208, total: 240, pct: 86.6 },
              { name: "Management Studies (MBA)", enrolled: 120, total: 120, pct: 100 },
            ].map((d) => (
              <div key={d.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>{d.name}</span>
                  <span className="text-primary-600 dark:text-primary-400">{d.enrolled} / {d.total} ({d.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div className="h-full rounded-full bg-primary-600" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Academic Year Progress & Compliance
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">NIRF Engineering Ranking Band</p>
                <p className="text-[var(--muted-foreground)]">Submitted data validated for 2026 ranking cycle</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">Rank 51-100</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">NAAC Accreditation Cycle</p>
                <p className="text-[var(--muted-foreground)]">Grade A++ (CGPA 3.68 on 4-point scale)</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 font-bold">Valid till 2029</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--foreground)]">Research & Sponsored Grants</p>
                <p className="text-[var(--muted-foreground)]">14 Ongoing DST, AICTE & Industry Grants</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 font-bold">₹3.8 Crore</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
