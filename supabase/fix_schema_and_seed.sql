-- ============================================================================
-- Maviqo — AI College Management Platform
-- Complete Fix: Schema Realignment, RLS Fix, & Data Seeding
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/scqofircpnnxbfmgwpid/sql/new
-- ============================================================================

-- 1. DROP ALL EXISTING RECURSIVE POLICIES TO PREVENT 42P17 ERRORS
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- 2. CREATE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. PROFILES TABLE (Aligned with AuthProvider & DataStore)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'hod', 'admin', 'management', 'parent')),
    avatar_url TEXT,
    department TEXT,
    program TEXT,
    semester INT DEFAULT 1,
    roll_number TEXT,
    section TEXT DEFAULT 'A',
    college_id TEXT DEFAULT 'col_001',
    college_name TEXT DEFAULT 'Sri Maviqo Engineering College',
    designation TEXT,
    employee_id TEXT,
    social_provider TEXT DEFAULT 'email',
    phone TEXT,
    advisor TEXT,
    batch TEXT,
    blood_group TEXT,
    library_id TEXT,
    cabin TEXT,
    office_hours TEXT,
    specialization TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    hostel_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all required columns exist in profiles if table already existed
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS program TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS semester INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'A';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_name TEXT DEFAULT 'Sri Maviqo Engineering College';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_provider TEXT DEFAULT 'email';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS advisor TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS library_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cabin TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS office_hours TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS guardian_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS guardian_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hostel_status TEXT;

-- 4. COLLEGES
CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    code TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    hod TEXT,
    faculty_count INT DEFAULT 0,
    student_count INT DEFAULT 0,
    program_count INT DEFAULT 0,
    college_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTENDANCE SESSIONS (Matching DataStore & types.ts)
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id TEXT PRIMARY KEY,
    class_id TEXT,
    subject TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    period INT NOT NULL,
    topic TEXT,
    recorded_by TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.attendance_sessions ADD COLUMN IF NOT EXISTS class_id TEXT;
ALTER TABLE public.attendance_sessions ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.attendance_sessions ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE public.attendance_sessions ADD COLUMN IF NOT EXISTS recorded_by TEXT;
ALTER TABLE public.attendance_sessions ADD COLUMN IF NOT EXISTS recorded_at TIMESTAMPTZ DEFAULT NOW();

-- 7. ATTENDANCE RECORDS (Matching DataStore & types.ts)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    roll_no TEXT NOT NULL,
    student_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'od')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS roll_no TEXT;
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS student_name TEXT;

-- 8. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    code TEXT,
    section TEXT DEFAULT 'A',
    due_date TEXT,
    max_marks INT DEFAULT 100,
    total_submissions INT DEFAULT 0,
    graded_submissions INT DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'A';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS total_submissions INT DEFAULT 0;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS graded_submissions INT DEFAULT 0;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 9. ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id TEXT REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    file_url TEXT,
    marks_obtained NUMERIC(5, 2),
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'general',
    target_role TEXT DEFAULT 'all',
    read BOOLEAN DEFAULT FALSE,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'all';

-- 11. TIMETABLE SLOTS
CREATE TABLE IF NOT EXISTS public.timetable_slots (
    id BIGSERIAL PRIMARY KEY,
    day_of_week TEXT NOT NULL,
    period INT NOT NULL,
    time_slot TEXT NOT NULL,
    subject TEXT,
    code TEXT,
    faculty TEXT,
    room TEXT,
    slot_type TEXT DEFAULT 'lecture',
    section TEXT DEFAULT 'A',
    semester INT DEFAULT 5,
    department TEXT DEFAULT 'CSE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    fee_record_id BIGINT,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    receipt TEXT,
    method TEXT DEFAULT 'UPI',
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT,
    date TEXT,
    time TEXT,
    venue TEXT,
    description TEXT,
    registered_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PLACEMENTS
CREATE TABLE IF NOT EXISTS public.placements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company TEXT NOT NULL,
    role TEXT,
    package TEXT,
    location TEXT,
    eligibility TEXT,
    deadline TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY: CLEAN, NON-RECURSIVE POLICIES FOR ALL TABLES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

-- Clean policies allowing anon/authenticated read and write without recursion
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public all colleges" ON public.colleges FOR ALL USING (true);
CREATE POLICY "Allow public all departments" ON public.departments FOR ALL USING (true);
CREATE POLICY "Allow public all attendance_sessions" ON public.attendance_sessions FOR ALL USING (true);
CREATE POLICY "Allow public all attendance_records" ON public.attendance_records FOR ALL USING (true);
CREATE POLICY "Allow public all assignments" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Allow public all submissions" ON public.submissions FOR ALL USING (true);
CREATE POLICY "Allow public all notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Allow public all timetable_slots" ON public.timetable_slots FOR ALL USING (true);
CREATE POLICY "Allow public all payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow public all events" ON public.events FOR ALL USING (true);
CREATE POLICY "Allow public all placements" ON public.placements FOR ALL USING (true);

-- ============================================================================
-- SEED COMPLETE INITIAL DATA
-- ============================================================================

-- 1. College
INSERT INTO public.colleges (id, name, code, location)
VALUES ('col_001', 'Sri Maviqo Engineering College', 'SMEC', 'Coimbatore, Tamil Nadu')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Profiles (Demo Users: Student, Faculty, Admin, HOD, Parent)
INSERT INTO public.profiles (id, email, full_name, role, department, program, semester, roll_number, section, college_name, phone)
VALUES 
('usr_student_001', 'karthik@maviqo.edu', 'Karthik Raj', 'student', 'Computer Science & Engineering', 'B.Tech Computer Science & Engineering', 5, '22CSE101', 'A', 'Sri Maviqo Engineering College', '+91 98765 43210'),
('usr_faculty_001', 'faculty@maviqo.edu', 'Dr. Priya Lakshmi', 'faculty', 'Computer Science & Engineering', NULL, NULL, NULL, NULL, 'Sri Maviqo Engineering College', '+91 98401 12345'),
('usr_hod_001', 'hod@maviqo.edu', 'Dr. R. Sundaram', 'hod', 'Computer Science & Engineering', NULL, NULL, NULL, NULL, 'Sri Maviqo Engineering College', '+91 94432 54321'),
('usr_admin_001', 'admin@maviqo.edu', 'Administrator', 'admin', 'Academic Administration', NULL, NULL, NULL, NULL, 'Sri Maviqo Engineering College', '+91 94444 88888'),
('usr_parent_001', 'parent@maviqo.edu', 'Rajesh Raj', 'parent', NULL, NULL, NULL, NULL, NULL, 'Sri Maviqo Engineering College', '+91 98401 98765')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 3. Departments
INSERT INTO public.departments (id, name, code, hod, faculty_count, student_count, program_count, college_id)
VALUES
('dept_001', 'Computer Science & Engineering', 'CSE', 'Dr. R. Sundaram', 24, 480, 2, 'col_001'),
('dept_002', 'Information Technology', 'IT', 'Dr. M. Sangeetha', 18, 360, 2, 'col_001'),
('dept_003', 'Electronics & Communication', 'ECE', 'Dr. V. Ramanathan', 22, 440, 2, 'col_001'),
('dept_004', 'Mechanical Engineering', 'MECH', 'Dr. K. Ganesan', 20, 400, 2, 'col_001'),
('dept_005', 'Civil Engineering', 'CIVIL', 'Dr. A. Murugesan', 16, 320, 1, 'col_001'),
('dept_006', 'AI & Data Science', 'AI&DS', 'Dr. S. Karthikeyan', 14, 240, 1, 'col_001')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. Notifications
INSERT INTO public.notifications (id, title, message, type, target_role, read, created_at)
VALUES
('notif_001', 'Mid-Term Exam Schedule Released', 'Timetable for Mid-Term Examination 1 has been published. Exams commence from Sept 15, 2026.', 'exam', 'student', false, NOW() - INTERVAL '2 hours'),
('notif_002', 'Campus Placement Drive: Zoho Corp', 'Zoho Corporation is visiting for Software Engineer roles (8.5 LPA). Register before Sept 12.', 'placement', 'student', false, NOW() - INTERVAL '5 hours'),
('notif_003', 'Semester Fee Payment Reminder', 'Last date for Semester 5 tuition fee payment is Oct 15, 2026 without fine.', 'fee', 'all', false, NOW() - INTERVAL '1 day'),
('notif_004', 'National Level Hackathon 2026', 'Registrations are open for MAVI-HACK 2026 with cash prizes worth Rs. 2,00,000.', 'event', 'all', false, NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 5. Assignments
INSERT INTO public.assignments (id, title, subject, code, section, due_date, max_marks, total_submissions, graded_submissions, status)
VALUES
('asg_001', 'Dynamic Programming Problem Set', 'Design & Analysis of Algorithms', 'CS3501', 'A', '2026-09-15', 50, 58, 45, 'active'),
('asg_002', 'Process Scheduling Algorithms Simulator', 'Operating Systems', 'CS3502', 'A', '2026-09-18', 100, 52, 20, 'active'),
('asg_003', 'B+ Tree Indexing Case Study', 'Database Management Systems', 'CS3503', 'A', '2026-08-30', 25, 60, 60, 'closed')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 6. Timetable Slots
INSERT INTO public.timetable_slots (day_of_week, period, time_slot, subject, code, faculty, room, slot_type, section, semester, department)
VALUES
('Monday', 1, '09:00 - 09:50', 'Data Structures', 'CS3501', 'Dr. Priya Lakshmi', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Monday', 2, '10:00 - 10:50', 'Database Management', 'CS3503', 'Prof. Suresh Kumar', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Monday', 3, '11:00 - 11:50', 'Operating Systems', 'CS3502', 'Dr. Anita Roy', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Monday', 4, '11:50 - 12:40', 'Computer Networks', 'CS3504', 'Prof. Rajesh Khanna', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Monday', 5, '01:30 - 03:30', 'DBMS Laboratory', 'CS3511', 'Prof. Suresh Kumar', 'Lab-3', 'lab', 'A', 5, 'CSE'),
('Tuesday', 1, '09:00 - 09:50', 'Operating Systems', 'CS3502', 'Dr. Anita Roy', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Tuesday', 2, '10:00 - 10:50', 'Computer Networks', 'CS3504', 'Prof. Rajesh Khanna', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Tuesday', 3, '11:00 - 11:50', 'Design & Analysis of Algorithms', 'CS3501', 'Dr. Priya Lakshmi', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Tuesday', 4, '11:50 - 12:40', 'Artificial Intelligence', 'CS3505', 'Dr. K. Senthil', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Tuesday', 5, '01:30 - 03:30', 'OS Laboratory', 'CS3512', 'Dr. Anita Roy', 'Lab-2', 'lab', 'A', 5, 'CSE'),
('Wednesday', 1, '09:00 - 09:50', 'Artificial Intelligence', 'CS3505', 'Dr. K. Senthil', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Wednesday', 2, '10:00 - 10:50', 'Database Management', 'CS3503', 'Prof. Suresh Kumar', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Wednesday', 3, '11:00 - 11:50', 'Design & Analysis of Algorithms', 'CS3501', 'Dr. Priya Lakshmi', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Wednesday', 4, '11:50 - 12:40', 'Library / Self-Study', 'LIB01', 'Librarian', 'Central Library', 'lecture', 'A', 5, 'CSE'),
('Thursday', 1, '09:00 - 09:50', 'Computer Networks', 'CS3504', 'Prof. Rajesh Khanna', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Thursday', 2, '10:00 - 10:50', 'Operating Systems', 'CS3502', 'Dr. Anita Roy', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Thursday', 3, '11:00 - 11:50', 'Database Management', 'CS3503', 'Prof. Suresh Kumar', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Thursday', 4, '11:50 - 12:40', 'Artificial Intelligence', 'CS3505', 'Dr. K. Senthil', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Friday', 1, '09:00 - 09:50', 'Design & Analysis of Algorithms', 'CS3501', 'Dr. Priya Lakshmi', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Friday', 2, '10:00 - 10:50', 'Artificial Intelligence', 'CS3505', 'Dr. K. Senthil', 'LH-201', 'lecture', 'A', 5, 'CSE'),
('Friday', 3, '11:00 - 11:50', 'Seminar / Technical Presentation', 'SEM01', 'Dr. Priya Lakshmi', 'Auditorium-2', 'lecture', 'A', 5, 'CSE'),
('Friday', 4, '11:50 - 12:40', 'Sports & Extra-Curricular', 'SPT01', 'Physical Director', 'Sports Ground', 'lecture', 'A', 5, 'CSE');

-- 7. Placements
INSERT INTO public.placements (id, company, role, package, location, eligibility, deadline)
VALUES
('plc_001', 'Zoho Corporation', 'Software Development Engineer', '8.5 LPA', 'Chennai / Tenkasi', 'CGPA >= 7.0, No active backlogs', '2026-09-12'),
('plc_002', 'TCS Digital', 'Systems Engineer', '7.2 LPA', 'Pan India', 'CGPA >= 6.5, Max 1 backlog', '2026-09-20'),
('plc_003', 'Amazon India', 'Cloud Support Associate', '12.0 LPA', 'Bengaluru / Hyderabad', 'CGPA >= 8.0, CSE/IT only', '2026-09-28')
ON CONFLICT (id) DO UPDATE SET company = EXCLUDED.company;

-- 8. Events
INSERT INTO public.events (id, title, category, date, time, venue, description, registered_count)
VALUES
('evt_001', 'MAVI-HACK 2026 (24hr Hackathon)', 'Competition', '2026-09-22', '09:00 AM', 'Main Auditorium & Innovation Lab', 'National Level 24-hour coding hackathon with cash prizes up to Rs 2,00,000.', 142),
('evt_002', 'Workshop on GenAI & LLM Architecture', 'Technical Workshop', '2026-09-18', '02:00 PM', 'Seminar Hall 3', 'Hands-on session building agents with Google Gemini API.', 85),
('evt_003', 'Annual Sports Meet: Athlos 2026', 'Sports', '2026-10-02', '08:00 AM', 'College Sports Complex', 'Inter-departmental athletics, football, and cricket tournaments.', 310)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
SELECT 'Schema and seed complete!' AS status;
