import { useStats } from "@/hooks/use-scam";
import { TerminalCard } from "@/components/TerminalCard";
import { Database, Search, Lock, Download } from "lucide-react";

export default function Intelligence() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">INTELLIGENCE DB</h1>
          <p className="text-primary/60 font-mono text-sm">Central repository of captured threat actor data</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-colors text-xs font-mono uppercase">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Mock data display since we don't have a dedicated intel list endpoint in routes yet, 
          normally this would fetch from an API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border/50 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Bank Accounts</div>
          <div className="text-2xl font-display text-white">142</div>
        </div>
        <div className="bg-card border border-border/50 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">UPI IDs</div>
          <div className="text-2xl font-display text-accent">387</div>
        </div>
        <div className="bg-card border border-border/50 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Phone Numbers</div>
          <div className="text-2xl font-display text-primary">1,024</div>
        </div>
        <div className="bg-card border border-border/50 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Phishing URLs</div>
          <div className="text-2xl font-display text-yellow-500">56</div>
        </div>
      </div>

      <TerminalCard title="DATA RECORDS" className="min-h-[500px]">
        <div className="flex items-center gap-2 mb-4 bg-black/40 border border-border/50 p-2 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="SEARCH DATABASE..." 
            className="bg-transparent border-none outline-none text-sm font-mono text-white w-full placeholder:text-muted-foreground/50"
          />
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Source ID</th>
              <th className="p-3">Captured At</th>
              <th className="p-3">Confidence</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {/* Placeholder rows to show UI structure */}
            <tr className="border-b border-border/10 hover:bg-white/5 transition-colors">
              <td className="p-3"><span className="text-accent border border-accent/30 px-1 py-0.5 text-[10px]">UPI_ID</span></td>
              <td className="p-3 text-white">scammer@okhdfcbank</td>
              <td className="p-3 text-muted-foreground">#1293</td>
              <td className="p-3 text-muted-foreground">2024-03-10 14:22</td>
              <td className="p-3 text-green-500">98%</td>
            </tr>
            <tr className="border-b border-border/10 hover:bg-white/5 transition-colors">
              <td className="p-3"><span className="text-yellow-500 border border-yellow-500/30 px-1 py-0.5 text-[10px]">URL</span></td>
              <td className="p-3 text-white">http://secure-login-hdfc.com</td>
              <td className="p-3 text-muted-foreground">#1294</td>
              <td className="p-3 text-muted-foreground">2024-03-10 15:45</td>
              <td className="p-3 text-green-500">99%</td>
            </tr>
             <tr className="border-b border-border/10 hover:bg-white/5 transition-colors">
              <td className="p-3"><span className="text-blue-500 border border-blue-500/30 px-1 py-0.5 text-[10px]">PHONE</span></td>
              <td className="p-3 text-white">+91 98765 43210</td>
              <td className="p-3 text-muted-foreground">#1293</td>
              <td className="p-3 text-muted-foreground">2024-03-10 14:20</td>
              <td className="p-3 text-yellow-500">85%</td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-black/40 px-4 py-2 border border-border/30 rounded">
            <Lock className="w-3 h-3" />
            END OF ENCRYPTED RECORDS
          </div>
        </div>
      </TerminalCard>
    </div>
  );
}
