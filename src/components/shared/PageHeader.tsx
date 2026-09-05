import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, subtitle, gradient, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight", gradient && "gradient-text")}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
