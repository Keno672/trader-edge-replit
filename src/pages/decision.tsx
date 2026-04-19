import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGetSignalDecisionQueryKey, useGetSignalDecision } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Decision() {
  const { id } = useParams();
  const { data: decision, isLoading } = useGetSignalDecision(Number(id), {
    query: { enabled: !!id, queryKey: getGetSignalDecisionQueryKey(Number(id)) }
  });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background p-4 flex flex-col">
        <Skeleton className="h-10 w-10 rounded-full mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full rounded-xl mb-4" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!decision) return null;

  const isBuy = decision.direction === 'BUY';

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-md mx-auto w-full">
      <div className="flex items-center justify-between p-4 pb-0">
        <Link href={`/chart/${id}`}>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
          {decision.timeframe}
        </span>
      </div>

      <main className="flex-1 p-4 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight">{decision.ticker}</h1>
            <div className={`px-3 py-1 rounded-md text-sm font-bold ${
              decision.bias === 'Risk-On' ? 'bg-buy/10 text-buy border border-buy/20' : 
              decision.bias === 'Risk-Off' ? 'bg-sell/10 text-sell border border-sell/20' : 
              'bg-primary/10 text-primary border border-primary/20'
            }`}>
              {decision.bias}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className={`flex items-center justify-center w-16 h-16 rounded-xl border ${isBuy ? 'bg-buy/10 border-buy/30 text-buy' : 'bg-sell/10 border-sell/30 text-sell'}`}>
              <span className="text-xl font-bold">{decision.direction}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Conviction</p>
              <p className="text-2xl font-mono font-bold">{decision.confidence}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5 mb-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Battlefield Plan</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Entry Range</span>
              <p className="font-mono text-foreground font-medium">{decision.entryRange}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Stop Loss</span>
              <p className="font-mono text-sell font-bold">{decision.stopLoss}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Take Profit 1</span>
              <p className="font-mono text-buy font-bold">{decision.takeProfit1}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Take Profit 2</span>
              <p className="font-mono text-buy font-bold">{decision.takeProfit2}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/50 rounded-xl p-5 mb-8"
        >
          <h3 className="text-sm font-bold mb-2">AI Rationale</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {decision.rationale}
          </p>
        </motion.div>

        <div className="mt-auto pt-4">
          <Link href="/watchlist">
            <Button variant="outline" className="w-full h-14 text-lg border-border bg-card hover:bg-secondary">
              Add to Watchlist <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
