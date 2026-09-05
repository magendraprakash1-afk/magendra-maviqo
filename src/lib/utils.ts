import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 90) return "text-emerald-500";
  if (percentage >= 75) return "text-amber-500";
  return "text-rose-500";
}

export function getAttendanceBgColor(percentage: number): string {
  if (percentage >= 90) return "bg-emerald-500/10 text-emerald-500";
  if (percentage >= 75) return "bg-amber-500/10 text-amber-500";
  return "bg-rose-500/10 text-rose-500";
}

export function getGradeColor(grade: string): string {
  const gradeMap: Record<string, string> = {
    O: "text-emerald-500",
    "A+": "text-emerald-500",
    A: "text-blue-500",
    "B+": "text-blue-400",
    B: "text-amber-500",
    C: "text-orange-500",
    F: "text-rose-500",
    RA: "text-rose-500",
  };
  return gradeMap[grade] || "text-gray-500";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
