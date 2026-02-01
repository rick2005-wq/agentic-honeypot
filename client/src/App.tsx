import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import ConversationList from "@/pages/ConversationList";
import ConversationDetail from "@/pages/ConversationDetail";
import Intelligence from "@/pages/Intelligence";
import ScamLab from "@/pages/ScamLab";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/conversations" component={ConversationList} />
      <Route path="/conversations/:id" component={ConversationDetail} />
      <Route path="/intelligence" component={Intelligence} />
      <Route path="/test-lab" component={ScamLab} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-black overflow-hidden">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto max-h-screen relative z-10">
            <Router />
          </main>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
