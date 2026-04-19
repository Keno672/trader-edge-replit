import { useGetWatchlist } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { Instrument } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Watchlist() {
  const { data: watchlist, isLoading } = useGetWatchlist();

  const renderInstrument = (instrument: Instrument, index: number) => (
    <motion.div
      key={instrument.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between py-4 border-b border-border/50 last:border-0"
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{instrument.ticker}</h3>
          {instrument.direction && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${instrument.direction === 'BUY' ? 'bg-buy/20 text-buy' : 'bg-sell/20 text-sell'}`}>
              {instrument.direction}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{instrument.name}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-mono font-medium">{instrument.currentPrice}</span>
        <span className={`text-xs font-mono ${instrument.changePositive ? 'text-buy' : 'text-sell'}`}>
          {instrument.change}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] bg-background pt-8 px-4 pb-24 max-w-md mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Watchlist</h1>
        <p className="text-sm text-muted-foreground mt-1">Live market overview</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-32 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {watchlist?.market && watchlist.market.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Forex & Commodities</h2>
              <div className="bg-card border border-border rounded-xl px-4 shadow-sm">
                {watchlist.market.map((inst, i) => renderInstrument(inst, i))}
              </div>
            </section>
          )}

          {watchlist?.crypto && watchlist.crypto.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Crypto</h2>
              <div className="bg-card border border-border rounded-xl px-4 shadow-sm">
                {watchlist.crypto.map((inst, i) => renderInstrument(inst, i))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
