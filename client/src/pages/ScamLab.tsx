import { useState } from "react";
import { TerminalCard } from "@/components/TerminalCard";
import { useScamCheck } from "@/hooks/use-scam";
import { Send, Zap, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScamLab() {
  const [message, setMessage] = useState("");
  const scamMutation = useScamCheck();
  const [logs, setLogs] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to log immediately
    const userLog = { role: 'user', content: message, timestamp: new Date() };
    setLogs(prev => [...prev, userLog]);
    
    const currentMsg = message;
    setMessage("");

    try {
      const result = await scamMutation.mutateAsync({
        message: currentMsg,
        conversation_id: "test-lab-session"
      });

      setLogs(prev => [...prev, { 
        role: 'system', 
        content: result, 
        timestamp: new Date() 
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-2rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">SCAM LAB</h1>
        <p className="text-primary/60 font-mono text-sm">Test honeypot AI response against simulated threats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <TerminalCard title="SIMULATION CONSOLE" className="lg:col-span-2 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar bg-black/20 mb-4 border border-white/5">
            {logs.length === 0 && (
              <div className="text-center text-muted-foreground/40 mt-20 font-mono">
                [SYSTEM READY] ENTER MESSAGE TO BEGIN SIMULATION...
              </div>
            )}
            
            {logs.map((log, i) => (
              <div key={i} className="space-y-2">
                {log.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-white/10 text-white px-4 py-2 rounded-l-lg rounded-tr-lg max-w-[80%] font-mono text-sm border border-white/20">
                      {log.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                     {/* AI Response Bubble */}
                    <div className="flex justify-start">
                      <div className="bg-primary/10 text-primary px-4 py-2 rounded-r-lg rounded-tl-lg max-w-[80%] font-mono text-sm border border-primary/30 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                         <div className="text-[10px] uppercase opacity-50 mb-1 border-b border-primary/20 pb-1">Honeypot Agent</div>
                        {log.content.reply}
                      </div>
                    </div>
                    
                    {/* Analysis Card */}
                    <div className="bg-card border border-border/60 p-3 ml-4 max-w-[80%] text-xs font-mono">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-1">
                        <Zap className="w-3 h-3" /> Analysis Result
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-muted-foreground block">Scam Detected:</span>
                          <span className={cn("font-bold text-lg", log.content.scam_detected ? "text-red-500" : "text-green-500")}>
                            {log.content.scam_detected ? "YES" : "NO"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Confidence:</span>
                          <span className="font-bold text-lg text-white">{(log.content.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Agent Mode:</span>
                          <span className="text-accent font-bold">{log.content.agent_mode}</span>
                        </div>
                      </div>

                      {log.content.extracted_intelligence && (
                        <div className="mt-3 pt-2 border-t border-white/5">
                          <span className="text-muted-foreground block mb-1">Intel Extracted:</span>
                          <div className="space-y-1">
                            {Object.entries(log.content.extracted_intelligence).map(([key, val]: [string, any]) => (
                              val.length > 0 && (
                                <div key={key} className="flex gap-2">
                                  <span className="text-accent uppercase">{key.split('_')[0]}:</span>
                                  <span className="text-white">{val.join(", ")}</span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {scamMutation.isPending && (
              <div className="flex items-center gap-2 text-primary text-xs font-mono animate-pulse">
                <span className="w-2 h-2 bg-primary rounded-full" />
                ANALYZING THREAT VECTOR...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Simulate scammer message..."
              className="flex-1 bg-black/40 border border-primary/30 px-4 py-3 text-white font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <button 
              type="submit" 
              disabled={scamMutation.isPending || !message.trim()}
              className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-2 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SEND <Send className="w-4 h-4" />
            </button>
          </form>
        </TerminalCard>

        <div className="space-y-6">
          <TerminalCard title="SYSTEM STATUS" status="active">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500">
                   <Shield className="w-6 h-6" />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-white">DEFENSE MATRIX</div>
                   <div className="text-xs text-green-500">ONLINE - 100%</div>
                 </div>
               </div>
               
               <div className="h-px bg-white/10" />
               
               <div className="space-y-2">
                 <div className="flex justify-between text-xs text-muted-foreground">
                   <span>LLM LATENCY</span>
                   <span className="text-white">124ms</span>
                 </div>
                 <div className="flex justify-between text-xs text-muted-foreground">
                   <span>INTEL PARSER</span>
                   <span className="text-white">ACTIVE</span>
                 </div>
                 <div className="flex justify-between text-xs text-muted-foreground">
                   <span>SCAM DATABASE</span>
                   <span className="text-white">SYNCED</span>
                 </div>
               </div>
            </div>
          </TerminalCard>
          
          <TerminalCard title="ACTIVE PROTOCOLS" status="warning">
            <div className="text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-white">
                <span className="text-accent">[!]</span> UPI_SPOOF_DETECTION
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-accent">[!]</span> JOB_SCAM_PATTERNS
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-accent">[!]</span> KEYWORD_TRACING
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-accent">[!]</span> SCRIPT_INJECTION_GUARD
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  );
}
