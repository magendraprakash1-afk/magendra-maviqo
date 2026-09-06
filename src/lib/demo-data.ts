// ─── Demo Data for MVP ──────────────────────────────────────────────────────
// This file provides realistic seed data for all dashboards so the app
// looks populated without needing a Supabase connection.

import { DEFAULT_COLLEGE } from "@/lib/constants";

export const demoUser = {
  id: "usr_001",
  name: "Karthik Raj",
  email: "karthik.raj@maviqo.edu",
  role: "student" as const,
  avatar: null,
  department: "Computer Science & Engineering",
  program: "B.Tech CSE",
  semester: 5,
  rollNumber: "22CSE101",
  section: "A",
  collegeId: "col_001",
  collegeName: DEFAULT_COLLEGE,
};

export const demoFaculty = {
  id: "fac_001",
  name: "Dr. Priya Lakshmi",
  email: "priya.lakshmi@maviqo.edu",
  role: "faculty" as const,
  department: "Computer Science & Engineering",
  designation: "Associate Professor",
  employeeId: "FAC2024001",
};

export const demoTodayClasses = [
  { id: "1", subject: "Data Structures", code: "CS3301", time: "09:00 - 09:50", room: "LH-201", faculty: "Dr. Priya Lakshmi", status: "completed" as const },
  { id: "2", subject: "Database Management", code: "CS3302", time: "10:00 - 10:50", room: "LH-201", faculty: "Prof. Suresh Kumar", status: "completed" as const },
  { id: "3", subject: "Operating Systems", code: "CS3303", time: "11:00 - 11:50", room: "LH-202", faculty: "Dr. Meena Devi", status: "ongoing" as const },
  { id: "4", subject: "Computer Networks", code: "CS3304", time: "14:00 - 14:50", room: "LH-201", faculty: "Prof. Rajesh Babu", status: "upcoming" as const },
  { id: "5", subject: "Software Engineering", code: "CS3305", time: "15:00 - 15:50", room: "Lab-3", faculty: "Dr. Anand Raj", status: "upcoming" as const },
];

export const demoAttendance = {
  overall: 87.5,
  subjects: [
    { subject: "Data Structures", code: "CS3301", present: 38, total: 42, percentage: 90.5 },
    { subject: "Database Management", code: "CS3302", present: 35, total: 40, percentage: 87.5 },
    { subject: "Operating Systems", code: "CS3303", present: 33, total: 38, percentage: 86.8 },
    { subject: "Computer Networks", code: "CS3304", present: 30, total: 36, percentage: 83.3 },
    { subject: "Software Engineering", code: "CS3305", present: 28, total: 35, percentage: 80.0 },
    { subject: "Discrete Mathematics", code: "MA3301", present: 36, total: 40, percentage: 90.0 },
  ],
  monthlyTrend: [
    { month: "Jun", percentage: 92 },
    { month: "Jul", percentage: 88 },
    { month: "Aug", percentage: 85 },
    { month: "Sep", percentage: 87 },
  ],
};

export const demoPendingAssignments = [
  { id: "asg_001", title: "Binary Tree Implementation", subject: "Data Structures", dueDate: "2026-09-06", status: "pending" as const, type: "coding" },
  { id: "asg_002", title: "ER Diagram - Library System", subject: "Database Management", dueDate: "2026-09-08", status: "pending" as const, type: "diagram" },
  { id: "asg_003", title: "Process Scheduling Simulation", subject: "Operating Systems", dueDate: "2026-09-10", status: "submitted" as const, type: "report" },
];

export const demoUpcomingExams = [
  { id: "exam_001", subject: "Data Structures", code: "CS3301", date: "2026-09-15", time: "09:30 AM", type: "Internal Assessment 2", venue: "Hall A" },
  { id: "exam_002", subject: "Database Management", code: "CS3302", date: "2026-09-17", time: "09:30 AM", type: "Internal Assessment 2", venue: "Hall B" },
  { id: "exam_003", subject: "Operating Systems", code: "CS3303", date: "2026-09-19", time: "09:30 AM", type: "Internal Assessment 2", venue: "Hall A" },
];

export const demoResults = {
  currentSemester: {
    semester: 4,
    gpa: 8.6,
    subjects: [
      { subject: "Object Oriented Programming", code: "CS2401", grade: "A+", credits: 4, gradePoint: 9 },
      { subject: "Data Communication", code: "CS2402", grade: "A", credits: 3, gradePoint: 8 },
      { subject: "Theory of Computation", code: "CS2403", grade: "A+", credits: 4, gradePoint: 9 },
      { subject: "Microprocessors", code: "CS2404", grade: "A", credits: 4, gradePoint: 8 },
      { subject: "Environmental Science", code: "GE2401", grade: "O", credits: 2, gradePoint: 10 },
    ],
  },
  cgpa: 8.45,
  semesterGPAs: [
    { semester: 1, gpa: 8.2 },
    { semester: 2, gpa: 8.5 },
    { semester: 3, gpa: 8.6 },
    { semester: 4, gpa: 8.6 },
  ],
};

export const demoFeeStatus = {
  totalFee: 125000,
  paid: 75000,
  pending: 50000,
  dueDate: "2026-10-15",
  payments: [
    { id: "pay_001", amount: 50000, date: "2026-06-15", method: "UPI", status: "completed" as const, receipt: "REC-2026-001" },
    { id: "pay_002", amount: 25000, date: "2026-08-01", method: "Net Banking", status: "completed" as const, receipt: "REC-2026-002" },
  ],
};

export const demoNotifications = [
  { id: "not_001", title: "Internal Assessment 2 Schedule Released", message: "IA-2 exams will be conducted from Sep 15-20. Check exam schedule.", time: "2 hours ago", type: "exam" as const, read: false },
  { id: "not_002", title: "Assignment Deadline Extended", message: "Binary Tree Implementation deadline extended to Sep 6.", time: "5 hours ago", type: "assignment" as const, read: false },
  { id: "not_003", title: "Placement Drive: TCS", message: "TCS campus placement drive on Sep 25. Eligible: 7.0+ CGPA.", time: "1 day ago", type: "placement" as const, read: true },
  { id: "not_004", title: "Fee Payment Reminder", message: "Second installment due by Oct 15, 2026.", time: "2 days ago", type: "fee" as const, read: true },
  { id: "not_005", title: "Hackathon Registration Open", message: "National level hackathon. Register before Sep 20.", time: "3 days ago", type: "event" as const, read: true },
];

export const demoPlacementOpportunities = [
  { id: "plc_001", company: "TCS", role: "Software Developer", package: "7.5 LPA", deadline: "2026-09-20", eligibility: "7.0+ CGPA", status: "open" as const },
  { id: "plc_002", company: "Infosys", role: "Systems Engineer", package: "6.5 LPA", deadline: "2026-09-25", eligibility: "6.5+ CGPA", status: "open" as const },
  { id: "plc_003", company: "Wipro", role: "Project Engineer", package: "6.0 LPA", deadline: "2026-10-01", eligibility: "6.0+ CGPA", status: "upcoming" as const },
];

// ─── Faculty Demo Data ──────────────────────────────────────────────────────
export const demoFacultyClasses = [
  { id: "cls_001", subject: "Data Structures", code: "CS3301", section: "A", semester: 5, students: 62, room: "LH-201", time: "09:00 - 09:50", day: "Monday" },
  { id: "cls_002", subject: "Data Structures", code: "CS3301", section: "B", semester: 5, students: 58, room: "LH-203", time: "10:00 - 10:50", day: "Monday" },
  { id: "cls_003", subject: "Algorithm Design", code: "CS3501", section: "A", semester: 7, students: 45, room: "LH-301", time: "11:00 - 11:50", day: "Tuesday" },
];

export const demoFacultyStats = {
  totalStudents: 165,
  classesToday: 4,
  pendingEvaluations: 23,
  averageAttendance: 84.2,
  assignmentsCreated: 12,
  upcomingExams: 3,
};

// ─── Admin Demo Data ────────────────────────────────────────────────────────
export const demoAdminStats = {
  totalStudents: 3250,
  totalFaculty: 185,
  totalDepartments: 12,
  totalPrograms: 24,
  overallAttendance: 86.5,
  feeCollection: 82000000,
  pendingFees: 18000000,
  placementPercentage: 78.5,
  activeStudents: 3180,
  newAdmissions: 420,
};

export const demoDepartments = [
  { id: "dept_001", name: "Computer Science & Engineering", code: "CSE", hod: "Dr. Ramesh Kumar", faculty: 28, students: 520, programs: 3 },
  { id: "dept_002", name: "Electronics & Communication", code: "ECE", hod: "Dr. Lakshmi Priya", faculty: 24, students: 480, programs: 2 },
  { id: "dept_003", name: "Mechanical Engineering", code: "MECH", hod: "Dr. Srinivasan R", faculty: 22, students: 440, programs: 2 },
  { id: "dept_004", name: "Electrical & Electronics", code: "EEE", hod: "Dr. Vijayalakshmi S", faculty: 20, students: 380, programs: 2 },
  { id: "dept_005", name: "Civil Engineering", code: "CIVIL", hod: "Dr. Muthu Ganesh", faculty: 18, students: 340, programs: 2 },
  { id: "dept_006", name: "Information Technology", code: "IT", hod: "Dr. Kavitha M", faculty: 22, students: 400, programs: 2 },
  { id: "dept_007", name: "Artificial Intelligence & Data Science", code: "AIDS", hod: "Dr. Arun Prasad", faculty: 16, students: 280, programs: 1 },
  { id: "dept_008", name: "Computer Science & Business Systems", code: "CSBS", hod: "Dr. Deepa R", faculty: 14, students: 240, programs: 1 },
];

export const demoManagementStats = {
  totalRevenue: 285000000,
  monthlyRevenue: [
    { month: "Apr", amount: 45000000 },
    { month: "May", amount: 38000000 },
    { month: "Jun", amount: 52000000 },
    { month: "Jul", amount: 28000000 },
    { month: "Aug", amount: 32000000 },
    { month: "Sep", amount: 25000000 },
  ],
  departmentPerformance: [
    { department: "CSE", attendance: 89.2, passPercentage: 94.5, placement: 85.2 },
    { department: "ECE", attendance: 86.5, passPercentage: 91.2, placement: 78.5 },
    { department: "MECH", attendance: 84.3, passPercentage: 88.7, placement: 72.1 },
    { department: "EEE", attendance: 85.1, passPercentage: 90.3, placement: 75.8 },
    { department: "IT", attendance: 87.8, passPercentage: 93.1, placement: 82.4 },
    { department: "AIDS", attendance: 90.1, passPercentage: 95.2, placement: 88.5 },
  ],
  studentStrength: [
    { year: "2023", count: 2800 },
    { year: "2024", count: 3050 },
    { year: "2025", count: 3180 },
    { year: "2026", count: 3250 },
  ],
};

// ─── Timetable Data ─────────────────────────────────────────────────────────
export const demoWeeklyTimetable = {
  Monday: [
    { period: 1, time: "09:00 - 09:50", subject: "Data Structures", code: "CS3301", faculty: "Dr. Priya Lakshmi", room: "LH-201", type: "lecture" as const },
    { period: 2, time: "10:00 - 10:50", subject: "Database Management", code: "CS3302", faculty: "Prof. Suresh Kumar", room: "LH-201", type: "lecture" as const },
    { period: 3, time: "11:00 - 11:50", subject: "Operating Systems", code: "CS3303", faculty: "Dr. Meena Devi", room: "LH-202", type: "lecture" as const },
    { period: 4, time: "11:50 - 12:40", subject: null, code: null, faculty: null, room: null, type: "break" as const },
    { period: 5, time: "14:00 - 14:50", subject: "Computer Networks", code: "CS3304", faculty: "Prof. Rajesh Babu", room: "LH-201", type: "lecture" as const },
    { period: 6, time: "15:00 - 15:50", subject: "Software Engineering", code: "CS3305", faculty: "Dr. Anand Raj", room: "Lab-3", type: "lab" as const },
  ],
  Tuesday: [
    { period: 1, time: "09:00 - 09:50", subject: "Discrete Mathematics", code: "MA3301", faculty: "Prof. Lakshmi S", room: "LH-201", type: "lecture" as const },
    { period: 2, time: "10:00 - 10:50", subject: "Data Structures", code: "CS3301", faculty: "Dr. Priya Lakshmi", room: "LH-201", type: "lecture" as const },
    { period: 3, time: "11:00 - 12:50", subject: "DS Lab", code: "CS3311", faculty: "Dr. Priya Lakshmi", room: "Lab-1", type: "lab" as const },
    { period: 4, time: "14:00 - 14:50", subject: "Operating Systems", code: "CS3303", faculty: "Dr. Meena Devi", room: "LH-202", type: "lecture" as const },
    { period: 5, time: "15:00 - 15:50", subject: "Computer Networks", code: "CS3304", faculty: "Prof. Rajesh Babu", room: "LH-201", type: "lecture" as const },
  ],
  Wednesday: [
    { period: 1, time: "09:00 - 09:50", subject: "Software Engineering", code: "CS3305", faculty: "Dr. Anand Raj", room: "LH-201", type: "lecture" as const },
    { period: 2, time: "10:00 - 10:50", subject: "Database Management", code: "CS3302", faculty: "Prof. Suresh Kumar", room: "LH-201", type: "lecture" as const },
    { period: 3, time: "11:00 - 12:50", subject: "DBMS Lab", code: "CS3312", faculty: "Prof. Suresh Kumar", room: "Lab-2", type: "lab" as const },
    { period: 4, time: "14:00 - 14:50", subject: "Discrete Mathematics", code: "MA3301", faculty: "Prof. Lakshmi S", room: "LH-201", type: "lecture" as const },
    { period: 5, time: "15:00 - 15:50", subject: "Data Structures", code: "CS3301", faculty: "Dr. Priya Lakshmi", room: "LH-201", type: "lecture" as const },
  ],
  Thursday: [
    { period: 1, time: "09:00 - 09:50", subject: "Operating Systems", code: "CS3303", faculty: "Dr. Meena Devi", room: "LH-202", type: "lecture" as const },
    { period: 2, time: "10:00 - 10:50", subject: "Computer Networks", code: "CS3304", faculty: "Prof. Rajesh Babu", room: "LH-201", type: "lecture" as const },
    { period: 3, time: "11:00 - 11:50", subject: "Database Management", code: "CS3302", faculty: "Prof. Suresh Kumar", room: "LH-201", type: "lecture" as const },
    { period: 4, time: "14:00 - 15:50", subject: "OS Lab", code: "CS3313", faculty: "Dr. Meena Devi", room: "Lab-1", type: "lab" as const },
  ],
  Friday: [
    { period: 1, time: "09:00 - 09:50", subject: "Data Structures", code: "CS3301", faculty: "Dr. Priya Lakshmi", room: "LH-201", type: "lecture" as const },
    { period: 2, time: "10:00 - 10:50", subject: "Software Engineering", code: "CS3305", faculty: "Dr. Anand Raj", room: "LH-201", type: "lecture" as const },
    { period: 3, time: "11:00 - 11:50", subject: "Discrete Mathematics", code: "MA3301", faculty: "Prof. Lakshmi S", room: "LH-201", type: "lecture" as const },
    { period: 4, time: "14:00 - 14:50", subject: "Computer Networks", code: "CS3304", faculty: "Prof. Rajesh Babu", room: "LH-201", type: "lecture" as const },
    { period: 5, time: "15:00 - 15:50", subject: "Operating Systems", code: "CS3303", faculty: "Dr. Meena Devi", room: "LH-202", type: "lecture" as const },
  ],
  Saturday: [
    { period: 1, time: "09:00 - 09:50", subject: "Discrete Mathematics", code: "MA3301", faculty: "Prof. Lakshmi S", room: "LH-201", type: "lecture" as const },
    { period: 2, time: "10:00 - 10:50", subject: "Software Engineering", code: "CS3305", faculty: "Dr. Anand Raj", room: "LH-201", type: "lecture" as const },
  ],
};

// ─── HOD Demo Data ──────────────────────────────────────────────────────────
export const demoHODStats = {
  totalFaculty: 28,
  totalStudents: 520,
  averageAttendance: 87.3,
  passPercentage: 94.5,
  activeSubjects: 42,
  labsAvailable: 6,
};

// ─── Parent Demo Data ───────────────────────────────────────────────────────
export const demoParentChild = {
  name: "Karthik Raj",
  rollNumber: "22CSE101",
  rollNo: "22CSE101",
  section: "A",
  department: "Computer Science & Engineering",
  semester: 5,
  attendance: 87.5,
  cgpa: 8.45,
  pendingFees: 50000,
  nextExam: "Data Structures - Sep 15",
};

export const demoTimetable = demoWeeklyTimetable;

export const demoStudentSubjects = [
  { code: "CS3501", name: "Design & Analysis of Algorithms", credits: 4, type: "Core Theory", faculty: "Dr. Priya Sharma" },
  { code: "CS3502", name: "Operating Systems", credits: 3, type: "Core Theory", faculty: "Prof. Suresh Kumar" },
  { code: "CS3503", name: "Database Management Systems", credits: 3, type: "Core Theory", faculty: "Dr. Ananya Ray" },
  { code: "CS3504", name: "Artificial Intelligence", credits: 3, type: "Professional Elective", faculty: "Dr. Ramesh Kumar" },
  { code: "CS3511", name: "Algorithms Laboratory", credits: 2, type: "Practical Lab", faculty: "Dr. Priya Sharma" },
  { code: "CS3512", name: "DBMS Laboratory", credits: 2, type: "Practical Lab", faculty: "Dr. Ananya Ray" },
];

export const demoEvents = [
  {
    id: "ev_1",
    title: "HackMaviqo 2026: 36-Hour National AI Hackathon",
    category: "Hackathon",
    date: "2026-09-24",
    time: "09:00 AM",
    venue: "Main Auditorium & Innovation Center",
    description: "Build cutting-edge agentic AI and multi-agent solutions. Cash pool ₹2,50,000 and direct internship interviews with Tier-1 tech partners.",
    registeredCount: 340,
  },
  {
    id: "ev_2",
    title: "InnovateX: Annual Technical Symposium",
    category: "Symposium",
    date: "2026-10-04",
    time: "10:00 AM",
    venue: "CSE Tech Park Block",
    description: "Flagship technical paper presentation, algorithmic coding sprint, and autonomous robotics arena contest.",
    registeredCount: 420,
  },
  {
    id: "ev_3",
    title: "Industry Guest Lecture: Cloud-Native Microservices",
    category: "Guest Lecture",
    date: "2026-09-18",
    time: "02:00 PM",
    venue: "Seminar Hall 2",
    description: "Keynote presentation by Principal Cloud Architect on Kubernetes container orchestration and serverless scaling.",
    registeredCount: 180,
  },
];

export const demoPlacements = [
  {
    id: "plc_1",
    company: "Google India",
    role: "Software Engineering Intern (Summer 2027)",
    package: "₹1,25,000 / month",
    location: "Bangalore / Hyderabad",
    eligibility: "B.E. CSE / AIDS with CGPA ≥ 8.5",
    deadline: "2026-09-20",
  },
  {
    id: "plc_2",
    company: "Microsoft IDC",
    role: "Associate Software Engineer",
    package: "₹44.5 LPA",
    location: "Hyderabad",
    eligibility: "All Circuit Branches, CGPA ≥ 8.0",
    deadline: "2026-09-28",
  },
  {
    id: "plc_3",
    company: "Zoho Corporation",
    role: "Product Developer (Full Stack)",
    package: "₹14.0 LPA",
    location: "Chennai / Tenkasi",
    eligibility: "Any Degree, No standing arrears",
    deadline: "2026-10-05",
  },
  {
    id: "plc_4",
    company: "Infosys Technologies",
    role: "Specialist Programmer (Power Programmer)",
    package: "₹9.5 LPA",
    location: "Mysore / Chennai",
    eligibility: "CGPA ≥ 7.0 in graduation",
    deadline: "2026-10-12",
  },
];

