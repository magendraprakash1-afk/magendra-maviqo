"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { DataStore, type AssignmentItem } from "@/lib/data-store";
import { captureDocument, isNative } from "@/lib/mobile/native";
import { cn } from "@/lib/utils";
import { FileText, Upload, Clock, CheckCircle2, Camera, Check, Award } from "lucide-react";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => DataStore.getAssignments());
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setAssignments(DataStore.getAssignments());
    };
    window.addEventListener("maviqo_datastore_change", handleSync);
    return () => window.removeEventListener("maviqo_datastore_change", handleSync);
  }, []);

  const handleSubmit = async (asgId: string) => {
    setSubmittingId(asgId);
    try {
      const doc = await captureDocument();
      // Even if user cancels the camera, or on web, if they selected a file or confirm
      DataStore.submitAssignment(asgId, {
        fileUrl: doc?.dataUrl || "submitted_assignment.pdf",
      });
      setSuccessMessage("Assignment submitted successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e) {
      console.error("Submission error:", e);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <PageHeader 
        title="Assignments" 
        subtitle="View and submit assignments with mobile document scanner & grading history" 
      />

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 text-sm font-medium animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="divide-y divide-[var(--border)]">
          {assignments.map((asg) => {
            const isSubmitted = !!asg.studentSubmission;
            const isGraded = asg.studentSubmission?.status === "graded";

            return (
              <div key={asg.id} className="p-5 hover:bg-[var(--muted)]/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0 transition-transform hover:scale-105",
                    isGraded
                      ? "bg-purple-500/10 text-purple-500"
                      : isSubmitted
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-amber-500/10 text-amber-500"
                  )}>
                    {isGraded ? (
                      <Award className="w-5 h-5" />
                    ) : isSubmitted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm text-[var(--foreground)]">{asg.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                          {asg.subject} • {asg.code} • Max {asg.maxMarks} marks
                        </p>
                      </div>
                      <span className={cn(
                        "text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0",
                        isGraded
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                          : isSubmitted
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      )}>
                        {isGraded
                          ? `Graded (${asg.studentSubmission?.marksObtained}/${asg.maxMarks})`
                          : isSubmitted
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-2 border-t border-[var(--border)]/40">
                      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Due: {new Date(asg.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {isSubmitted && asg.studentSubmission?.submittedAt && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Submitted on {new Date(asg.studentSubmission.submittedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>

                      {!isSubmitted && (
                        <button
                          onClick={() => handleSubmit(asg.id)}
                          disabled={submittingId === asg.id}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
                        >
                          {submittingId === asg.id ? (
                            <span>Scanning & Uploading...</span>
                          ) : (
                            <>
                              {isNative() ? <Camera className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>{isNative() ? "Scan & Submit" : "Upload & Submit"}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
