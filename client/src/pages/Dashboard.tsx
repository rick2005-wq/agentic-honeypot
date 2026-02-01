import { useStats } from "@/hooks/use-scam";
import { TerminalCard } from "@/components/TerminalCard";
import { GlitchText } from "@/components/GlitchText";
import { Shield, BrainCircuit, Database, AlertTriangle, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-primary animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );
  }

  const COLORS = ['#00ff41', '#ff003c', '#eab308', '#3b82f6'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">
            <GlitchText text="COMMAND CENTER" />
          </h1>
          <p className="text-primary/60 font-mono text-sm">Real-time threat monitoring active</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded text-xs font-mono text-primary animate-pulse">
          <Activity className="w-3 h-3" />
          SYSTEM OPTIMAL
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="TOTAL THREATS" 
          value={stats?.totalConversations || 0} 
          icon={Shield}
          color="text-primary"
        />
        <StatsCard 
          title="ACTIVE AGENTS" 
          value={stats?.activeHoneypots || 0} 
          icon={BrainCircuit}
          color="text-yellow-500"
          status="warning"
        />
        <StatsCard 
          title="SCAMS STOPPED" 
          value={stats?.scamsDetected || 0} 
          icon={AlertTriangle}
          color="text-red-500"
          status="danger"
        />
        <StatsCard 
          title="INTEL GATHERED" 
          value={stats?.intelligenceCount || 0} 
          icon={Database}
          color="text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TerminalCard title="THREAT DISTRIBUTION" className="lg:col-span-2 min-h-[400px]">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats?.topScamTypes}>
              <XAxis dataKey="type" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0D0208', borderColor: '#333' }}
                itemStyle={{ color: '#00ff41' }}
                cursor={{ fill: 'rgba(0, 255, 65, 0.1)' }}
              />
              <Bar dataKey="count" fill="#00ff41" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TerminalCard>

        <TerminalCard title="SCAM TYPES" className="min-h-[400px]">
          <div className="h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats?.topScamTypes}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stats?.topScamTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0208', borderColor: '#333' }}
                  itemStyle={{ color: '#00ff41' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-4">
              {stats?.topScamTypes.map((type, index) => (
                <div key={type.type} className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-muted-foreground">{type.type}</span>
                  </div>
                  <span className="text-white">{type.count}</span>
                </div>
              ))}
            </div>
          </div>
        </TerminalCard>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, status = "active" }: any) {
  return (
    <TerminalCard status={status} className="relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-mono text-muted-foreground tracking-widest">{title}</h3>
        <Icon className={`w-5 h-5 ${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
      </div>
      <div className={`text-3xl font-display font-bold ${color} glow-text`}>
        {value}
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors" />
    </TerminalCard>
  );
}
