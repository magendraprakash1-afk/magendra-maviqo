"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Search, UserPlus, Users, Filter, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "hod" | "admin" | "management" | "parent";
  department: string;
  status: "active" | "inactive";
  joinedDate: string;
}

const allUsers: UserRow[] = [
  { id: "u1", name: "Karthik Raj", email: "karthik@maviqo.edu", role: "student", department: "CSE", status: "active", joinedDate: "Aug 2022" },
  { id: "u2", name: "Dr. Priya Lakshmi", email: "priya@maviqo.edu", role: "faculty", department: "CSE", status: "active", joinedDate: "Jun 2018" },
  { id: "u3", name: "Dr. Ramesh Kumar", email: "ramesh@maviqo.edu", role: "hod", department: "CSE", status: "active", joinedDate: "Jan 2015" },
  { id: "u4", name: "Arun Shankar", email: "admin@maviqo.edu", role: "admin", department: "Administration", status: "active", joinedDate: "Sep 2020" },
  { id: "u5", name: "Dr. Venkatesh R", email: "management@maviqo.edu", role: "management", department: "Management", status: "active", joinedDate: "Jan 2010" },
  { id: "u6", name: "Rajesh Raj", email: "parent@maviqo.edu", role: "parent", department: "N/A", status: "active", joinedDate: "Aug 2022" },
  { id: "u7", name: "Ananya Sharma", email: "ananya@maviqo.edu", role: "student", department: "CSE", status: "active", joinedDate: "Aug 2022" },
  { id: "u8", name: "Prof. Suresh K", email: "suresh@maviqo.edu", role: "faculty", department: "IT", status: "active", joinedDate: "Jul 2019" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="User Management" subtitle="Manage students, faculty, staff, and parent accounts">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25">
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--muted)] border border-transparent text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {["all", "student", "faculty", "hod", "admin", "parent"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors",
                roleFilter === r
                  ? "bg-primary-500 text-white"
                  : "bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)]"
              )}
            >
              {r === "all" ? "All Roles" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-center p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Department</th>
                <th className="text-center p-4 font-medium">Status</th>
                <th className="text-center p-4 font-medium">Joined</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase",
                        u.role === "student" && "bg-blue-500/10 text-blue-500",
                        u.role === "faculty" && "bg-violet-500/10 text-violet-500",
                        u.role === "hod" && "bg-indigo-500/10 text-indigo-500",
                        u.role === "admin" && "bg-emerald-500/10 text-emerald-500",
                        u.role === "management" && "bg-amber-500/10 text-amber-500",
                        u.role === "parent" && "bg-rose-500/10 text-rose-500"
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)]">{u.department}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="p-4 text-center text-xs text-[var(--muted-foreground)]">{u.joinedDate}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
                      <MoreVertical className="w-4 h-4 text-[var(--muted-foreground)]" />
                    </button>
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
