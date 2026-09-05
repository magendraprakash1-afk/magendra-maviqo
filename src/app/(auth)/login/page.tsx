"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { DASHBOARD_ROUTES, ROLE_LABELS, type UserRole, ROLES } from "@/lib/constants";
import {
  LogIn,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  Building2,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLLEGES = [
  "Sri Maviqo Engineering College",
  "Indian Institute of Technology (IIT), Madras",
  "Anna University, Chennai",
  "National Institute of Technology (NIT), Trichy",
  "Stanford University",
  "Massachusetts Institute of Technology (MIT)",
  "Other Institution...",
];

const ROLE_CREDENTIALS: Record<UserRole, { email: string; pass: string }> = {
  student: { email: "karthik@maviqo.edu", pass: "password123" },
  faculty: { email: "priya@maviqo.edu", pass: "password123" },
  hod: { email: "ramesh@maviqo.edu", pass: "password123" },
  admin: { email: "admin@maviqo.edu", pass: "password123" },
  management: { email: "management@maviqo.edu", pass: "password123" },
  parent: { email: "parent@maviqo.edu", pass: "password123" },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, register, socialLogin, switchRole } = useAuth();

  // Mode: "signin" | "signup"
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // College Selection
  const [selectedCollege, setSelectedCollege] = useState(COLLEGES[0]);
  const [customCollege, setCustomCollege] = useState("");

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [showMoreRoles, setShowMoreRoles] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [rollOrEmpId, setRollOrEmpId] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [email, setEmail] = useState(ROLE_CREDENTIALS.student.email);
  const [password, setPassword] = useState(ROLE_CREDENTIALS.student.pass);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getEffectiveCollege = () => {
    if (selectedCollege === "Other Institution...") {
      return customCollege.trim() || "Maviqo Partner Institute";
    }
    return selectedCollege;
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (authMode === "signin") {
      setEmail(ROLE_CREDENTIALS[role].email);
      setPassword(ROLE_CREDENTIALS[role].pass);
    }
    setErrorMessage(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const college = getEffectiveCollege();

    if (authMode === "signin") {
      const result = await login(email, password, college);
      if (result.success) {
        const dest = result.user ? DASHBOARD_ROUTES[result.user.role] : DASHBOARD_ROUTES[selectedRole];
        router.push(dest);
      } else {
        setErrorMessage(result.error || "Authentication failed. Check credentials.");
        setLoading(false);
      }
    } else {
      // Create Account mode
      if (!name.trim()) {
        setErrorMessage("Please enter your full name.");
        setLoading(false);
        return;
      }
      const result = await register(
        {
          name: name.trim(),
          email: email.trim(),
          role: selectedRole,
          avatar: null,
          department,
          collegeName: college,
          rollNumber: selectedRole === "student" ? (rollOrEmpId.trim() || "22CSE199") : undefined,
          employeeId: selectedRole !== "student" ? (rollOrEmpId.trim() || "FAC2024099") : undefined,
          program: selectedRole === "student" ? `B.Tech ${department}` : undefined,
          semester: selectedRole === "student" ? 5 : undefined,
          section: "A",
        },
        password
      );

      if (result.success) {
        const dest = DASHBOARD_ROUTES[selectedRole];
        router.push(dest);
      } else {
        setErrorMessage(result.error || "Could not create account.");
        setLoading(false);
      }
    }
  };

  // Social Login Handler (Google, Apple, Microsoft)
  const handleSocialAuth = async (provider: "google" | "apple" | "microsoft") => {
    setSocialLoading(provider);
    setErrorMessage(null);

    try {
      const college = getEffectiveCollege();
      const result = await socialLogin(provider, selectedRole, college);

      if (result.success) {
        const dest = DASHBOARD_ROUTES[selectedRole];
        router.push(dest);
      } else {
        setErrorMessage(result.error || `${provider} authentication failed.`);
        setSocialLoading(null);
      }
    } catch {
      setErrorMessage("Social sign-in was interrupted. Please try again.");
      setSocialLoading(null);
    }
  };

  // One-click demo login
  const handleOneClickLogin = (role: UserRole) => {
    setSelectedRole(role);
    switchRole(role);
    router.push(DASHBOARD_ROUTES[role]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[11px] font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Single Sign-On & Academic Portal
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {authMode === "signin" ? "Sign in to Maviqo" : "Create your Maviqo Account"}
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Select your college and role to enter your personalized dashboard
        </p>
      </div>

      {/* Auth Mode Toggle (Sign In / Create Account) */}
      <div className="flex rounded-xl bg-[var(--muted)] p-1 border border-[var(--border)]">
        <button
          type="button"
          onClick={() => {
            setAuthMode("signin");
            setErrorMessage(null);
            setEmail(ROLE_CREDENTIALS[selectedRole].email);
            setPassword(ROLE_CREDENTIALS[selectedRole].pass);
          }}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5",
            authMode === "signin"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          <LogIn className="w-3.5 h-3.5" /> Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("signup");
            setErrorMessage(null);
            if (email === ROLE_CREDENTIALS[selectedRole].email) {
              setEmail("");
            }
          }}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5",
            authMode === "signup"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          <UserPlus className="w-3.5 h-3.5" /> Create Account
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-slide-in-up">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. College Selection Option */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary-500" />
          <span>Select College / Institution</span>
        </label>
        <div className="relative">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full h-10 px-3 pr-8 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:border-primary-500 text-xs font-medium outline-none transition-all cursor-pointer"
          >
            {COLLEGES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {selectedCollege === "Other Institution..." && (
          <input
            type="text"
            placeholder="Type your College / University name..."
            value={customCollege}
            onChange={(e) => setCustomCollege(e.target.value)}
            className="w-full h-9 px-3 rounded-xl bg-[var(--muted)] border border-primary-500/50 text-xs outline-none animate-in fade-in"
          />
        )}
      </div>

      {/* 2. Role Selector (Student or Faculty Primary, Expandable for others) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-primary-500" />
            <span>Select Your Role</span>
          </label>
          <button
            type="button"
            onClick={() => setShowMoreRoles(!showMoreRoles)}
            className="text-[11px] text-primary-500 hover:underline font-semibold"
          >
            {showMoreRoles ? "Hide additional roles" : "More roles (HOD, Admin...)"}
          </button>
        </div>

        {/* Primary Role Buttons: Student & Faculty */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSelectRole("student")}
            className={cn(
              "p-3 rounded-xl text-left border transition-all flex items-center gap-3 relative overflow-hidden group",
              selectedRole === "student"
                ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-primary-500/30"
                : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                selectedRole === "student"
                  ? "bg-primary-500 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
              )}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Student</p>
              <p className="text-[10px] text-[var(--muted-foreground)]">Classes, Attendance & Grades</p>
            </div>
            {selectedRole === "student" && (
              <CheckCircle2 className="w-4 h-4 text-primary-500 absolute top-2 right-2" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole("faculty")}
            className={cn(
              "p-3 rounded-xl text-left border transition-all flex items-center gap-3 relative overflow-hidden group",
              selectedRole === "faculty"
                ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-primary-500/30"
                : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                selectedRole === "faculty"
                  ? "bg-violet-600 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
              )}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Faculty</p>
              <p className="text-[10px] text-[var(--muted-foreground)]">Attendance by Roll No & Teaching</p>
            </div>
            {selectedRole === "faculty" && (
              <CheckCircle2 className="w-4 h-4 text-primary-500 absolute top-2 right-2" />
            )}
          </button>
        </div>

        {/* Extended Roles Row */}
        {showMoreRoles && (
          <div className="grid grid-cols-4 gap-2 pt-1 animate-in fade-in slide-in-from-top-1">
            {(["hod", "admin", "management", "parent"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={cn(
                  "p-2 rounded-xl text-[11px] font-bold border transition-all text-center capitalize",
                  selectedRole === r
                    ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400"
                    : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]"
                )}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Social Logins (Google, Apple, Microsoft) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Instant Login With
          </span>
          <span className="text-[10px] text-primary-500 font-semibold">1-Click Fast Auth</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Google */}
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialAuth("google")}
            className="flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            {socialLoading === "google" ? (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.37 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google</span>
              </>
            )}
          </button>

          {/* Apple */}
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialAuth("apple")}
            className="flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            {socialLoading === "apple" ? (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.42-7.53-11.4-13.55-24.64-18.06-39.73-4.51-15.08-6.77-29.35-6.77-42.8 0-16.7 4.35-30.82 13.06-42.36 8.71-11.54 19.67-17.43 32.88-17.68 5.76 0 11.96 1.45 18.6 4.36 6.64 2.91 11.17 4.42 13.59 4.54 2.01-.25 6.77-1.87 14.28-4.88 7.51-3.01 13.79-4.34 18.84-4 13.88.98 25.04 6.3 33.48 15.96-12.19 7.42-18.15 17.5-17.88 30.24.27 10.02 4.12 18.52 11.56 25.5 7.44 6.98 16.32 10.96 26.64 11.94-2.45 7.43-5.3 14.86-8.55 22.3zM119.22 31.87c0-7.72 2.76-14.99 8.28-21.81 5.52-6.82 12.35-10.66 20.48-11.52.49 1.25.74 2.45.74 3.6 0 7.74-2.89 15.14-8.67 22.21-5.78 7.07-12.69 11.02-20.73 11.85-.06-1.44-.1-2.88-.1-4.33z" />
                </svg>
                <span>Apple</span>
              </>
            )}
          </button>

          {/* Microsoft */}
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialAuth("microsoft")}
            className="flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            {socialLoading === "microsoft" ? (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>Microsoft</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--card)] px-3 text-[var(--muted-foreground)] font-semibold text-[10px]">
            Or with Email & Password
          </span>
        </div>
      </div>

      {/* 4. Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === "signup" && (
          <div className="space-y-3 animate-in fade-in">
            <div>
              <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Karthik Raj or Dr. Priya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">
                  {selectedRole === "student" ? "Roll Number" : "Employee ID"}
                </label>
                <input
                  type="text"
                  placeholder={selectedRole === "student" ? "e.g. 22CSE101" : "e.g. FAC2024001"}
                  value={rollOrEmpId}
                  onChange={(e) => setRollOrEmpId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 text-xs outline-none"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Mechanical Engineering">MECH</option>
                  <option value="Artificial Intelligence & DS">AIDS</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[var(--foreground)]">College / Institutional Email</label>
            {authMode === "signin" && (
              <span className="text-[10px] text-[var(--muted-foreground)] font-medium">
                Demo: {ROLE_CREDENTIALS[selectedRole].email}
              </span>
            )}
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@maviqo.edu"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-xs outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[var(--foreground)]">Password</label>
            {authMode === "signin" && (
              <Link href="/forgot-password" className="text-xs text-primary-500 hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-xs outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!socialLoading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : authMode === "signin" ? (
            <>
              <LogIn className="w-4 h-4" /> Open {ROLE_LABELS[selectedRole]} Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create {ROLE_LABELS[selectedRole]} Account & Launch
            </>
          )}
        </button>

        {/* Quick Demo Preview Button */}
        <button
          type="button"
          onClick={() => handleOneClickLogin(selectedRole)}
          className="w-full py-2 text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Quick Demo Direct Access as {ROLE_LABELS[selectedRole]}
        </button>
      </form>
    </div>
  );
}
