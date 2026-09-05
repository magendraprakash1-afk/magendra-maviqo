"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, IndianRupee, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AdminFeesPage() {
  const transactions = [
    { id: "tx1", student: "Karthik Raj", rollNo: "22CSE101", amount: 65000, category: "Tuition Fee - Sem 5", date: "2026-08-15", method: "UPI", status: "Completed" },
    { id: "tx2", student: "Ananya Sharma", rollNo: "22CSE102", amount: 65000, category: "Tuition Fee - Sem 5", date: "2026-08-14", method: "Net Banking", status: "Completed" },
    { id: "tx3", student: "Bala Murugan", rollNo: "22CSE103", amount: 45000, category: "Hostel Fee", date: "2026-08-12", method: "Card", status: "Completed" },
    { id: "tx4", student: "Deepa Lakshmi", rollNo: "22CSE104", amount: 65000, category: "Tuition Fee - Sem 5", date: "2026-08-10", method: "UPI", status: "Completed" },
    { id: "tx5", student: "Gokul Nath", rollNo: "22CSE105", amount: 25000, category: "Transport Fee", date: "2026-08-08", method: "Cash", status: "Completed" },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Fee Management" subtitle="Institutional fee collections, dues, and transaction records" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Expected" value={formatCurrency(245000000)} icon={IndianRupee} color="blue" />
        <StatCard title="Total Collected" value={formatCurrency(198000000)} icon={CheckCircle2} color="emerald" trend={{ value: 8.5, label: "collection rate" }} />
        <StatCard title="Pending Dues" value={formatCurrency(47000000)} icon={AlertCircle} color="rose" />
        <StatCard title="Transactions Today" value="48" subtitle="₹14.2 Lakhs" icon={CreditCard} color="violet" />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)]">
          <h3 className="font-semibold text-base">Recent Fee Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="text-left p-4 font-medium">Student</th>
                <th className="text-left p-4 font-medium">Fee Category</th>
                <th className="text-left p-4 font-medium">Payment Mode</th>
                <th className="text-center p-4 font-medium">Date</th>
                <th className="text-right p-4 font-medium">Amount</th>
                <th className="text-center p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold">{tx.student}</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">{tx.rollNo}</p>
                  </td>
                  <td className="p-4 text-[var(--foreground)]">{tx.category}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">{tx.method}</td>
                  <td className="p-4 text-center text-xs text-[var(--muted-foreground)]">{tx.date}</td>
                  <td className="p-4 text-right font-bold text-emerald-500">{formatCurrency(tx.amount)}</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
