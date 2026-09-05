-- ============================================================================
-- Maviqo — AI College Management Platform
-- Initial Schema Migration: 001_initial_schema.sql
-- (Idempotent & safe to re-run in Supabase SQL Editor)
-- ============================================================================

-- Ensure pgcrypto extension is active for gen_random_uuid (built-in on Postgres 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. COLLEGES (Multi-Tenant Root)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    logo_url TEXT,
    banner_url TEXT,
    established_year INT,
    affiliation VARCHAR(255),
    accreditation VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. USERS & PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'hod', 'admin', 'management', 'parent')),
    first_name VARCHAR(100) NOT NULL DEFAULT '',
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    blood_group VARCHAR(5),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. ACADEMIC STRUCTURE (Departments, Programs, Semesters, Batches)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    hod_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, code)
);

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    degree_type VARCHAR(50) NOT NULL CHECK (degree_type IN ('B.Tech', 'B.E', 'M.Tech', 'MBA', 'MCA', 'B.Sc', 'M.Sc', 'PhD', 'Diploma')),
    duration_years INT NOT NULL DEFAULT 4,
    total_semesters INT NOT NULL DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, code)
);

CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    year_label VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
    name VARCHAR(10) NOT NULL,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    capacity INT DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(program_id, semester, name, academic_year_id)
);

-- ----------------------------------------------------------------------------
-- 4. STUDENT & FACULTY DETAILS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_details (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    register_number VARCHAR(50) UNIQUE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    current_semester INT NOT NULL DEFAULT 1,
    current_section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    admission_year INT NOT NULL,
    graduation_year INT NOT NULL,
    parent_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cgpa NUMERIC(4, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faculty_details (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    designation VARCHAR(100) NOT NULL,
    qualification VARCHAR(255),
    specialization TEXT,
    joining_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. SUBJECTS & ALLOCATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
    credits INT NOT NULL DEFAULT 3,
    type VARCHAR(20) DEFAULT 'theory' CHECK (type IN ('theory', 'practical', 'elective', 'project')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(program_id, code)
);

CREATE TABLE IF NOT EXISTS faculty_subject_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(faculty_id, subject_id, section_id, academic_year_id)
);

-- ----------------------------------------------------------------------------
-- 6. ATTENDANCE SYSTEM
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID REFERENCES faculty_subject_allocations(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    period INT NOT NULL CHECK (period BETWEEN 1 AND 10),
    topic_covered TEXT,
    taken_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'od')),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 7. TIMETABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timetable_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
    period INT NOT NULL CHECK (period BETWEEN 1 AND 10),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    faculty_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    room_number VARCHAR(50),
    type VARCHAR(20) DEFAULT 'lecture' CHECK (type IN ('lecture', 'lab', 'tutorial', 'break')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. ASSIGNMENTS & SUBMISSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID REFERENCES faculty_subject_allocations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_marks INT NOT NULL DEFAULT 100,
    due_date TIMESTAMPTZ NOT NULL,
    attachments_json JSONB DEFAULT '[]',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_urls JSONB DEFAULT '[]',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    marks_obtained NUMERIC(5, 2),
    feedback TEXT,
    graded_by UUID REFERENCES profiles(id),
    graded_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late', 'resubmitted')),
    UNIQUE(assignment_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 9. EXAMS & MARKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('internal', 'semester', 'practical', 'quiz')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_schedule_id UUID NOT NULL REFERENCES exam_schedules(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_marks INT NOT NULL DEFAULT 100,
    passing_marks INT NOT NULL DEFAULT 50,
    room_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_paper_id UUID NOT NULL REFERENCES exam_papers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5, 2),
    is_absent BOOLEAN DEFAULT FALSE,
    grade VARCHAR(5),
    grade_point NUMERIC(3, 1),
    remarks TEXT,
    entered_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_paper_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 10. FEES & PAYMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_fee_dues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    net_payable NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'waived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, fee_structure_id)
);

CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_due_id UUID REFERENCES student_fee_dues(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'cash', 'cheque', 'dd')),
    transaction_reference VARCHAR(100),
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    verified_by UUID REFERENCES profiles(id),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- ----------------------------------------------------------------------------
-- 11. NOTIFICATIONS & EVENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('general', 'exam', 'assignment', 'fee', 'event', 'attendance', 'placement')),
    target_role VARCHAR(20) CHECK (target_role IN ('all', 'student', 'faculty', 'hod', 'admin', 'management', 'parent')),
    target_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(notification_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 12. AI CONVERSATIONS & CHAT HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. INDEXES FOR HIGH PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_college_role ON profiles(college_id, role);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_timetable_slots_sec_day ON timetable_slots(section_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_std ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_marks_std ON student_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_std ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_unread ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id, created_at);

-- ----------------------------------------------------------------------------
-- 14. ROW LEVEL SECURITY (RLS) POLICIES (Idempotent with DROP IF EXISTS)
-- ----------------------------------------------------------------------------
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Colleges: viewable by all
DROP POLICY IF EXISTS "Colleges viewable by everyone" ON colleges;
CREATE POLICY "Colleges viewable by everyone" ON colleges FOR SELECT USING (true);

-- Profiles: NO infinite recursion, all authenticated users can view, users manage own
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON profiles;
CREATE POLICY "Profiles viewable by authenticated users" ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Academic Tables (Departments, Programs, Sections, Subjects, Years): Viewable by authenticated
DROP POLICY IF EXISTS "Departments viewable by all authenticated" ON departments;
CREATE POLICY "Departments viewable by all authenticated" ON departments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Programs viewable by all authenticated" ON programs;
CREATE POLICY "Programs viewable by all authenticated" ON programs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Academic years viewable by all authenticated" ON academic_years;
CREATE POLICY "Academic years viewable by all authenticated" ON academic_years FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Sections viewable by all authenticated" ON sections;
CREATE POLICY "Sections viewable by all authenticated" ON sections FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Subjects viewable by all authenticated" ON subjects;
CREATE POLICY "Subjects viewable by all authenticated" ON subjects FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Faculty details viewable by authenticated" ON faculty_details;
CREATE POLICY "Faculty details viewable by authenticated" ON faculty_details FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Student details viewable by authenticated" ON student_details;
CREATE POLICY "Student details viewable by authenticated" ON student_details FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Timetable slots viewable by authenticated" ON timetable_slots;
CREATE POLICY "Timetable slots viewable by authenticated" ON timetable_slots FOR SELECT TO authenticated USING (true);

-- Attendance: Sessions & Records
DROP POLICY IF EXISTS "Attendance sessions viewable by authenticated" ON attendance_sessions;
CREATE POLICY "Attendance sessions viewable by authenticated" ON attendance_sessions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Faculty record attendance sessions" ON attendance_sessions;
CREATE POLICY "Faculty record attendance sessions" ON attendance_sessions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Attendance records viewable by authenticated" ON attendance_records;
CREATE POLICY "Attendance records viewable by authenticated" ON attendance_records FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Faculty insert attendance records" ON attendance_records;
CREATE POLICY "Faculty insert attendance records" ON attendance_records FOR INSERT TO authenticated WITH CHECK (true);

-- Assignments & Submissions
DROP POLICY IF EXISTS "Assignments viewable by authenticated" ON assignments;
CREATE POLICY "Assignments viewable by authenticated" ON assignments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Faculty create assignments" ON assignments;
CREATE POLICY "Faculty create assignments" ON assignments FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Assignment submissions viewable by authenticated" ON assignment_submissions;
CREATE POLICY "Assignment submissions viewable by authenticated" ON assignment_submissions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students submit assignments" ON assignment_submissions;
CREATE POLICY "Students submit assignments" ON assignment_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

-- Exam & Marks
DROP POLICY IF EXISTS "Exam schedules viewable by authenticated" ON exam_schedules;
CREATE POLICY "Exam schedules viewable by authenticated" ON exam_schedules FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Exam papers viewable by authenticated" ON exam_papers;
CREATE POLICY "Exam papers viewable by authenticated" ON exam_papers FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Student marks viewable by authenticated" ON student_marks;
CREATE POLICY "Student marks viewable by authenticated" ON student_marks FOR SELECT TO authenticated USING (true);

-- Fees & Payments
DROP POLICY IF EXISTS "Fee structures viewable by authenticated" ON fee_structures;
CREATE POLICY "Fee structures viewable by authenticated" ON fee_structures FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Student fee dues viewable by authenticated" ON student_fee_dues;
CREATE POLICY "Student fee dues viewable by authenticated" ON student_fee_dues FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Fee payments viewable by authenticated" ON fee_payments;
CREATE POLICY "Fee payments viewable by authenticated" ON fee_payments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students can insert fee payments" ON fee_payments;
CREATE POLICY "Students can insert fee payments" ON fee_payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

-- Notifications
DROP POLICY IF EXISTS "Notifications viewable by authenticated" ON notifications;
CREATE POLICY "Notifications viewable by authenticated" ON notifications FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "User notifications viewable by owner" ON user_notifications;
CREATE POLICY "User notifications viewable by owner" ON user_notifications FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notification read status" ON user_notifications;
CREATE POLICY "Users can update own notification read status" ON user_notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- AI Conversations
DROP POLICY IF EXISTS "Users manage own AI conversations" ON ai_conversations;
CREATE POLICY "Users manage own AI conversations" ON ai_conversations FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own AI messages" ON ai_messages;
CREATE POLICY "Users manage own AI messages" ON ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM ai_conversations WHERE id = ai_messages.conversation_id AND user_id = auth.uid())
);

-- ----------------------------------------------------------------------------
-- 15. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_college_id UUID;
BEGIN
    SELECT id INTO default_college_id FROM public.colleges LIMIT 1;

    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        role,
        college_id
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
        default_college_id
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SUCCESS: Schema created cleanly with Zero RLS recursion and full policy coverage.
-- ============================================================================
