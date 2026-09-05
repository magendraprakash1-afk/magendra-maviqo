"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveApplication {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
  status: "Approved" | "Pending" | "Rejected";
  appliedOn: string;
  approvedBy?: string;
}

const initialLeaves: LeaveApplication[] = [
  {
    id: "LV-101",
    type: "Medical Leave",
    startDate: "2026-08-18",
    endDate: "2026-08-20",
    reason: "Severe viral fever with doctor recommendation rest",
    days: 3,
    status: "Approved",
    appliedOn: "2026-08-17",
    approvedBy: "Dr. Ramesh Kumar (HOD)",
  },
  {
    id: "LV-102",
    type: "On-Duty (OD)",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    reason: "Representing college at Smart India Hackathon zonal round",
    days: 2,
    status: "Approved",
    appliedOn: "2026-09-02",
    approvedBy: "Prof. Priya Sharma",
  },
  {
    id: "LV-103",
    type: "Personal Leave",
    startDate: "2026-09-28",
    endDate: "2026-09-29",
    reason: "Sister's wedding ceremony in Coimbatore",
    days: 2,
    status: "Pending",
    appliedOn: "2026-09-04",
  },
];

export default function StudentLeavePage() {
  const [leaves, setLeaves] = useState<LeaveApplication[]>(initialLeaves);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual / Personal");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: LeaveApplication = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      type: leaveType,
      startDate,
      endDate,
      reason,
      days: Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1),
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    setLeaves([newApp, ...leaves]);
    setShowApplyModal(false);
    setReason("");
    setSubmittedMessage("Leave application submitted to Department Head for review.");
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Leave & OD Management"
          subtitle="Apply for medical leave, on-duty approval, and track approval status"
        />
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {submittedMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {submittedMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Applied" value={leaves.length.toString()} icon={FileText} color="blue" />
        <StatCard title="Approved" value={leaves.filter((l) => l.status === "Approved").length.toString()} icon={CheckCircle2} color="emerald" />
        <StatCard title="Pending" value={leaves.filter((l) => l.status === "Pending").length.toString()} icon={Clock} color="amber" />
        <StatCard title="OD Days Taken" value="2 Days" icon={Calendar} color="purple" />
      </div>

      {/* History */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border)]">
          <h3 className="font-semibold text-sm">Leave Applications History</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {leaves.map((item) => (
            <div key={item.id} className="p-5 hover:bg-[var(--muted)]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">{item.id}</span>
                    <span className="font-bold text-sm text-[var(--foreground)]">{item.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)]">
                      {item.days} {item.days > 1 ? "Days" : "Day"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">{item.reason}</p>
                  <div className="flex items-center gap-4 text-[11px] text-[var(--muted-foreground)] pt-1">
                    <span>From: <strong>{item.startDate}</strong> to <strong>{item.endDate}</strong></span>
                    <span>Applied: {item.appliedOn}</span>
                    {item.approvedBy && <span className="text-emerald-600 dark:text-emerald-400">Approved by: {item.approvedBy}</span>}
                  </div>
                </div>

                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-center shrink-0 border",
                  item.status === "Approved" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                  item.status === "Pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                  item.status === "Rejected" && "bg-rose-500/10 text-rose-600 border-rose-500/20"
                )}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Apply for Leave / On-Duty</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm"
                >
                  <option>Casual / Personal</option>
                  <option>Medical Leave</option>
                  <option>On-Duty (Hackathon / Conference)</option>
                  <option>Sports / Cultural OD</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Reason / Supporting Remarks</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detailed justification for leave or OD permission..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
