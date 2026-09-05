"use client";

import PageHeader from "@/components/shared/PageHeader";
import { demoFacultyClasses } from "@/lib/demo-data";
import { BookOpen, Users, MapPin, Calendar, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FacultyClassesPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Allocated Classes" subtitle="Classes assigned to you for the current academic semester" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoFacultyClasses.map((cls) => (
          <div
            key={cls.id}
            className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-primary-500/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500">
                Semester {cls.semester}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-lg">{cls.subject}</h3>
              <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">Code: {cls.code}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border)] text-sm">
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> Enrolled Students
                </span>
                <span className="font-semibold text-[var(--foreground)]">{cls.students}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Classroom / Lab
                </span>
                <span className="font-semibold text-[var(--foreground)]">{cls.room}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span>Section</span>
                <span className="font-semibold text-[var(--foreground)]">{cls.section}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/faculty/attendance"
                className="w-full py-2 px-3 rounded-xl bg-[var(--muted)] hover:bg-primary-500 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                Mark Attendance <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
