export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "student" | "faculty" | "hod" | "admin" | "management" | "parent";
          avatar_url: string | null;
          department: string | null;
          program: string | null;
          semester: number | null;
          roll_number: string | null;
          section: string | null;
          college_id: string | null;
          college_name: string | null;
          designation: string | null;
          employee_id: string | null;
          social_provider: string | null;
          phone: string | null;
          advisor: string | null;
          batch: string | null;
          blood_group: string | null;
          library_id: string | null;
          cabin: string | null;
          office_hours: string | null;
          specialization: string | null;
          guardian_name: string | null;
          guardian_phone: string | null;
          hostel_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      colleges: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          location: string | null;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["colleges"]["Row"];
        Update: Partial<Database["public"]["Tables"]["colleges"]["Row"]>;
      };
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          hod: string | null;
          faculty_count: number;
          student_count: number;
          program_count: number;
          college_id: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["departments"]["Row"]> & {
          id: string;
          name: string;
          code: string;
        };
        Update: Partial<Database["public"]["Tables"]["departments"]["Row"]>;
      };
      attendance_sessions: {
        Row: {
          id: string;
          class_id: string | null;
          subject: string;
          date: string;
          period: number;
          topic: string | null;
          recorded_by: string | null;
          recorded_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["attendance_sessions"]["Row"]> & {
          subject: string;
          date: string;
          period: number;
        };
        Update: Partial<Database["public"]["Tables"]["attendance_sessions"]["Row"]>;
      };
      attendance_records: {
        Row: {
          id: number;
          session_id: string;
          roll_no: string;
          student_name: string;
          status: "present" | "absent" | "late";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attendance_records"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["attendance_records"]["Row"]>;
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          subject: string;
          code: string | null;
          section: string | null;
          due_date: string | null;
          max_marks: number;
          total_submissions: number;
          graded_submissions: number;
          status: "active" | "closed";
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["assignments"]["Row"]> & {
          title: string;
          subject: string;
        };
        Update: Partial<Database["public"]["Tables"]["assignments"]["Row"]>;
      };
      submissions: {
        Row: {
          id: number;
          assignment_id: string;
          student_id: string;
          submitted_at: string;
          file_url: string | null;
          marks_obtained: number | null;
          status: "submitted" | "graded";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["submissions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["submissions"]["Row"]>;
      };
      fee_records: {
        Row: {
          id: number;
          student_id: string;
          total_fee: number;
          paid: number;
          pending: number;
          due_date: string | null;
          semester: number | null;
          academic_year: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["fee_records"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["fee_records"]["Row"]>;
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          fee_record_id: number | null;
          amount: number;
          date: string;
          receipt: string | null;
          method: string;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & {
          student_id: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: "exam" | "assignment" | "placement" | "fee" | "event" | "general";
          target_role: string;
          read: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          title: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      timetable_slots: {
        Row: {
          id: number;
          day_of_week: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
          period: number;
          time_slot: string;
          subject: string | null;
          code: string | null;
          faculty: string | null;
          room: string | null;
          slot_type: "lecture" | "lab" | "break" | "free";
          section: string;
          semester: number;
          department: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["timetable_slots"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["timetable_slots"]["Row"]>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          category: string | null;
          date: string | null;
          time: string | null;
          venue: string | null;
          description: string | null;
          registered_count: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
      };
      placements: {
        Row: {
          id: string;
          company: string;
          role: string | null;
          package: string | null;
          location: string | null;
          eligibility: string | null;
          deadline: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["placements"]["Row"]> & {
          company: string;
        };
        Update: Partial<Database["public"]["Tables"]["placements"]["Row"]>;
      };
    };
  };
}
