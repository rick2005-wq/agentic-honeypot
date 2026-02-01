import { useConversation } from "@/hooks/use-conversations";
import { TerminalCard } from "@/components/TerminalCard";
import { Link, useRoute } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, User, Bot, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function ConversationDetail() {
  const [, params] = useRoute("/conversations/:id");
  const id = parseInt(params?.id || "0");
  const { data, isLoading } = useConversation(id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data?.messages]);

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-primary animate-pulse">
        DECRYPTING LOGS...
      </div>
    );
  }

  const { conversation, messages, intelligence } = data;

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col gap-4">
      <div className="flex items-center gap-4 border-b border-border/40 pb-4">
        <Link href="/conversations" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            OP: {conversation.title}
            {conversation.scamDetected && (
              <span className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> THREAT DETECTED
              </span>
            )}
          </h1>
          <div className="flex gap-4 text-xs font-mono text-muted-foreground mt-1">
            <span>ID: {conversation.id}</span>
            <span className="text-primary">SCORE: {conversation.scamScore}%</span>
            <span>TYPE: {conversation.scamType || "ANALYZING..."}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Chat Log */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <TerminalCard title="INTERCEPTION LOG" className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
              {messages.map((msg) => {
                const isAgent = msg.role === "agent";
                const isScammer = msg.role === "scammer";
                
                return (
                  <div key={msg.id} className={cn("flex gap-3", isAgent ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-8 h-8 rounded-none border flex items-center justify-center shrink-0",
                      isAgent ? "border-primary bg-primary/10 text-primary" : "border-accent bg-accent/10 text-accent"
                    )}>
                      {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    
                    <div className={cn(
                      "max-w-[80%] p-3 border text-sm font-mono",
                      isAgent 
                        ? "border-primary/30 bg-primary/5 text-primary-foreground" 
                        : "border-accent/30 bg-accent/5 text-white"
                    )}>
                      <div className="flex justify-between items-center gap-4 mb-1 border-b border-white/5 pb-1">
                        <span className={cn("text-xs font-bold", isAgent ? "text-primary" : "text-accent")}>
                          {isAgent ? "HONEYPOT_AI" : "TARGET"}
                        </span>
                        <span className="text-[10px] text-muted-foreground opacity-50">
                          {msg.createdAt ? format(new Date(msg.createdAt), "HH:mm:ss") : ""}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed opacity-90">{msg.content}</p>
                      
                      {/* Analysis Metadata */}
                      {msg.metadata && (msg.metadata as any).confidence && (
                        <div className="mt-2 text-[10px] text-muted-foreground border-t border-white/5 pt-1 flex justify-between">
                          <span>Scam Confidence:</span>
                          <span className={(msg.metadata as any).confidence > 0.7 ? "text-red-500" : "text-green-500"}>
                            {Math.round((msg.metadata as any).confidence * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-10 font-mono italic opacity-50">
                  AWAITING TARGET CONTACT...
                </div>
              )}
            </div>
          </TerminalCard>
        </div>

        {/* Intelligence Panel */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <TerminalCard title="EXTRACTED INTEL" status="danger">
            <div className="space-y-4">
              {intelligence.length > 0 ? (
                intelligence.map((intel) => (
                  <div key={intel.id} className="border border-border/50 bg-black/40 p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-accent uppercase">{intel.type.replace('_', ' ')}</span>
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                        {intel.confidence}% CONF
                      </span>
                    </div>
                    <div className="font-mono text-sm text-white break-all select-all">
                      {intel.value}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center py-8 border border-dashed border-border/50">
                  NO INTEL EXTRACTED YET
                </div>
              )}
            </div>
          </TerminalCard>

          <TerminalCard title="THREAT ANALYSIS" status="active">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Pattern Match</span>
                <span className="text-primary font-bold">UPI_FRAUD_V2</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Origin IP</span>
                <span className="text-white font-mono">XXX.XXX.12.45</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Agent Mode</span>
                <span className="text-accent font-bold">NAIVE_VICTIM</span>
              </div>
              
              <div className="pt-4 border-t border-border/30">
                <div className="text-xs text-muted-foreground mb-2">ENGAGEMENT STATUS</div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[65%] animate-pulse" />
                </div>
                <div className="mt-1 text-right text-xs text-green-500">ACTIVE - COLLECTING DATA</div>
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  );
}
