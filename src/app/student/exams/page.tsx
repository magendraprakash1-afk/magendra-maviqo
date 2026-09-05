"use client";

import PageHeader from "@/components/shared/PageHeader";
import { demoUpcomingExams } from "@/lib/demo-data";
import { GraduationCap, Clock, MapPin, Calendar } from "lucide-react";

export default function StudentExams() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader title="Exams" subtitle="Upcoming exam schedule and details" />

      <div className="space-y-3">
        {demoUpcomingExams.map((exam) => (
          <div key={exam.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-primary-500/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 shrink-0">
                <GraduationCap className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{exam.subject}</h4>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{exam.code} • {exam.type}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    {new Date(exam.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-amber-500" /> {exam.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 text-rose-500" /> {exam.venue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
