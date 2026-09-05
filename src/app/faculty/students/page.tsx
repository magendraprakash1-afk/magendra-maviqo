"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { demoFacultyClasses } from "@/lib/demo-data";
import { getInitials, cn } from "@/lib/utils";
import { Users, Search, AlertTriangle, CheckCircle2, MessageSquare, Phone, Mail, Award } from "lucide-react";

interface StudentRosterItem {
  id: string;
  roll: string;
  name: string;
  section: string;
  attendance: number;
  internalMarks: number;
  cgpa: number;
  status: "Normal" | "Attendance Warning" | "Dean's List";
  email: string;
  phone: string;
}

const mockStudents: StudentRosterItem[] = [
  { id: "st_1", roll: "CS2024001", name: "Aarav Patel", section: "CSE-A", attendance: 92, internalMarks: 45, cgpa: 8.9, status: "Dean's List", email: "aarav.p@maviqo.edu", phone: "+91 98765 43210" },
  { id: "st_2", roll: "CS2024002", name: "Ananya Sharma", section: "CSE-A", attendance: 88, internalMarks: 42, cgpa: 8.6, status: "Normal", email: "ananya.s@maviqo.edu", phone: "+91 98765 43211" },
  { id: "st_3", roll: "CS2024003", name: "Deepak Kumar", section: "CSE-A", attendance: 68, internalMarks: 28, cgpa: 6.4, status: "Attendance Warning", email: "deepak.k@maviqo.edu", phone: "+91 98765 43212" },
  { id: "st_4", roll: "CS2024004", name: "Karthik Raja", section: "CSE-A", attendance: 85, internalMarks: 40, cgpa: 8.4, status: "Normal", email: "karthik.r@maviqo.edu", phone: "+91 98765 43213" },
  { id: "st_5", roll: "CS2024005", name: "Meera Nair", section: "CSE-A", attendance: 96, internalMarks: 48, cgpa: 9.4, status: "Dean's List", email: "meera.n@maviqo.edu", phone: "+91 98765 43214" },
  { id: "st_6", roll: "CS2024006", name: "Rahul Verma", section: "CSE-B", attendance: 71, internalMarks: 31, cgpa: 6.8, status: "Attendance Warning", email: "rahul.v@maviqo.edu", phone: "+91 98765 43215" },
  { id: "st_7", roll: "CS2024007", name: "Sneha Reddy", section: "CSE-B", attendance: 90, internalMarks: 44, cgpa: 8.8, status: "Normal", email: "sneha.r@maviqo.edu", phone: "+91 98765 43216" },
  { id: "st_8", roll: "CS2024008", name: "Vikram Singh", section: "CSE-B", attendance: 84, internalMarks: 38, cgpa: 7.9, status: "Normal", email: "vikram.s@maviqo.edu", phone: "+91 98765 43217" },
];

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<StudentRosterItem[]>(mockStudents);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [mentorModalStudent, setMentorModalStudent] = useState<StudentRosterItem | null>(null);
  const [noteText, setNoteText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase());
    const matchSection = selectedSection === "All" || s.section === selectedSection;
    return matchSearch && matchSection;
  });

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorModalStudent) return;
    setToast(`Mentor counsel note saved for ${mentorModalStudent.name}. Logged into Academic Record.`);
    setMentorModalStudent(null);
    setNoteText("");
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Student Roster & Mentorship"
          subtitle="Enrolled students across your assigned sections, attendance monitoring, and mentor logs"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold"
          >
            <option value="All">All Sections</option>
            <option value="CSE-A">CSE-A (DAA)</option>
            <option value="CSE-B">CSE-B (Adv Algos)</option>
          </select>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search roll or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Roster Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--muted)]/50 border-b border-[var(--border)] font-semibold text-[var(--muted-foreground)] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Section</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Internal (50)</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-500 font-bold flex items-center justify-center text-xs shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{s.name}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)]">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-medium">{s.roll}</td>
                  <td className="p-4 font-semibold">{s.section}</td>
                  <td className="p-4">
                    <span className={cn(
                      "font-bold",
                      s.attendance >= 85 ? "text-emerald-600 dark:text-emerald-400" : s.attendance >= 75 ? "text-amber-600" : "text-rose-600"
                    )}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="p-4 font-bold">{s.internalMarks}</td>
                  <td className="p-4 font-semibold">{s.cgpa}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block",
                      s.status === "Dean's List" && "bg-purple-500/10 text-purple-600 border-purple-500/20",
                      s.status === "Normal" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                      s.status === "Attendance Warning" && "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    )}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setMentorModalStudent(s)}
                        className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-primary-500 transition-colors"
                        title="Add Mentor Note"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Parent Contact for ${s.name}:\nPhone: ${s.phone}\nEmail: parent.${s.email}`)}
                        className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-emerald-500 transition-colors"
                        title="Contact Parent"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mentor Note Modal */}
      {mentorModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Faculty Mentor Note</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Recording confidential counselling & performance guidance note for <strong>{mentorModalStudent.name}</strong> ({mentorModalStudent.roll}).
            </p>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Observation / Guidance</label>
                <textarea
                  required
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Discussed attendance shortage with student. Advised remedial tests and makeup practical sessions..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setMentorModalStudent(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm"
                >
                  Save Note to Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
