import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMarketSummary } from "@workspace/api-client-react";

export default function Home() {
  const { data: marketSummary, isLoading } = useGetMarketSummary();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20"
        >
          <Activity className="w-8 h-8 text-primary" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight mb-4"
        >
          Trader Edge
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-lg mb-8"
        >
          AI scans. Live charts. Clear decisions.
        </motion.p>

        {marketSummary && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full bg-card border border-border rounded-xl p-4 mb-8 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Market Bias</span>
              <span className={`text-sm font-bold ${
                marketSummary.overallBias === 'Risk-On' ? 'text-buy' : 
                marketSummary.overallBias === 'Risk-Off' ? 'text-sell' : 'text-primary'
              }`}>
                {marketSummary.overallBias}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Strength: {marketSummary.biasStrength}%
            </p>
            <div className="mt-4 text-sm text-foreground/80 leading-relaxed border-t border-border pt-4">
              {marketSummary.marketNote}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          <Link href="/top5">
            <Button size="lg" className="w-full h-14 text-lg font-bold">
              Enter Terminal <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 gap-4 w-full mt-12"
        >
          <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/50">
            <Zap className="w-5 h-5 text-primary mb-2" />
            <span className="text-xs font-medium">Real-time Data</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/50">
            <Shield className="w-5 h-5 text-primary mb-2" />
            <span className="text-xs font-medium">AI Verification</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
