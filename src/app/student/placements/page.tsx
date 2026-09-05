"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { demoPlacements } from "@/lib/demo-data";
import { Briefcase, Building2, MapPin, IndianRupee, CheckCircle2, Clock, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentPlacementsPage() {
  const [appliedIds, setAppliedIds] = useState<string[]>(["plc_1"]);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleApply = (id: string, role: string, company: string) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds([...appliedIds, id]);
    setToast(`Applied successfully for ${role} at ${company}! Application forwarded to placement cell.`);
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = demoPlacements.filter(
    (p) =>
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Placement Cell & Career Portal"
          subtitle="Campus recruitment drives, elite hiring opportunities, and application status"
        />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search roles or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Active Drives" value={demoPlacements.length.toString()} icon={Briefcase} color="blue" />
        <StatCard title="My Applications" value={appliedIds.length.toString()} icon={CheckCircle2} color="purple" />
        <StatCard title="Highest Package" value="₹44.5 LPA" icon={IndianRupee} color="emerald" />
        <StatCard title="Average CTC" value="₹12.8 LPA" icon={Building2} color="amber" />
      </div>

      {/* Drives Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((item) => {
          const isApplied = appliedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[var(--foreground)]">{item.role}</h3>
                    <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {item.company}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0 border border-emerald-500/20">
                    {item.package}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2 text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.location} • Full Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Eligibility: <strong>{item.eligibility}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span>Apply Deadline: {item.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                {isApplied ? (
                  <div className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Application Under Review</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(item.id, item.role, item.company)}
                    className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    Apply with Verified Profile
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
