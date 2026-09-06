"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { DASHBOARD_ROUTES, ROLE_LABELS, type UserRole, ROLES } from "@/lib/constants";
import { DataStore } from "@/lib/data-store";
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
  Landmark,
  Shield,
  BarChart3,
  Users,
  RotateCcw,
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

const ROLE_CONFIGS: Record<
  UserRole,
  { label: string; desc: string; icon: React.ElementType; color: string; demoEmail: string }
> = {
  student: {
    label: "Student",
    desc: "Classes, Attendance & Grades",
    icon: GraduationCap,
    color: "text-primary-500 bg-primary-500/10 border-primary-500",
    demoEmail: "karthik@maviqo.edu",
  },
  faculty: {
    label: "Faculty",
    desc: "Mark Attendance & Teaching",
    icon: Briefcase,
    color: "text-violet-500 bg-violet-500/10 border-violet-500",
    demoEmail: "priya@maviqo.edu",
  },
  hod: {
    label: "HOD",
    desc: "Department & Faculty Stats",
    icon: Landmark,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500",
    demoEmail: "ramesh@maviqo.edu",
  },
  admin: {
    label: "Administrator",
    desc: "Users, Roles & Systems",
    icon: Shield,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500",
    demoEmail: "admin@maviqo.edu",
  },
  management: {
    label: "Management",
    desc: "Financials & Analytics",
    icon: BarChart3,
    color: "text-amber-500 bg-amber-500/10 border-amber-500",
    demoEmail: "management@maviqo.edu",
  },
  parent: {
    label: "Parent",
    desc: "Ward Progress & Fees",
    icon: Users,
    color: "text-rose-500 bg-rose-500/10 border-rose-500",
    demoEmail: "parent@maviqo.edu",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, register, socialLogin } = useAuth();

  // Mode: "signin" | "signup"
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // College Name
  const [selectedCollege, setSelectedCollege] = useState(COLLEGES[0]);
  const [customCollege, setCustomCollege] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Role Selection (Default: Student)
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  // Clean Slate Mode: default to true so new signups/signins start with 0 rows, erasing Karthik Raj
  const [startFreshClean, setStartFreshClean] = useState(true);

  // Form Fields (Empty by default for clean entry)
  const [name, setName] = useState("");
  const [rollOrEmpId, setRollOrEmpId] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getEffectiveCollege = () => {
    if (isCustomMode || selectedCollege === "Other Institution...") {
      return customCollege.trim() || "Sri Maviqo Engineering College";
    }
    return selectedCollege;
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const handleFillDemoCredentials = () => {
    setEmail(ROLE_CONFIGS[selectedRole].demoEmail);
    setPassword("password123");
    setStartFreshClean(false);
    setSuccessMessage(`Loaded ${ROLE_CONFIGS[selectedRole].label} demo credentials`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEraseToCleanState = () => {
    DataStore.eraseToCleanState();
    setStartFreshClean(true);
    setSuccessMessage("Erased all mock data! Clean slate active (0 rows).");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Submit Email & Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const college = getEffectiveCollege();

    if (startFreshClean) {
      DataStore.eraseToCleanState();
    }

    if (authMode === "signin") {
      const result = await login(email.trim(), password, college, selectedRole);
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
          rollNumber: selectedRole === "student" ? (rollOrEmpId.trim() || `2026STU${Math.floor(100 + Math.random() * 900)}`) : undefined,
          employeeId: selectedRole !== "student" ? (rollOrEmpId.trim() || `2026${selectedRole.toUpperCase().slice(0, 3)}001`) : undefined,
          program: selectedRole === "student" ? `B.Tech ${department}` : undefined,
          semester: selectedRole === "student" ? 1 : undefined,
          section: "A",
        },
        password
      );

      if (result.success) {
        if (startFreshClean) {
          DataStore.eraseToCleanState();
        }
        const dest = DASHBOARD_ROUTES[selectedRole];
        router.push(dest);
      } else {
        setErrorMessage(result.error || "Could not create account.");
        setLoading(false);
      }
    }
  };

  // Social Login Handler (Google, Microsoft, Apple)
  const handleSocialAuth = async (provider: "google" | "microsoft" | "apple") => {
    setSocialLoading(provider);
    setErrorMessage(null);

    try {
      const college = getEffectiveCollege();

      if (startFreshClean) {
        DataStore.eraseToCleanState();
      }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[11px] font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Institutional Access & Academic Portal
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {authMode === "signin" ? "Sign in to Maviqo" : "Create Maviqo Account"}
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Select your institutional role and college to enter your portal.
        </p>
      </div>

      {/* Auth Mode Toggle (Sign In / Create Account) */}
      <div className="flex rounded-xl bg-[var(--muted)] p-1 border border-[var(--border)]">
        <button
          type="button"
          onClick={() => {
            setAuthMode("signin");
            setErrorMessage(null);
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

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-slide-in-up">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. College / Institution Selection */}
      <div className="space-y-2 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary-500" />
            <span>College / Institution Name</span>
          </label>
          <button
            type="button"
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-[11px] text-primary-500 hover:underline font-semibold"
          >
            {isCustomMode ? "Choose from list" : "Type custom college"}
          </button>
        </div>

        {isCustomMode ? (
          <div className="space-y-1">
            <input
              type="text"
              placeholder="e.g. Harvard University or Sri Maviqo Tech"
              value={customCollege}
              onChange={(e) => setCustomCollege(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-primary-500/40 text-xs font-medium outline-none"
            />
            <p className="text-[10px] text-[var(--muted-foreground)]">Custom institution name will apply to your account and certificate branding.</p>
          </div>
        ) : (
          <select
            value={selectedCollege}
            onChange={(e) => {
              setSelectedCollege(e.target.value);
              if (e.target.value === "Other Institution...") {
                setIsCustomMode(true);
              }
            }}
            className="w-full h-10 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:border-primary-500 text-xs font-medium outline-none cursor-pointer"
          >
            {COLLEGES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 2. Role Selector - ALL 6 ROLES DISPLAYED */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-primary-500" />
            <span>Select Your Role</span>
          </span>
          <span className="text-[10px] text-primary-500 font-medium">
            Active: {ROLE_CONFIGS[selectedRole].label}
          </span>
        </label>

        {/* 6-Role Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((r) => {
            const config = ROLE_CONFIGS[r];
            const Icon = config.icon;
            const isSelected = selectedRole === r;

            return (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={cn(
                  "p-3 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between",
                  isSelected
                    ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-md ring-1 ring-primary-500/40"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-primary-500 text-white"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-500" />}
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">{config.label}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-1 line-clamp-1">
                    {config.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Instant Login With Google & Microsoft */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Instant 1-Click Sign In
          </span>
          <span className="text-[10px] text-primary-500 font-medium">As {ROLE_CONFIGS[selectedRole].label}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>Microsoft</span>
              </>
            )}
          </button>

          {/* Apple */}
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialAuth("apple")}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            {socialLoading === "apple" ? (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.42-7.53-11.4-13.55-24.64-18.06-39.73-4.51-15.08-6.77-29.35-6.77-42.8 0-16.7 4.35-30.82 13.06-42.36 8.71-11.54 19.67-17.43 32.88-17.68 5.76 0 11.96 1.45 18.6 4.36 6.64 2.91 11.17 4.42 13.59 4.54 2.01-.25 6.77-1.87 14.28-4.88 7.51-3.01 13.79-4.34 18.84-4 13.88.98 25.04 6.3 33.48 15.96-12.19 7.42-18.15 17.5-17.88 30.24.27 10.02 4.12 18.52 11.56 25.5 7.44 6.98 16.32 10.96 26.64 11.94-2.45 7.43-5.3 14.86-8.55 22.3zM119.22 31.87c0-7.72 2.76-14.99 8.28-21.81 5.52-6.82 12.35-10.66 20.48-11.52.49 1.25.74 2.45.74 3.6 0 7.74-2.89 15.14-8.67 22.21-5.78 7.07-12.69 11.02-20.73 11.85-.06-1.44-.1-2.88-.1-4.33z" />
                </svg>
                <span>Apple</span>
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
            Or Enter With Email & Password
          </span>
        </div>
      </div>

      {/* 4. Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {authMode === "signup" && (
          <div className="space-y-3 animate-in fade-in">
            <div>
              <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Kumar"
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

        {/* Email Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[var(--foreground)]">Email Address</label>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="text-[10px] text-primary-500 hover:underline font-semibold"
            >
              Fill {ROLE_CONFIGS[selectedRole].label} Demo
            </button>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`your.name@${getEffectiveCollege().toLowerCase().replace(/[^a-z0-9]/g, "") || "college"}.edu`}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
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

        {/* Clean Slate vs Demo toggle option */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)]/60 border border-[var(--border)] text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={startFreshClean}
              onChange={(e) => setStartFreshClean(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 rounded border-[var(--border)]"
            />
            <span className="font-medium text-[var(--foreground)]">
              Start fresh clean account (0 rows, no Karthik Raj info)
            </span>
          </label>
          <button
            type="button"
            onClick={handleEraseToCleanState}
            title="Erase all local cached mock data"
            className="p-1 rounded hover:bg-[var(--border)] text-[var(--muted-foreground)] hover:text-rose-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !!socialLoading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : authMode === "signin" ? (
            <>
              <LogIn className="w-4 h-4" /> Enter {ROLE_CONFIGS[selectedRole].label} Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Register as {ROLE_CONFIGS[selectedRole].label} & Launch
            </>
          )}
        </button>
      </form>
    </div>
  );
}
