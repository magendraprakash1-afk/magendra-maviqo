"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { DataStore, type FeeState } from "@/lib/data-store";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, CheckCircle2, IndianRupee, Download, AlertCircle, ArrowUpRight, Check } from "lucide-react";

export default function StudentFees() {
  const [feeState, setFeeState] = useState<FeeState>(() => DataStore.getFeeState());
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("UPI");
  const [lastReceipt, setLastReceipt] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setFeeState(DataStore.getFeeState());
    };
    window.addEventListener("maviqo_datastore_change", handleSync);
    return () => window.removeEventListener("maviqo_datastore_change", handleSync);
  }, []);

  const { totalFee, paid, pending, dueDate, payments } = feeState;
  const paidPercentage = Math.min(100, Math.round((paid / totalFee) * 100));

  const handleOpenPay = () => {
    setPayAmount(String(pending));
    setShowPaymentModal(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;

    setIsPaying(true);
    setTimeout(() => {
      const updated = DataStore.payFee(amt, payMethod);
      setIsPaying(false);
      setShowPaymentModal(false);
      if (updated.payments.length > 0) {
        setLastReceipt(updated.payments[0].receipt);
      }
    }, 900);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Fees & Dues" subtitle="Fee structure, real-time payments, and official receipts" />
        {pending > 0 && (
          <button
            onClick={handleOpenPay}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all self-start sm:self-center"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Due Fees</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {lastReceipt && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-sm font-semibold">Payment processed! Receipt #{lastReceipt} generated and stored.</span>
          </div>
          <button
            onClick={() => setLastReceipt(null)}
            className="text-xs underline font-medium hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm mb-2">
            <IndianRupee className="w-4 h-4" /> Total Fee
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalFee)}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Academic Year 2026-27</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 text-sm mb-2">
            <CheckCircle2 className="w-4 h-4" /> Paid
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(paid)}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{paidPercentage}% completed</p>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-rose-500 text-sm mb-2">
            <AlertCircle className="w-4 h-4" /> Pending
          </div>
          <p className="text-2xl font-bold text-rose-500">{formatCurrency(pending)}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Due by {new Date(dueDate).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-sm">Payment Progress</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{paidPercentage}%</span>
        </div>
        <div className="h-3.5 rounded-full bg-[var(--muted)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-700"
            style={{ width: `${paidPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-[var(--muted-foreground)]">
          <span>Paid: {formatCurrency(paid)}</span>
          <span>Remaining: {formatCurrency(pending)}</span>
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-sm">Payment History & Receipts</h3>
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">{payments.length} Transactions</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-[var(--muted)]/50 transition-colors">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{formatCurrency(p.amount)}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {new Date(p.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} • {p.method}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {p.status}
                </span>
                <p className="text-xs font-mono text-[var(--muted-foreground)] mt-1">{p.receipt}</p>
              </div>
              <button
                onClick={() => alert(`Receipt #${p.receipt}\nAmount: ₹${p.amount}\nDate: ${p.date}\nStatus: ${p.status}\nInstitution: Maviqo Institute of Technology`)}
                className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                title="Download receipt"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Process Fee Payment</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Secure fee payment portal via UPI, NetBanking or Credit/Debit Card.
            </p>

            <form onSubmit={handleExecutePayment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  max={pending}
                  min={100}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm font-semibold"
                />
                <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                  Maximum payable: {formatCurrency(pending)}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["UPI", "NetBanking", "Card"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        payMethod === m
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-[var(--border)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isPaying}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                >
                  {isPaying ? "Processing..." : `Pay ₹${Number(payAmount || 0).toLocaleString("en-IN")}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
