import { isSupabaseConfigured, createClient } from "./supabase/client";
import {
  demoAttendance,
  demoFeeStatus,
  demoNotifications,
  demoDepartments,
  demoEvents,
  demoPlacements,
} from "./demo-data";
import type { UserRole } from "./constants";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AttendanceRecordItem {
  id: string;
  rollNo: string;
  name: string;
  status: "present" | "absent" | "late";
}

export interface AttendanceSession {
  id: string;
  classId: string;
  subject: string;
  date: string;
  period: number;
  topic: string;
  records: AttendanceRecordItem[];
  recordedAt: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  code: string;
  section: string;
  dueDate: string;
  maxMarks: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  status: "active" | "closed";
  studentSubmission?: {
    submittedAt: string;
    fileUrl?: string;
    marksObtained?: number;
    status: "submitted" | "graded";
  };
}

export interface FeeState {
  totalFee: number;
  paid: number;
  pending: number;
  dueDate: string;
  payments: Array<{
    id: string;
    amount: number;
    date: string;
    receipt: string;
    method: string;
    status: string;
  }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "exam" | "assignment" | "placement" | "fee" | "event" | "general";
  targetRole?: string;
  read: boolean;
}

// ─── Local Storage Keys ──────────────────────────────────────────────────────
const STORAGE_KEYS = {
  ATTENDANCE_SESSIONS: "maviqo_attendance_sessions",
  ATTENDANCE_OVERVIEW: "maviqo_attendance_overview",
  ASSIGNMENTS: "maviqo_assignments",
  FEES: "maviqo_fees",
  NOTIFICATIONS: "maviqo_notifications",
  TIMETABLE: "maviqo_timetable",
  LAST_SYNC: "maviqo_last_supabase_sync",
};

// ─── Storage Helpers ─────────────────────────────────────────────────────────

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("maviqo_datastore_change"));
  } catch (e) {
    console.warn("Storage quota exceeded or unavailable:", e);
  }
}

// ─── Initial Data Setup ──────────────────────────────────────────────────────

function getInitialAssignments(): AssignmentItem[] {
  return [
    {
      id: "asg_1",
      title: "Dynamic Programming Problem Set",
      subject: "Design & Analysis of Algorithms",
      code: "CS3501",
      section: "A",
      dueDate: "2026-09-15",
      maxMarks: 50,
      totalSubmissions: 58,
      gradedSubmissions: 45,
      status: "active",
      studentSubmission: undefined,
    },
    {
      id: "asg_2",
      title: "Process Scheduling Algorithms Simulator",
      subject: "Operating Systems",
      code: "CS3502",
      section: "A",
      dueDate: "2026-09-18",
      maxMarks: 100,
      totalSubmissions: 52,
      gradedSubmissions: 20,
      status: "active",
      studentSubmission: undefined,
    },
    {
      id: "asg_3",
      title: "B+ Tree Indexing Case Study",
      subject: "Database Management Systems",
      code: "CS3503",
      section: "A",
      dueDate: "2026-08-30",
      maxMarks: 25,
      totalSubmissions: 60,
      gradedSubmissions: 60,
      status: "closed",
      studentSubmission: {
        submittedAt: "2026-08-28",
        marksObtained: 24,
        status: "graded",
      },
    },
  ];
}

// ─── Data Store Service ──────────────────────────────────────────────────────

export const DataStore = {
  // ── Sync from Supabase ───────────────────────────────────────────────────
  async syncFromSupabase() {
    if (!isSupabaseConfigured() || typeof window === "undefined") return;

    try {
      const supabase = createClient();

      // 1. Fetch Notifications
      const { data: remoteNotifs, error: notifErr } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!notifErr && remoteNotifs && remoteNotifs.length > 0) {
        const mapped: NotificationItem[] = (remoteNotifs as any[]).map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          type: n.type as NotificationItem["type"],
          targetRole: n.target_role,
          read: n.read ?? false,
        }));
        setStorage(STORAGE_KEYS.NOTIFICATIONS, mapped);
      }

      // 2. Fetch Assignments
      const { data: remoteAsgs, error: asgErr } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!asgErr && remoteAsgs && remoteAsgs.length > 0) {
        const mapped: AssignmentItem[] = (remoteAsgs as any[]).map((a: any) => ({
          id: a.id,
          title: a.title,
          subject: a.subject,
          code: a.code || "",
          section: a.section || "A",
          dueDate: a.due_date || "",
          maxMarks: a.max_marks,
          totalSubmissions: a.total_submissions,
          gradedSubmissions: a.graded_submissions,
          status: (a.status as "active" | "closed") || "active",
        }));
        setStorage(STORAGE_KEYS.ASSIGNMENTS, mapped);
      }

      // 3. Fetch Attendance Sessions
      const { data: remoteSessions, error: sessErr } = await supabase
        .from("attendance_sessions")
        .select("*, records:attendance_records(*)")
        .order("date", { ascending: false });

      if (!sessErr && remoteSessions && remoteSessions.length > 0) {
        const mapped: AttendanceSession[] = (remoteSessions as any[]).map((s: any) => ({
          id: s.id,
          classId: s.class_id || "",
          subject: s.subject,
          date: s.date,
          period: s.period,
          topic: s.topic || "",
          recordedAt: s.recorded_at,
          records: (s.records || []).map((r: any) => ({
            id: String(r.id),
            rollNo: r.roll_no,
            name: r.student_name,
            status: r.status,
          })),
        }));
        setStorage(STORAGE_KEYS.ATTENDANCE_SESSIONS, mapped);
      }

      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn("Supabase background sync check:", e);
    }
  },

  // ── Attendance ───────────────────────────────────────────────────────────
  getAttendanceOverview() {
    return getStorage(STORAGE_KEYS.ATTENDANCE_OVERVIEW, demoAttendance);
  },

  getAttendanceSessions(): AttendanceSession[] {
    return getStorage<AttendanceSession[]>(STORAGE_KEYS.ATTENDANCE_SESSIONS, []);
  },

  async recordAttendanceSession(session: Omit<AttendanceSession, "id" | "recordedAt">) {
    const newSessionId = `sess_${Date.now()}`;
    const newSession: AttendanceSession = {
      ...session,
      id: newSessionId,
      recordedAt: new Date().toISOString(),
    };

    const currentSessions = this.getAttendanceSessions();
    const updatedSessions = [newSession, ...currentSessions];
    setStorage(STORAGE_KEYS.ATTENDANCE_SESSIONS, updatedSessions);

    // Update student-facing attendance overview
    const overview = this.getAttendanceOverview();
    const presentInSession = session.records.filter((r) => r.status === "present").length;
    const totalInSession = session.records.length;

    // Recalculate subject attendance
    const subjectMatch = overview.subjects.find((s) =>
      s.subject.toLowerCase().includes(session.subject.toLowerCase()) ||
      session.subject.toLowerCase().includes(s.subject.toLowerCase())
    );
    if (subjectMatch) {
      subjectMatch.present += presentInSession;
      subjectMatch.total += totalInSession;
      subjectMatch.percentage = Math.round((subjectMatch.present / subjectMatch.total) * 100);
    }

    const totalPresent = overview.subjects.reduce((sum, s) => sum + s.present, 0);
    const totalClasses = overview.subjects.reduce((sum, s) => sum + s.total, 0);
    overview.overall = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 85;

    setStorage(STORAGE_KEYS.ATTENDANCE_OVERVIEW, overview);

    // Persist to Supabase when live
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error: sessErr } = await supabase.from("attendance_sessions").insert({
          id: newSessionId,
          class_id: session.classId,
          subject: session.subject,
          date: session.date,
          period: session.period,
          topic: session.topic,
        });

        if (!sessErr && session.records.length > 0) {
          const recordsToInsert = session.records.map((r) => ({
            session_id: newSessionId,
            roll_no: r.rollNo,
            student_name: r.name,
            status: r.status,
          }));
          await supabase.from("attendance_records").insert(recordsToInsert);
        }
      } catch (err) {
        console.warn("Supabase attendance write fallback:", err);
      }
    }

    return newSession;
  },

  // ── Assignments ──────────────────────────────────────────────────────────
  getAssignments(): AssignmentItem[] {
    return getStorage<AssignmentItem[]>(STORAGE_KEYS.ASSIGNMENTS, getInitialAssignments());
  },

  async createAssignment(asg: Omit<AssignmentItem, "id" | "totalSubmissions" | "gradedSubmissions" | "status">) {
    const newId = `asg_${Date.now()}`;
    const newAsg: AssignmentItem = {
      ...asg,
      id: newId,
      totalSubmissions: 0,
      gradedSubmissions: 0,
      status: "active",
    };

    const current = this.getAssignments();
    const updated = [newAsg, ...current];
    setStorage(STORAGE_KEYS.ASSIGNMENTS, updated);

    // Push notification to students
    this.addNotification({
      title: `New Assignment: ${newAsg.title}`,
      message: `Posted for ${newAsg.subject} (${newAsg.code || "Section " + newAsg.section}). Due: ${newAsg.dueDate}.`,
      type: "assignment",
      targetRole: "student",
    });

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.from("assignments").insert({
          id: newId,
          title: newAsg.title,
          subject: newAsg.subject,
          code: newAsg.code,
          section: newAsg.section,
          due_date: newAsg.dueDate || null,
          max_marks: newAsg.maxMarks,
          status: "active",
        });
      } catch (e) {
        console.warn("Supabase assignment insert error:", e);
      }
    }

    return newAsg;
  },

  submitAssignment(assignmentId: string, submissionData?: { fileUrl?: string }) {
    const list = this.getAssignments();
    const asg = list.find((a) => a.id === assignmentId);
    if (asg) {
      asg.totalSubmissions += 1;
      asg.studentSubmission = {
        submittedAt: new Date().toISOString().split("T")[0],
        fileUrl: submissionData?.fileUrl,
        status: "submitted",
      };
      setStorage(STORAGE_KEYS.ASSIGNMENTS, list);

      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          // Update total submissions count in Supabase
          supabase
            .from("assignments")
            .update({ total_submissions: asg.totalSubmissions })
            .eq("id", assignmentId)
            .then();
        } catch (e) {
          console.warn("Supabase submit update:", e);
        }
      }
    }
    return asg;
  },

  // ── Fees ─────────────────────────────────────────────────────────────────
  getFeeState(): FeeState {
    return getStorage<FeeState>(STORAGE_KEYS.FEES, demoFeeStatus);
  },

  payFee(amount: number, method = "UPI"): FeeState {
    const state = this.getFeeState();
    const actualPay = Math.min(amount, state.pending);
    state.paid += actualPay;
    state.pending -= actualPay;

    const newReceipt = `RCP2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPaymentId = `pay_${Date.now()}`;

    state.payments.unshift({
      id: newPaymentId,
      amount: actualPay,
      date: new Date().toISOString().split("T")[0],
      receipt: newReceipt,
      method,
      status: "Completed",
    });

    setStorage(STORAGE_KEYS.FEES, state);

    this.addNotification({
      title: "Fee Payment Received",
      message: `Payment of ₹${actualPay.toLocaleString("en-IN")} processed successfully via ${method}. Receipt: ${newReceipt}.`,
      type: "fee",
      targetRole: "student",
    });

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }: { data: any }) => {
          if (data?.user) {
            supabase
              .from("payments")
              .insert({
                id: newPaymentId,
                student_id: data.user.id,
                amount: actualPay,
                receipt: newReceipt,
                method,
                status: "completed",
              })
              .then();
          }
        });
      } catch (e) {
        console.warn("Supabase fee payment sync:", e);
      }
    }

    return state;
  },

  // ── Notifications ────────────────────────────────────────────────────────
  getNotifications(role?: UserRole): NotificationItem[] {
    const all = getStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, demoNotifications as NotificationItem[]);
    if (!role || role === "admin") return all;
    return all.filter((n) => !n.targetRole || n.targetRole === "all" || n.targetRole === role);
  },

  addNotification(notif: Omit<NotificationItem, "id" | "time" | "read">) {
    const item: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      time: "Just now",
      read: false,
    };
    const current = this.getNotifications();
    setStorage(STORAGE_KEYS.NOTIFICATIONS, [item, ...current]);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        supabase
          .from("notifications")
          .insert({
            id: item.id,
            title: item.title,
            message: item.message,
            type: item.type,
            target_role: item.targetRole || "all",
            read: false,
          })
          .then();
      } catch (e) {
        console.warn("Supabase notification insert:", e);
      }
    }

    return item;
  },

  markNotificationRead(id: string) {
    const all = this.getNotifications();
    const target = all.find((n) => n.id === id);
    if (target) {
      target.read = true;
      setStorage(STORAGE_KEYS.NOTIFICATIONS, all);

      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          supabase
            .from("notifications")
            .update({ read: true })
            .eq("id", id)
            .then();
        } catch (e) {
          console.warn("Supabase mark read:", e);
        }
      }
    }
  },

  markAllNotificationsRead(role?: UserRole) {
    const all = this.getNotifications();
    all.forEach((n) => {
      if (!role || !n.targetRole || n.targetRole === "all" || n.targetRole === role) {
        n.read = true;
      }
    });
    setStorage(STORAGE_KEYS.NOTIFICATIONS, all);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        supabase
          .from("notifications")
          .update({ read: true })
          .eq("read", false)
          .then();
      } catch (e) {
        console.warn("Supabase mark all read:", e);
      }
    }
  },

  // ── Supplementary Queries ────────────────────────────────────────────────
  getDepartments() {
    return demoDepartments;
  },

  getEvents() {
    return demoEvents;
  },

  getPlacements() {
    return demoPlacements;
  },
};
