import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  status?: "active" | "offline" | "warning" | "danger";
}

export function TerminalCard({ children, className, title, status = "active" }: TerminalCardProps) {
  const statusColors = {
    active: "bg-green-500",
    offline: "bg-gray-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };

  return (
    <div className={cn("terminal-card p-4 md:p-6", className)}>
      {title && (
        <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-2">
          <h3 className="text-lg font-bold text-primary tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-4 bg-primary animate-pulse" />
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusColors[status])} />
            <span className="text-xs text-muted-foreground font-mono uppercase">{status}</span>
          </div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary opacity-50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary opacity-50" />
    </div>
  );
}
