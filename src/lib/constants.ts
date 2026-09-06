// ─── Role Definitions ───────────────────────────────────────────────────────
export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  HOD: "hod",
  ADMIN: "admin",
  MANAGEMENT: "management",
  PARENT: "parent",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  faculty: "Faculty",
  hod: "Head of Department",
  admin: "Administrator",
  management: "Management",
  parent: "Parent",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  student: "bg-blue-500",
  faculty: "bg-violet-500",
  hod: "bg-indigo-500",
  admin: "bg-emerald-500",
  management: "bg-amber-500",
  parent: "bg-rose-500",
};

// ─── Dashboard Routes ───────────────────────────────────────────────────────
export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  student: "/student/dashboard",
  faculty: "/faculty/dashboard",
  hod: "/hod/dashboard",
  admin: "/admin/dashboard",
  management: "/management/dashboard",
  parent: "/parent/dashboard",
};

// ─── Navigation Items per Role ──────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { label: "Attendance", href: "/student/attendance", icon: "CalendarCheck" },
  { label: "Timetable", href: "/student/timetable", icon: "Clock" },
  { label: "Assignments", href: "/student/assignments", icon: "FileText" },
  { label: "Exams", href: "/student/exams", icon: "GraduationCap" },
  { label: "Results", href: "/student/results", icon: "Trophy" },
  { label: "Fees", href: "/student/fees", icon: "CreditCard" },
  { label: "Notifications", href: "/student/notifications", icon: "Bell" },
  { label: "AI Assistant", href: "/student/ai-assistant", icon: "Bot" },
  { label: "Profile", href: "/student/profile", icon: "User" },
];

export const FACULTY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/faculty/dashboard", icon: "LayoutDashboard" },
  { label: "Classes", href: "/faculty/classes", icon: "Users" },
  { label: "Attendance", href: "/faculty/attendance", icon: "CalendarCheck" },
  { label: "Timetable", href: "/faculty/timetable", icon: "Clock" },
  { label: "Assignments", href: "/faculty/assignments", icon: "FileText" },
  { label: "Exams", href: "/faculty/exams", icon: "GraduationCap" },
  { label: "Students", href: "/faculty/students", icon: "UserCheck" },
  { label: "Analytics", href: "/faculty/analytics", icon: "BarChart3" },
  { label: "Notifications", href: "/faculty/notifications", icon: "Bell" },
  { label: "Profile", href: "/faculty/profile", icon: "User" },
];

export const HOD_NAV: NavItem[] = [
  { label: "Dashboard", href: "/hod/dashboard", icon: "LayoutDashboard" },
  { label: "Faculty", href: "/hod/faculty", icon: "Users" },
  { label: "Students", href: "/hod/students", icon: "GraduationCap" },
  { label: "Attendance", href: "/hod/attendance", icon: "CalendarCheck" },
  { label: "Subjects", href: "/hod/subjects", icon: "BookOpen" },
  { label: "Timetable", href: "/hod/timetable", icon: "Clock" },
  { label: "Reports", href: "/hod/reports", icon: "FileBarChart" },
  { label: "Profile", href: "/hod/profile", icon: "User" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Departments", href: "/admin/departments", icon: "Building2" },
  { label: "Programs", href: "/admin/programs", icon: "BookOpen" },
  { label: "Subjects", href: "/admin/subjects", icon: "Library" },
  { label: "Timetable", href: "/admin/timetable", icon: "Clock" },
  { label: "Attendance", href: "/admin/attendance", icon: "CalendarCheck" },
  { label: "Exams", href: "/admin/exams", icon: "GraduationCap" },
  { label: "Fees", href: "/admin/fees", icon: "CreditCard" },
  { label: "Notifications", href: "/admin/notifications", icon: "Bell" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export const MANAGEMENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/management/dashboard", icon: "LayoutDashboard" },
  { label: "Analytics", href: "/management/analytics", icon: "BarChart3" },
  { label: "Departments", href: "/management/departments", icon: "Building2" },
  { label: "Financial", href: "/management/financial", icon: "IndianRupee" },
  { label: "Profile", href: "/management/profile", icon: "User" },
];

export const PARENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/parent/dashboard", icon: "LayoutDashboard" },
  { label: "Attendance", href: "/parent/attendance", icon: "CalendarCheck" },
  { label: "Results", href: "/parent/results", icon: "Trophy" },
  { label: "Fees", href: "/parent/fees", icon: "CreditCard" },
  { label: "Timetable", href: "/parent/timetable", icon: "Clock" },
  { label: "Notifications", href: "/parent/notifications", icon: "Bell" },
  { label: "Profile", href: "/parent/profile", icon: "User" },
];

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: STUDENT_NAV,
  faculty: FACULTY_NAV,
  hod: HOD_NAV,
  admin: ADMIN_NAV,
  management: MANAGEMENT_NAV,
  parent: PARENT_NAV,
};

// ─── App Metadata ───────────────────────────────────────────────────────────
export const APP_NAME = "Maviqo";
export const APP_DESCRIPTION = "AI-Powered College Management Platform";
export const APP_VERSION = "1.0.0";

// ─── Academic Constants ─────────────────────────────────────────────────────
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const GRADE_POINTS: Record<string, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  F: 0,
  RA: 0,
};

export const ATTENDANCE_THRESHOLD = 75;
export const LOW_ATTENDANCE_WARNING = 80;

// ─── Real & Authentic Institutional Directory ──────────────────────────────
export const COLLEGES = [
  "Indian Institute of Technology (IIT), Madras",
  "College of Engineering, Guindy (CEG), Anna University",
  "National Institute of Technology (NIT), Tiruchirappalli",
  "PSG College of Technology, Coimbatore",
  "Coimbatore Institute of Technology (CIT)",
  "Sri Sivasubramaniya Nadar (SSN) College of Engineering, Chennai",
  "Vellore Institute of Technology (VIT), Vellore",
  "Madras Institute of Technology (MIT), Chromepet",
  "Thiagarajar College of Engineering (TCE), Madurai",
  "Government College of Technology (GCT), Coimbatore",
  "Kumaraguru College of Technology (KCT), Coimbatore",
  "Amrita Vishwa Vidyapeetham, Coimbatore",
  "SRM Institute of Science and Technology, Kattankulathur",
  "SASTRA Deemed to be University, Thanjavur",
  "Bannari Amman Institute of Technology (BIT), Sathyamangalam",
  "Sri Krishna College of Engineering and Technology (SKCET), Coimbatore",
  "Kongu Engineering College (KEC), Perundurai",
  "Rajalakshmi Engineering College (REC), Chennai",
  "St. Joseph's College of Engineering, Chennai",
  "Sri Venkateswara College of Engineering (SVCE), Sriperumbudur",
  "Indian Institute of Science (IISc), Bangalore",
  "Indian Institute of Technology (IIT), Bombay",
  "Indian Institute of Technology (IIT), Delhi",
  "Birla Institute of Technology and Science (BITS), Pilani",
  "National Institute of Technology (NIT), Surathkal",
  "Delhi Technological University (DTU), Delhi",
  "Stanford University",
  "Massachusetts Institute of Technology (MIT)",
  "Harvard University",
  "Oxford University",
  "Other Institution (Type Custom)...",
];

export const DEFAULT_COLLEGE = COLLEGES[0];
