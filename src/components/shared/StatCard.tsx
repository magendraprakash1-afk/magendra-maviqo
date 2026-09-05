import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number | string; label?: string; positive?: boolean };
  color?: "primary" | "emerald" | "amber" | "rose" | "violet" | "purple" | "blue";
  className?: string;
}

const colorMap: Record<string, { icon: string; trend: string }> = {
  primary: {
    icon: "bg-primary-500/10 text-primary-500",
    trend: "text-primary-500",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-500",
    trend: "text-emerald-500",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-500",
    trend: "text-amber-500",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-500",
    trend: "text-rose-500",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-500",
    trend: "text-violet-500",
  },
  purple: {
    icon: "bg-violet-500/10 text-violet-500",
    trend: "text-violet-500",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-500",
    trend: "text-blue-500",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
  className,
}: StatCardProps) {
  const colors = colorMap[color] || colorMap.primary;

  const isPositive =
    trend?.positive !== undefined
      ? trend.positive
      : typeof trend?.value === "number"
      ? trend.value >= 0
      : !String(trend?.value || "").startsWith("-");

  return (
    <div className={cn("stat-card group", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-[var(--muted-foreground)]">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-semibold",
              isPositive ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {typeof trend.value === "number"
              ? `${trend.value >= 0 ? "↑" : "↓"} ${Math.abs(trend.value)}%`
              : trend.value}
          </span>
          {trend.label && <span className="text-xs text-[var(--muted-foreground)]">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
