"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type UserRole, ROLE_LABELS, DEFAULT_COLLEGE } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data-store";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  department?: string;
  program?: string;
  semester?: number;
  rollNumber?: string;
  section?: string;
  collegeId?: string;
  collegeName?: string;
  designation?: string;
  employeeId?: string;
  socialProvider?: "google" | "apple" | "microsoft" | "email";
  phone?: string;
  advisor?: string;
  batch?: string;
  bloodGroup?: string;
  libraryId?: string;
  cabin?: string;
  officeHours?: string;
  specialization?: string;
  guardianName?: string;
  guardianPhone?: string;
  hostelStatus?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, collegeName?: string, role?: UserRole) => Promise<LoginResult>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, "id">, password: string) => Promise<LoginResult>;
  socialLogin: (provider: "google" | "apple" | "microsoft", role: UserRole, collegeName?: string) => Promise<LoginResult>;
  switchRole: (role: UserRole) => void;
  isLiveSupabase: boolean;
  syncData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial established user accounts with rich dossiers (available as demo / offline fallback)
const INITIAL_USERS: Record<string, User & { passwordHash: string }> = {
  "karthik@maviqo.edu": {
    id: "usr_001",
    name: "Karthik Raj",
    email: "karthik@maviqo.edu",
    passwordHash: "password123",
    role: "student",
    avatar: null,
    department: "Computer Science & Engineering",
    program: "B.Tech Computer Science & Engineering",
    semester: 5,
    rollNumber: "22CSE101",
    section: "A",
    collegeId: "col_001",
    collegeName: DEFAULT_COLLEGE,
    advisor: "Dr. Priya Lakshmi (Assoc. Prof)",
    batch: "2022 - 2026",
    bloodGroup: "O+",
    phone: "+91 98401 23456",
    libraryId: "LIB-2022-101",
    guardianName: "Rajesh Raj",
    guardianPhone: "+91 98401 98765",
    hostelStatus: "Day Scholar (College Bus Route #14)",
  },
  "priya@maviqo.edu": {
    id: "fac_001",
    name: "Dr. Priya Lakshmi",
    email: "priya@maviqo.edu",
    passwordHash: "password123",
    role: "faculty",
    avatar: null,
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    employeeId: "FAC2024001",
    collegeId: "col_001",
    collegeName: DEFAULT_COLLEGE,
    cabin: "Cabin 402, CS Tech Park",
    phone: "+91 98765 43210",
    specialization: "Algorithms, Distributed Systems & Edge AI",
    officeHours: "Mon & Wed: 03:30 PM - 05:00 PM",
  },
  "ramesh@maviqo.edu": {
    id: "hod_001",
    name: "Dr. Ramesh Kumar",
    email: "ramesh@maviqo.edu",
    passwordHash: "password123",
    role: "hod",
    avatar: null,
    department: "Computer Science & Engineering",
    designation: "Professor & HOD",
    employeeId: "FAC2020001",
    collegeId: "col_001",
    collegeName: DEFAULT_COLLEGE,
    cabin: "HOD Chamber, CS Block 1st Floor",
    phone: "+91 98765 11223",
    specialization: "Cloud Computing, Data Analytics",
    officeHours: "Daily: 11:30 AM - 01:00 PM",
  },
  "admin@maviqo.edu": {
    id: "adm_001",
    name: "Arun Shankar",
    email: "admin@maviqo.edu",
    passwordHash: "password123",
    role: "admin",
    avatar: null,
    designation: "System Administrator",
    collegeId: "col_001",
    collegeName: DEFAULT_COLLEGE,
    phone: "+91 98765 99887",
  },
  "management@maviqo.edu": {
    id: "mgt_001",
    name: "Dr. Venkatesh R",
    email: "management@maviqo.edu",
    passwordHash: "password123",
    role: "management",
    avatar: null,
    designation: "Director & Trustee",
    collegeId: "col_001",
    collegeName: DEFAULT_COLLEGE,
    phone: "+91 98765 77665",
  },
  "parent@maviqo.edu": {
    id: "par_001",
    name: "Rajesh Raj",
    email: "parent@maviqo.edu",
    passwordHash: "password123",
    role: "parent",
    avatar: null,
    collegeId: "col_001",
    collegeName: DEFAULT_COLLEGE,
    phone: "+91 98401 98765",
  },
};

const USER_STORAGE_KEY = "maviqo_active_user";
const REGISTERED_ACCOUNTS_KEY = "maviqo_registered_accounts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLiveSupabase = isSupabaseConfigured();

  // Restore session from Supabase or localStorage on initial mount
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      setIsLoading(true);

      // 1. If Supabase is configured, check active Supabase Auth session
      if (isLiveSupabase) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            // Attempt to load profile from public.profiles
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle();

            if (profile && isMounted) {
              const liveUser: User = {
                id: profile.id,
                name: profile.full_name || session.user.email?.split("@")[0] || "User",
                email: profile.email,
                role: (profile.role as UserRole) || "student",
                avatar: profile.avatar_url,
                department: profile.department || undefined,
                program: profile.program || undefined,
                semester: profile.semester || undefined,
                rollNumber: profile.roll_number || undefined,
                section: profile.section || undefined,
                collegeId: profile.college_id || "col_001",
                collegeName: profile.college_name || DEFAULT_COLLEGE,
                designation: profile.designation || undefined,
                employeeId: profile.employee_id || undefined,
                socialProvider: (profile.social_provider as User["socialProvider"]) || "email",
                phone: profile.phone || undefined,
              };

              setUser(liveUser);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(liveUser));
              setIsLoading(false);
              DataStore.syncFromSupabase().catch(console.warn);
              return;
            }
          }
        } catch (err) {
          console.warn("Supabase session restore:", err);
        }
      }

      // 2. Check persistent local storage
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser && isMounted) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else if (isMounted) {
        // Leave unauthenticated on clean launch so user selects their own role/college
        setUser(null);
      }

      if (isMounted) {
        setIsLoading(false);
        // Trigger background sync if Supabase is active
        if (isLiveSupabase) {
          DataStore.syncFromSupabase().catch(console.warn);
        }
      }
    }

    restoreSession();

    // Listen for auth state changes if Supabase is active
    if (isLiveSupabase) {
      try {
        const supabase = createClient();
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
          if (event === "SIGNED_IN" && session?.user && isMounted) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle();

            if (profile) {
              const liveUser: User = {
                id: profile.id,
                name: profile.full_name || session.user.email?.split("@")[0] || "User",
                email: profile.email,
                role: (profile.role as UserRole) || "student",
                avatar: profile.avatar_url,
                department: profile.department || undefined,
                program: profile.program || undefined,
                semester: profile.semester || undefined,
                rollNumber: profile.roll_number || undefined,
                section: profile.section || undefined,
                collegeId: profile.college_id || "col_001",
                collegeName: profile.college_name || DEFAULT_COLLEGE,
                designation: profile.designation || undefined,
                employeeId: profile.employee_id || undefined,
                socialProvider: (profile.social_provider as User["socialProvider"]) || "email",
                phone: profile.phone || undefined,
              };
              setUser(liveUser);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(liveUser));
              DataStore.syncFromSupabase().catch(console.warn);
            }
          } else if (event === "SIGNED_OUT" && isMounted) {
            setUser(null);
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        });

        return () => {
          isMounted = false;
          authListener?.subscription.unsubscribe();
        };
      } catch (e) {
        console.warn("Auth state change listener setup:", e);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isLiveSupabase]);

  // Login Handler (Supabase with Local Fallback)
  const login = async (
    email: string,
    password: string,
    collegeName?: string,
    role?: UserRole
  ): Promise<LoginResult> => {
    setIsLoading(true);

    // 1. If Supabase is live, try authenticating via Supabase Auth
    if (isLiveSupabase) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (!error && data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

          const activeUser: User = {
            id: data.user.id,
            name: profile?.full_name || data.user.email?.split("@")[0] || "User",
            email: data.user.email!,
            role: (profile?.role as UserRole) || role || "student",
            avatar: profile?.avatar_url || null,
            department: profile?.department || undefined,
            program: profile?.program || undefined,
            semester: profile?.semester || undefined,
            rollNumber: profile?.roll_number || undefined,
            section: profile?.section || undefined,
            collegeName: collegeName || profile?.college_name || DEFAULT_COLLEGE,
            socialProvider: "email",
          };

          setUser(activeUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(activeUser));
          setIsLoading(false);
          DataStore.syncFromSupabase().catch(console.warn);
          return { success: true, user: activeUser };
        }
      } catch (err: unknown) {
        console.warn("Supabase auth failed, falling back to local credentials:", err);
      }
    }

    // 2. Local Account Verification & On-the-fly Clean Creation
    await new Promise((r) => setTimeout(r, 300));

    const storedAccounts = JSON.parse(localStorage.getItem(REGISTERED_ACCOUNTS_KEY) || "{}");
    const existingAccount = storedAccounts[email.toLowerCase()] || INITIAL_USERS[email.toLowerCase()];

    if (existingAccount) {
      if (existingAccount.passwordHash && existingAccount.passwordHash !== password) {
        setIsLoading(false);
        return { success: false, error: "Incorrect password. Please verify and try again." };
      }

      const authenticatedUser: User = {
        ...existingAccount,
        collegeName: collegeName || existingAccount.collegeName || DEFAULT_COLLEGE,
        role: role || existingAccount.role,
        socialProvider: "email",
      };

      setUser(authenticatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
      setIsLoading(false);
      return { success: true, user: authenticatedUser };
    }

    // New User Entry -> Clean account with zero pre-filled mock rows
    const targetRole = role || "student";
    const rawName = email.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const chosenCollege = collegeName || DEFAULT_COLLEGE;

    const newCleanUser: User = {
      id: `usr_${Date.now()}`,
      name: formattedName || `New ${ROLE_LABELS[targetRole]}`,
      email: email.toLowerCase(),
      role: targetRole,
      collegeName: chosenCollege,
      department: "Computer Science & Engineering",
      program: targetRole === "student" ? "B.Tech Computer Science & Engineering" : undefined,
      semester: targetRole === "student" ? 1 : undefined,
      section: "A",
      rollNumber: targetRole === "student" ? `2026STU${Math.floor(100 + Math.random() * 900)}` : undefined,
      employeeId: targetRole !== "student" ? `2026${targetRole.toUpperCase().slice(0, 3)}${Math.floor(100 + Math.random() * 900)}` : undefined,
      avatar: null,
      socialProvider: "email",
    };

    storedAccounts[email.toLowerCase()] = { ...newCleanUser, passwordHash: password };
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(storedAccounts));

    // Erase mock rows to start fresh with 0 rows
    DataStore.eraseToCleanState();

    setUser(newCleanUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newCleanUser));
    setIsLoading(false);
    return { success: true, user: newCleanUser };
  };

  // Social Authentication (Google, Apple, Microsoft)
  const socialLogin = async (
    provider: "google" | "apple" | "microsoft",
    role: UserRole,
    collegeName?: string
  ): Promise<LoginResult> => {
    setIsLoading(true);

    const selectedCollege = collegeName || DEFAULT_COLLEGE;
    const providerCapitalized = provider.charAt(0).toUpperCase() + provider.slice(1);
    const collegeSlug = selectedCollege.toLowerCase().replace(/[^a-z0-9]/g, "") || "maviqo";

    await new Promise((r) => setTimeout(r, 350));

    // Fresh user account for social sign-in with chosen role & college
    const socialUser: User = {
      id: `usr_${provider}_${Date.now()}`,
      name: `${ROLE_LABELS[role]} (${providerCapitalized})`,
      email: `${role}.${provider}@${collegeSlug}.edu`,
      role,
      collegeName: selectedCollege,
      socialProvider: provider,
      avatar: null,
      department: "Computer Science & Engineering",
      program: role === "student" ? "B.Tech Computer Science & Engineering" : undefined,
      semester: role === "student" ? 1 : undefined,
      section: "A",
      rollNumber: role === "student" ? `2026STU${Math.floor(100 + Math.random() * 900)}` : undefined,
      employeeId: role !== "student" ? `2026${role.toUpperCase().slice(0, 3)}${Math.floor(100 + Math.random() * 900)}` : undefined,
    };

    // Erase mock rows for fresh social account
    DataStore.eraseToCleanState();

    setUser(socialUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(socialUser));
    setIsLoading(false);
    return { success: true, user: socialUser };
  };

  // Registration Handler
  const register = async (userData: Omit<User, "id">, password: string): Promise<LoginResult> => {
    setIsLoading(true);

    if (isLiveSupabase) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password,
          options: {
            data: {
              first_name: userData.name.split(" ")[0],
              last_name: userData.name.split(" ").slice(1).join(" ") || "",
              role: userData.role,
              college_name: userData.collegeName || DEFAULT_COLLEGE,
              department: userData.department,
              roll_number: userData.rollNumber,
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const registeredUser: User = {
            id: data.user.id,
            ...userData,
            socialProvider: "email",
          };

          // Also insert/upsert into public.profiles
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              email: userData.email,
              full_name: userData.name,
              role: userData.role,
              college_name: userData.collegeName || DEFAULT_COLLEGE,
              department: userData.department || null,
              program: userData.program || null,
              semester: userData.semester || null,
              roll_number: userData.rollNumber || null,
              section: userData.section || null,
              phone: userData.phone || null,
            });
          } catch (profileErr) {
            console.warn("Profile table upsert:", profileErr);
          }

          setUser(registeredUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(registeredUser));
          setIsLoading(false);
          DataStore.syncFromSupabase().catch(console.warn);
          return { success: true, user: registeredUser };
        }
      } catch (err: unknown) {
        console.warn("Supabase signUp fallback:", err);
      }
    }

    // Local persistent registration fallback
    const storedAccounts = JSON.parse(localStorage.getItem(REGISTERED_ACCOUNTS_KEY) || "{}");
    if (storedAccounts[userData.email.toLowerCase()] || INITIAL_USERS[userData.email.toLowerCase()]) {
      setIsLoading(false);
      return { success: false, error: "An account with this email address already exists." };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      ...userData,
      passwordHash: password,
      collegeName: userData.collegeName || DEFAULT_COLLEGE,
    };

    storedAccounts[userData.email.toLowerCase()] = newUser;
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(storedAccounts));

    const activeUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      department: newUser.department,
      program: newUser.program,
      semester: newUser.semester,
      rollNumber: newUser.rollNumber,
      section: newUser.section,
      designation: newUser.designation,
      employeeId: newUser.employeeId,
      collegeName: newUser.collegeName,
      advisor: newUser.advisor,
      batch: newUser.batch,
      bloodGroup: newUser.bloodGroup,
      phone: newUser.phone,
      libraryId: newUser.libraryId,
      cabin: newUser.cabin,
      officeHours: newUser.officeHours,
      specialization: newUser.specialization,
      socialProvider: "email",
    };

    setUser(activeUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(activeUser));
    setIsLoading(false);
    return { success: true, user: activeUser };
  };

  // Logout Handler
  const logout = async () => {
    if (isLiveSupabase) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Role Switcher for preview and rapid navigation
  const switchRole = (role: UserRole) => {
    const roleUser = Object.values(INITIAL_USERS).find((u) => u.role === role) || INITIAL_USERS["karthik@maviqo.edu"];
    setUser(roleUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(roleUser));
  };

  const syncData = async () => {
    await DataStore.syncFromSupabase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        socialLogin,
        switchRole,
        isLiveSupabase,
        syncData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
