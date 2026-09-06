"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { DASHBOARD_ROUTES, ROLE_LABELS, type UserRole, ROLES, COLLEGES, DEFAULT_COLLEGE } from "@/lib/constants";
import { UserPlus, Mail, Lock, User, Building2, GraduationCap, Briefcase, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const [selectedCollege, setSelectedCollege] = useState(DEFAULT_COLLEGE);
  const [customCollege, setCustomCollege] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    department: "Computer Science & Engineering",
    rollOrEmpId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getEffectiveCollege = () => {
    if (selectedCollege.startsWith("Other Institution")) {
      return customCollege.trim() || DEFAULT_COLLEGE;
    }
    return selectedCollege;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const college = getEffectiveCollege();
    const result = await register(
      {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        role,
        avatar: null,
        department: formData.department,
        collegeName: college,
        rollNumber: role === "student" ? (formData.rollOrEmpId.trim() || "22CSE199") : undefined,
        employeeId: role !== "student" ? (formData.rollOrEmpId.trim() || "FAC2024099") : undefined,
        program: role === "student" ? `B.Tech ${formData.department}` : undefined,
        semester: role === "student" ? 5 : undefined,
        section: "A",
      },
      formData.password
    );

    if (result.success) {
      router.push(DASHBOARD_ROUTES[role]);
    } else {
      setErrorMessage(result.error || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Create your account</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Join Maviqo AI College Platform with your college credentials
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-slide-in-up">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* College Option */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary-500" />
            <span>Select College</span>
          </label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs font-medium outline-none"
          >
            {COLLEGES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {selectedCollege.startsWith("Other Institution") && (
            <input
              type="text"
              placeholder="Enter College Name"
              value={customCollege}
              onChange={(e) => setCustomCollege(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-[var(--muted)] border border-primary-500/40 text-xs outline-none mt-1"
            />
          )}
        </div>

        {/* Role Option: Student or Faculty Primary */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1.5">
            Account Role
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2",
                role === "student"
                  ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]"
              )}
            >
              <GraduationCap className="w-4 h-4" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole("faculty")}
              className={cn(
                "p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2",
                role === "faculty"
                  ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]"
              )}
            >
              <Briefcase className="w-4 h-4" /> Faculty
            </button>
          </div>
        </div>

        {/* Names */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[var(--foreground)] block mb-1">First name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs outline-none"
              placeholder="e.g. Karthik"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Last name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs outline-none"
              placeholder="e.g. Raj"
            />
          </div>
        </div>

        {/* Roll No or Emp ID & Department */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[var(--foreground)] block mb-1">
              {role === "student" ? "Roll Number" : "Employee ID"}
            </label>
            <input
              type="text"
              value={formData.rollOrEmpId}
              onChange={(e) => setFormData({ ...formData, rollOrEmpId: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs font-mono outline-none"
              placeholder={role === "student" ? "22CSE101" : "FAC2024001"}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full h-10 px-2 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs outline-none"
            >
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Mechanical Engineering">MECH</option>
              <option value="Artificial Intelligence & DS">AIDS</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--foreground)] block mb-1">College Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs outline-none"
              placeholder="student@maviqo.edu"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create {ROLE_LABELS[role]} Account & Open Dashboard
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-500 hover:underline font-semibold">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
