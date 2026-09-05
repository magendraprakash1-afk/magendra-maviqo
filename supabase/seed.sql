-- ============================================================================
-- Maviqo — AI College Management Platform
-- Seed Data: seed.sql
-- (Run in Supabase SQL Editor after 001_initial_schema.sql)
-- ============================================================================

-- 1. Insert College
INSERT INTO colleges (id, name, code, subdomain, city, state, email, phone, affiliation, accreditation)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'Sri Maviqo Institute of Technology',
    'SMIT',
    'smit',
    'Coimbatore',
    'Tamil Nadu',
    'info@maviqo.edu',
    '+91 422 2345678',
    'Anna University',
    'NAAC A++'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Insert Departments
INSERT INTO departments (id, college_id, name, code, description) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Computer Science & Engineering', 'CSE', 'Department of Computer Science and Engineering'),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Information Technology', 'IT', 'Department of Information Technology'),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Electronics & Communication', 'ECE', 'Department of Electronics and Communication Engineering'),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Mechanical Engineering', 'MECH', 'Department of Mechanical Engineering'),
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Civil Engineering', 'CIVIL', 'Department of Civil Engineering'),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'Artificial Intelligence & Data Science', 'AI&DS', 'Department of AI and Data Science')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insert Programs
INSERT INTO programs (id, college_id, department_id, name, code, degree_type, duration_years, total_semesters) VALUES
('p0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'B.Tech in Computer Science & Engineering', 'BT-CSE', 'B.Tech', 4, 8),
('p0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'B.Tech in Information Technology', 'BT-IT', 'B.Tech', 4, 8),
('p0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000006', 'B.Tech in AI & Data Science', 'BT-AIDS', 'B.Tech', 4, 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. Insert Academic Year
INSERT INTO academic_years (id, college_id, year_label, start_date, end_date, is_current) VALUES
('y0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '2026-2027', '2026-07-01', '2027-05-31', TRUE)
ON CONFLICT (id) DO UPDATE SET year_label = EXCLUDED.year_label;

-- 5. Insert Sections
INSERT INTO sections (id, program_id, semester, name, academic_year_id, capacity) VALUES
('s0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 5, 'A', 'y0000000-0000-0000-0000-000000000001', 60),
('s0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 5, 'B', 'y0000000-0000-0000-0000-000000000001', 60)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 6. Insert Subjects for Semester 5 CSE
INSERT INTO subjects (id, program_id, name, code, semester, credits, type) VALUES
('sub00000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Design & Analysis of Algorithms', 'CS3501', 5, 4, 'theory'),
('sub00000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'Operating Systems', 'CS3502', 5, 3, 'theory'),
('sub00000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 'Database Management Systems', 'CS3503', 5, 3, 'theory'),
('sub00000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', 'Computer Networks', 'CS3504', 5, 3, 'theory'),
('sub00000-0000-0000-0000-000000000005', 'p0000000-0000-0000-0000-000000000001', 'Artificial Intelligence', 'CS3505', 5, 3, 'theory'),
('sub00000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000001', 'DBMS Laboratory', 'CS3511', 5, 2, 'practical'),
('sub00000-0000-0000-0000-000000000007', 'p0000000-0000-0000-0000-000000000001', 'Operating Systems Laboratory', 'CS3512', 5, 2, 'practical')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 7. Insert Notifications
INSERT INTO notifications (id, college_id, title, message, type, target_role) VALUES
('n0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Mid-Term Exam Schedule Released', 'The timetable for Mid-Term Examination 1 has been published. Exams commence from Sept 15, 2026.', 'exam', 'student'),
('n0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Campus Placement Drive: Zoho Corp', 'Zoho Corporation is visiting for Software Engineer roles (Package: 8.5 LPA). Eligible students must register by Sept 12.', 'placement', 'student'),
('n0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Semester Fee Payment Reminder', 'Last date for Semester 5 tuition fee payment is Oct 15, 2026 without fine.', 'fee', 'all'),
('n0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'National Level Hackathon 2026', 'Registrations are open for MAVI-HACK 2026 with cash prizes worth Rs. 2,00,000.', 'event', 'all')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
