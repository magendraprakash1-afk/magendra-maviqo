"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Search, GraduationCap, Award, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentInfo {
  rollNo: string;
  name: string;
  semester: number;
  section: string;
  attendance: number;
  cgpa: number;
  arrears: number;
}

const studentsList: StudentInfo[] = [
  { rollNo: "22CSE101", name: "Karthik Raj", semester: 5, section: "A", attendance: 91.2, cgpa: 8.85, arrears: 0 },
  { rollNo: "22CSE102", name: "Ananya Sharma", semester: 5, section: "A", attendance: 94.5, cgpa: 9.20, arrears: 0 },
  { rollNo: "22CSE103", name: "Bala Murugan", semester: 5, section: "A", attendance: 86.0, cgpa: 7.90, arrears: 0 },
  { rollNo: "22CSE104", name: "Deepa Lakshmi", semester: 5, section: "A", attendance: 71.5, cgpa: 6.80, arrears: 1 },
  { rollNo: "22CSE105", name: "Gokul Nath", semester: 5, section: "A", attendance: 88.0, cgpa: 8.10, arrears: 0 },
  { rollNo: "22CSE106", name: "Harini S", semester: 5, section: "A", attendance: 93.0, cgpa: 8.95, arrears: 0 },
  { rollNo: "22CSE107", name: "Ishwarya R", semester: 5, section: "A", attendance: 74.0, cgpa: 7.20, arrears: 0 },
  { rollNo: "22CSE108", name: "Jagan Mohan", semester: 5, section: "A", attendance: 82.5, cgpa: 7.60, arrears: 0 },
];

export default function HODStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLowAttendance, setFilterLowAttendance] = useState(false);

  const filtered = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAttendance = filterLowAttendance ? s.attendance < 75 : true;
    return matchesSearch && matchesAttendance;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Department Students" subtitle="Track academic performance and attendance across semesters" />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm outline-none"
          />
        </div>

        <button
          onClick={() => setFilterLowAttendance(!filterLowAttendance)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2",
            filterLowAttendance
              ? "bg-rose-500/10 border-rose-500 text-rose-500"
              : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
          )}
        >
          <AlertCircle className="w-3.5 h-3.5" /> Filter Low Attendance (&lt; 75%)
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="text-left p-4 font-medium">Roll No</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-center p-4 font-medium">Sem / Sec</th>
                <th className="text-center p-4 font-medium">Attendance</th>
                <th className="text-center p-4 font-medium">CGPA</th>
                <th className="text-center p-4 font-medium">Arrears</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((s) => (
                <tr key={s.rollNo} className="hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="p-4 font-mono font-medium text-xs">{s.rollNo}</td>
                  <td className="p-4 font-semibold">{s.name}</td>
                  <td className="p-4 text-center text-[var(--muted-foreground)]">
                    Sem {s.semester} - {s.section}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold",
                        s.attendance >= 90 && "bg-emerald-500/10 text-emerald-500",
                        s.attendance >= 75 && s.attendance < 90 && "bg-amber-500/10 text-amber-500",
                        s.attendance < 75 && "bg-rose-500/10 text-rose-500"
                      )}
                    >
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-primary-500">{s.cgpa}</td>
                  <td className="p-4 text-center">
                    {s.arrears > 0 ? (
                      <span className="text-rose-500 font-bold">{s.arrears}</span>
                    ) : (
                      <span className="text-emerald-500">Nil</span>
                    )}
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
