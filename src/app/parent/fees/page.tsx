"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { demoParentChild } from "@/lib/demo-data";
import { DataStore, type FeeState } from "@/lib/data-store";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, CheckCircle2, Download, AlertCircle, IndianRupee, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function ParentFeesPage() {
  const child = demoParentChild;
  const [feeState, setFeeState] = useState<FeeState>(() => DataStore.getFeeState());
  const [paying, setPaying] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setFeeState(DataStore.getFeeState());
    };
    window.addEventListener("maviqo_datastore_change", handleSync);
    return () => window.removeEventListener("maviqo_datastore_change", handleSync);
  }, []);

  const { totalFee, paid, pending, dueDate, payments } = feeState;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      const updated = DataStore.payFee(pending, "UPI NetBanking");
      setPaying(false);
      if (updated.payments.length > 0) {
        setSuccessReceipt(updated.payments[0].receipt);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader
        title={`${child.name}'s Fee Portal`}
        subtitle="View fee schedule, download receipts, and pay pending fees directly"
      />

      {successReceipt && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-semibold">
              Payment received successfully! Official receipt #{successReceipt} generated and sent to registered email.
            </p>
          </div>
          <button
            onClick={() => setSuccessReceipt(null)}
            className="text-xs font-semibold underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Total Annual Fee" value={formatCurrency(totalFee)} icon={IndianRupee} color="blue" />
        <StatCard title="Paid to Date" value={formatCurrency(paid)} icon={CheckCircle2} color="emerald" />
        <StatCard
          title="Due Balance"
          value={formatCurrency(pending)}
          subtitle={pending > 0 ? `Due: ${dueDate}` : "All dues cleared"}
          icon={AlertCircle}
          color={pending > 0 ? "rose" : "emerald"}
        />
      </div>

      {pending > 0 && (
        <div className="p-6 rounded-2xl border border-primary-500/30 bg-primary-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base">Outstanding Balance: {formatCurrency(pending)}</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Tuition Fee for Semester 5 is due by {dueDate}. Instant receipt generated upon payment.
            </p>
          </div>
          <button
            onClick={handlePay}
            disabled={paying}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-500/25 shrink-0 flex items-center gap-2 disabled:opacity-50"
          >
            {paying ? "Processing Secure Payment..." : `Pay ${formatCurrency(pending)} Now`}
          </button>
        </div>
      )}

      {/* Receipts */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-semibold text-sm">Fee Receipts & Transaction Records</h3>
          <span className="text-xs text-[var(--muted-foreground)]">{payments.length} Records</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 hover:bg-[var(--muted)]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{formatCurrency(p.amount)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Receipt #{p.receipt} • {p.date} • {p.method}
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert(`Receipt #${p.receipt}\nStudent: ${child.name}\nAmount: ₹${p.amount}\nDate: ${p.date}\nPayment Method: ${p.method}\nInstitution: Maviqo Institute of Technology`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
