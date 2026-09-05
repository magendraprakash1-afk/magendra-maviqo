"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { formatCurrency } from "@/lib/utils";
import { IndianRupee, TrendingUp, CheckCircle2, Download, AlertCircle, PieChart, ArrowUpRight } from "lucide-react";

export default function ManagementFinancialPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Institutional Financial & Revenue Overview"
          subtitle="Operating budgets, fee collection realization, capital expenditures, and audit balance"
        />
        <button
          onClick={() => alert("Downloading Statutory Annual Financial Statement (FY 2025-26) verified by Chartered Accountants.")}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Download Audit Financials</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Annual Fee Revenue" value="₹24.8 Cr" trend={{ value: "+12.2% YoY", positive: true }} icon={IndianRupee} color="emerald" />
        <StatCard title="Fee Collection Rate" value="94.2%" trend={{ value: "₹23.4 Cr Realized", positive: true }} icon={CheckCircle2} color="blue" />
        <StatCard title="Operating Expenses" value="₹16.2 Cr" icon={PieChart} color="purple" />
        <StatCard title="Capital Reserves" value="₹8.6 Cr" icon={TrendingUp} color="amber" />
      </div>

      {/* Revenue vs Expenditure Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Income & Revenue Streams (FY 2026-27)
          </h3>

          <div className="space-y-3">
            {[
              { source: "Tuition & Academic Term Fees", amount: "₹18.4 Cr", pct: 74, color: "bg-emerald-500" },
              { source: "Hostel, Dining & Transportation", amount: "₹3.8 Cr", pct: 15, color: "bg-teal-500" },
              { source: "Research Grants & Consultancy", amount: "₹1.6 Cr", pct: 7, color: "bg-blue-500" },
              { source: "Alumni Endowments & Industry CSR", amount: "₹1.0 Cr", pct: 4, color: "bg-purple-500" },
            ].map((s) => (
              <div key={s.source} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>{s.source}</span>
                  <span className="text-[var(--foreground)]">{s.amount} ({s.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            Expenditure Distribution
          </h3>

          <div className="space-y-3">
            {[
              { category: "Faculty & Staff Payroll", amount: "₹9.8 Cr", pct: 60, color: "bg-primary-600" },
              { category: "Campus Infrastructure & Laboratories", amount: "₹3.2 Cr", pct: 20, color: "bg-indigo-500" },
              { category: "Library, Software Licenses & Cloud", amount: "₹1.8 Cr", pct: 11, color: "bg-purple-500" },
              { category: "Student Scholarships & Merits", amount: "₹1.4 Cr", pct: 9, color: "bg-amber-500" },
            ].map((c) => (
              <div key={c.category} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>{c.category}</span>
                  <span className="text-[var(--foreground)]">{c.amount} ({c.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
