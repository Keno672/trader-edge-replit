import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/layout/bottom-nav";

import Home from "@/pages/home";
import Top5 from "@/pages/top5";
import Chart from "@/pages/chart";
import Decision from "@/pages/decision";
import Watchlist from "@/pages/watchlist";
import Premium from "@/pages/premium";
import Command from "@/pages/command";
import News from "@/pages/news";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/top5" component={Top5} />
      <Route path="/chart/:id" component={Chart} />
      <Route path="/decision/:id" component={Decision} />
      <Route path="/watchlist" component={Watchlist} />
      <Route path="/premium" component={Premium} />
      <Route path="/command" component={Command} />
      <Route path="/news" component={News} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-[100dvh] bg-background text-foreground pb-16">
            <Router />
            <BottomNav />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
