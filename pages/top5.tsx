import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListSignals } from "@workspace/api-client-react";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Top5() {
  const { data: signals, isLoading } = useListSignals();

  return (
    <div className="min-h-[100dvh] bg-background pt-8 px-4 pb-24 max-w-md mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Today's Top 5</h1>
        <p className="text-sm text-muted-foreground mt-1">Highest conviction setups ranked by AI</p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-card rounded-xl" />
          ))
        ) : (
          signals?.map((signal, index) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/chart/${signal.id}`}>
                <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-lg font-mono text-sm">
                      {signal.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{signal.ticker}</h3>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-secondary rounded text-muted-foreground">
                          {signal.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-sm font-bold ${signal.direction === 'BUY' ? 'text-buy' : 'text-sell'}`}>
                          {signal.direction}
                        </span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {signal.confidence}% Conviction
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono font-medium">{signal.currentPrice}</span>
                    <span className={`text-xs font-mono ${signal.changePositive ? 'text-buy' : 'text-sell'}`}>
                      {signal.change}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
