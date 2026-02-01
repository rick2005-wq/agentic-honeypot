import { useConversations, useDeleteConversation } from "@/hooks/use-conversations";
import { TerminalCard } from "@/components/TerminalCard";
import { format } from "date-fns";
import { Terminal, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function ConversationList() {
  const { data: conversations, isLoading } = useConversations();
  const deleteMutation = useDeleteConversation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-primary animate-pulse">
        LOADING OPERATIONS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">ACTIVE OPERATIONS</h1>
          <p className="text-primary/60 font-mono text-sm">Monitoring {conversations?.length} honeypot instances</p>
        </div>
        <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 px-4 py-2 text-sm font-mono transition-colors uppercase tracking-wider">
          + Init New Op
        </button>
      </div>

      <TerminalCard title="SESSION LOGS">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Target / Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Threat Level</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {conversations?.map((conv) => (
                <tr key={conv.id} className="border-b border-border/20 hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-muted-foreground">#{conv.id.toString().padStart(4, '0')}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{conv.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${conv.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                      {conv.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="p-4 text-accent">{conv.scamType || "UNKNOWN"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", (conv.scamScore || 0) > 80 ? "bg-red-500" : "bg-primary")} 
                          style={{ width: `${conv.scamScore || 0}%` }}
                        />
                      </div>
                      <span className={cn("text-xs", (conv.scamScore || 0) > 80 ? "text-red-500" : "text-primary")}>
                        {conv.scamScore}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {conv.updatedAt ? format(new Date(conv.updatedAt), "HH:mm:ss dd/MM") : "-"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Link href={`/conversations/${conv.id}`} className="p-2 hover:text-primary transition-colors">
                        <Terminal className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => deleteMutation.mutate(conv.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {conversations?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                    NO ACTIVE OPERATIONS DETECTED. SYSTEM STANDBY.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TerminalCard>
    </div>
  );
}
