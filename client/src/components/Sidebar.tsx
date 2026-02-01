import { Link, useLocation } from "wouter";
import { ShieldAlert, Terminal, BarChart2, Database, Skull, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: BarChart2 },
    { href: "/conversations", label: "Active Ops", icon: Terminal },
    { href: "/intelligence", label: "Intel DB", icon: Database },
    { href: "/test-lab", label: "Scam Lab", icon: Skull },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary animate-pulse" />
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider text-white">
              HONEYPOT
            </h1>
            <p className="text-xs text-primary/60 font-mono tracking-widest">SYSTEM V1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          
          return (
            <Link key={link.href} href={link.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-none border-l-2 transition-all duration-200 group font-mono text-sm",
              isActive 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5 hover:border-white/20"
            )}>
              <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]")} />
              <span className={isActive ? "glow-text" : ""}>{link.label}</span>
              {isActive && <span className="ml-auto text-xs animate-pulse">●</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-black/40 p-3 rounded border border-border/30">
          <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
            <span>CPU</span>
            <span className="text-primary">12%</span>
          </div>
          <div className="w-full bg-secondary h-1 rounded-full mb-2 overflow-hidden">
            <div className="bg-primary h-full w-[12%] animate-pulse" />
          </div>
          
          <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
            <span>MEM</span>
            <span className="text-accent">48%</span>
          </div>
          <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
            <div className="bg-accent h-full w-[48%]" />
          </div>
        </div>
        
        <div className="mt-4 text-[10px] text-center text-muted-foreground/50 font-mono">
          SECURE CONNECTION ESTABLISHED
        </div>
      </div>
    </div>
  );
}
