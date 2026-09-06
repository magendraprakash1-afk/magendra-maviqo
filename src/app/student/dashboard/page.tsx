"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import { DataStore } from "@/lib/data-store";
import {
  demoTodayClasses, demoUpcomingExams, demoResults,
} from "@/lib/demo-data";
import { getGreeting, formatCurrency, formatPercentage, cn } from "@/lib/utils";
import {
  CalendarCheck, Clock, FileText, GraduationCap, CreditCard,
  Trophy, Bell, TrendingUp, ChevronRight, BookOpen, AlertCircle,
  CheckCircle2, Timer, Bot, Sparkles, ArrowRight, Building2,
  AlertTriangle, Hash,
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(() => DataStore.getAttendanceOverview());
  const [assignments, setAssignments] = useState(() => DataStore.getAssignments());
  const [feeStatus, setFeeStatus] = useState(() => DataStore.getFeeState());
  const [notifications, setNotifications] = useState(() => DataStore.getNotifications("student"));
  const [todayClasses, setTodayClasses] = useState(() => DataStore.getTodayClasses());
  const [upcomingExams, setUpcomingExams] = useState(() => DataStore.getUpcomingExams());
  const [results, setResults] = useState(() => DataStore.getResults());
  const [isClean, setIsClean] = useState(() => DataStore.isCleanSlate());

  useEffect(() => {
    const handleSync = () => {
      setAttendance(DataStore.getAttendanceOverview());
      setAssignments(DataStore.getAssignments());
      setFeeStatus(DataStore.getFeeState());
      setNotifications(DataStore.getNotifications("student"));
      setTodayClasses(DataStore.getTodayClasses());
      setUpcomingExams(DataStore.getUpcomingExams());
      setResults(DataStore.getResults());
      setIsClean(DataStore.isCleanSlate());
    };
    window.addEventListener("maviqo_datastore_change", handleSync);
    return () => window.removeEventListener("maviqo_datastore_change", handleSync);
  }, []);

  if (!user) return null;

  const greeting = getGreeting();

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Section with College and Roll No Branding */}
      <div className="relative overflow-hidden rounded-2xl gradient-student p-6 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{user.collegeName || "Sri Maviqo Engineering College"}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 font-mono text-xs font-bold tracking-wide">
              Roll No: {user.rollNumber || "22CSE101"}
            </span>
          </div>

          <p className="text-white/80 text-sm font-medium">{greeting} 👋</p>
          <h2 className="text-2xl font-bold mt-0.5">{user.name}</h2>
          <p className="text-white/70 text-xs mt-1">
            {user.program} • Semester {user.semester} • Section {user.section}
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href="/student/ai-assistant"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-medium transition-colors backdrop-blur-sm shadow-sm"
            >
              <Bot className="w-4 h-4" />
              Ask AI Assistant
            </Link>
            <Link
              href="/student/timetable"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-medium transition-colors"
            >
              <Clock className="w-4 h-4" />
              View Timetable
            </Link>
            <Link
              href="/student/timetable"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-500/30 hover:bg-rose-500/40 rounded-xl text-xs font-medium transition-colors border border-rose-400/30"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              Problem in Timetable?
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      {/* Clean Slate vs Demo Switcher Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs">
        <div className="flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full",
            isClean ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
          )} />
          <span className="font-semibold text-[var(--foreground)]">
            {isClean ? "Clean Account Active (Zero Mock Rows)" : "Demo Sample Data Mode"}
          </span>
          <span className="text-[var(--muted-foreground)] hidden sm:inline">
            • {isClean ? "Starting with fresh slate" : "Pre-populated sample records"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (isClean) {
              DataStore.loadDemoData();
            } else {
              DataStore.eraseToCleanState();
            }
          }}
          className="px-3 py-1 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] font-semibold transition-colors text-[11px]"
        >
          {isClean ? "Load Demo Sample Data" : "Erase to Fresh (0 Rows)"}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Attendance"
          value={attendance.overall > 0 ? formatPercentage(attendance.overall) : "0%"}
          subtitle={attendance.overall > 0 ? "Overall this semester" : "No records yet"}
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="CGPA"
          value={results.cgpa > 0 ? results.cgpa.toFixed(2) : "0.00"}
          subtitle={results.cgpa > 0 ? "Cumulative GPA" : "First semester"}
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(feeStatus.pending)}
          subtitle={feeStatus.pending > 0 ? `Due: ${new Date(feeStatus.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}` : "No dues pending"}
          icon={CreditCard}
          color="rose"
        />
        <StatCard
          title="Assignments"
          value={assignments.filter(a => !a.studentSubmission).length}
          subtitle={assignments.length > 0 ? "Pending submissions" : "Zero pending"}
          icon={FileText}
          color="violet"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold">Today&apos;s Classes</h3>
            </div>
            <Link href="/student/timetable" className="text-sm text-primary-500 hover:underline flex items-center gap-1">
              Full Timetable <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {todayClasses.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted-foreground)] space-y-2">
              <Clock className="w-8 h-8 mx-auto text-primary-500/40" />
              <p className="text-sm font-semibold text-[var(--foreground)]">No Classes Scheduled</p>
              <p className="text-xs">Your timetable has 0 active lectures today. Clean fresh account with no pre-filled rows.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {todayClasses.map((cls) => (
                <div key={cls.id} className="flex items-center gap-4 p-4 hover:bg-[var(--muted)]/50 transition-colors">
                  {/* Time */}
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-medium">{cls.time.split(" - ")[0]}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{cls.time.split(" - ")[1]}</p>
                  </div>
                  {/* Divider */}
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2",
                      cls.status === "completed" && "bg-emerald-500 border-emerald-500",
                      cls.status === "ongoing" && "bg-primary-500 border-primary-500 animate-pulse",
                      cls.status === "upcoming" && "bg-transparent border-[var(--border)]",
                    )} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{cls.subject}</p>
                      {cls.status === "ongoing" && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary-500/10 text-primary-500">LIVE</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {cls.faculty} • {cls.room}
                    </p>
                  </div>
                  {/* Status icon */}
                  <div>
                    {cls.status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {cls.status === "ongoing" && <div className="pulse-dot" />}
                    {cls.status === "upcoming" && <Timer className="w-5 h-5 text-[var(--muted-foreground)]" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links & Notifications */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-sm">Upcoming Exams</h3>
              </div>
              <Link href="/student/exams" className="text-xs text-primary-500 hover:underline">View All</Link>
            </div>
            {upcomingExams.length === 0 ? (
              <div className="p-6 text-center text-[var(--muted-foreground)] space-y-1">
                <GraduationCap className="w-7 h-7 mx-auto text-amber-500/40" />
                <p className="text-xs font-semibold text-[var(--foreground)]">No Upcoming Exams</p>
                <p className="text-[11px]">Exam schedule has not been announced yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {upcomingExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="p-4">
                    <p className="font-medium text-sm">{exam.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[var(--muted-foreground)]">{exam.type}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">•</span>
                      <span className="text-xs font-medium text-amber-500">
                        {new Date(exam.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Assignments */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-500" />
                <h3 className="font-semibold text-sm">Pending Assignments</h3>
              </div>
              <Link href="/student/assignments" className="text-xs text-primary-500 hover:underline">View All</Link>
            </div>
            {assignments.length === 0 ? (
              <div className="p-6 text-center text-[var(--muted-foreground)] space-y-1">
                <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-500/40" />
                <p className="text-xs font-semibold text-[var(--foreground)]">Zero Pending Assignments</p>
                <p className="text-[11px]">All caught up! No assignments due right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {assignments.slice(0, 3).map((asg) => (
                  <div key={asg.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{asg.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{asg.subject}</p>
                      </div>
                      <span className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                        !asg.studentSubmission ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {!asg.studentSubmission ? "Due" : "Submitted"}
                      </span>
                    </div>
                    {!asg.studentSubmission && (
                      <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Due: {new Date(asg.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Overview & Notifications Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Attendance */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Attendance by Subject</h3>
            </div>
            <Link href="/student/attendance" className="text-sm text-primary-500 hover:underline flex items-center gap-1">
              Details <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {attendance.subjects.map((sub) => (
              <div key={sub.code} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate mr-2">{sub.subject}</span>
                  <span className={cn(
                    "font-semibold text-xs px-2 py-0.5 rounded-full",
                    sub.percentage >= 90 ? "attendance-good" :
                    sub.percentage >= 75 ? "attendance-warning" : "attendance-danger"
                  )}>
                    {sub.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      sub.percentage >= 90 ? "bg-emerald-500" :
                      sub.percentage >= 75 ? "bg-amber-500" : "bg-rose-500"
                    )}
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-500" />
              <h3 className="font-semibold">Notifications</h3>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                {notifications.filter(n => !n.read).length}
              </span>
            </div>
            <Link href="/student/notifications" className="text-sm text-primary-500 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {notifications.slice(0, 4).map((notif) => (
              <div key={notif.id} className={cn(
                "p-4 hover:bg-[var(--muted)]/50 transition-colors",
                !notif.read && "bg-primary-500/5"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 w-2 h-2 rounded-full shrink-0",
                    !notif.read ? "bg-primary-500" : "bg-transparent"
                  )} />
                  <div className="min-w-0">
                    <p className={cn("text-sm", !notif.read && "font-medium")}>{notif.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-1">{notif.message}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-primary-600 to-indigo-600 p-6 text-white">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">AI Study Assistant</h3>
            <p className="text-white/80 text-sm mt-0.5">
              Ask questions, generate summaries, create flashcards, and get personalized study plans.
            </p>
          </div>
          <Link
            href="/student/ai-assistant"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
          >
            Start Learning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
      </div>
    </div>
  );
}
