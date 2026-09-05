"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { demoEvents } from "@/lib/demo-data";
import { Calendar, MapPin, Users, CheckCircle2, Ticket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentEventsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>(["ev_1"]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleRegister = (eventId: string, title: string) => {
    if (registeredEvents.includes(eventId)) return;
    setRegisteredEvents([...registeredEvents, eventId]);
    setSuccessToast(`Registered successfully for "${title}"! Entry pass generated.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Campus Events & Hackathons"
          subtitle="Explore technical symposiums, hackathons, and cultural fests happening across campus"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold self-start sm:self-center">
          <Ticket className="w-4 h-4" />
          <span>{registeredEvents.length} Active Passes</span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {successToast}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {demoEvents.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);

          return (
            <div
              key={evt.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 capitalize">
                    {evt.category}
                  </span>
                  <span className="text-xs font-semibold text-[var(--muted-foreground)] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {evt.registeredCount} joined
                  </span>
                </div>

                <h3 className="font-bold text-base text-[var(--foreground)] mt-3">
                  {evt.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-2 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2 text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span>{new Date(evt.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} • {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{evt.venue}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                {isRegistered ? (
                  <button
                    onClick={() => alert(`Showing Maviqo Digital Pass\nEvent: ${evt.title}\nVenue: ${evt.venue}\nPass Token: PASS-${evt.id.toUpperCase()}-2026`)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pass Confirmed (View Pass)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(evt.id, evt.title)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Register for Event</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
