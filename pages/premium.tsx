import { motion } from "framer-motion";
import { Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Premium() {
  return (
    <div className="min-h-[100dvh] bg-background pt-8 px-4 pb-24 max-w-md mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upgrade Your Edge</h1>
        <p className="text-muted-foreground text-sm">Professional AI tools for serious traders</p>
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">Free</h3>
              <p className="text-sm text-muted-foreground">Basic access</p>
            </div>
            <span className="font-mono font-bold text-xl">$0</span>
          </div>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Top 5 Daily Setups</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Basic Market Mood</span>
            </li>
          </ul>
          <Button variant="outline" className="w-full" disabled>Current Plan</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border-2 border-primary rounded-xl p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
            Popular
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <Zap className="w-5 h-5" /> Premium
              </h3>
              <p className="text-sm text-muted-foreground">Advanced analysis</p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-2xl">$49</span>
              <span className="text-xs text-muted-foreground block">/month</span>
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>Full Battlefield Plan</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>Exact Entry/Exit Levels</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>Unlimited Live Charts</span>
            </li>
          </ul>
          <Button className="w-full font-bold">Upgrade to Premium</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-b from-secondary to-card border border-border rounded-xl p-5"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-buy" /> Premium Plus
              </h3>
              <p className="text-sm text-muted-foreground">Institutional grade</p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-2xl">$149</span>
              <span className="text-xs text-muted-foreground block">/month</span>
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-buy" />
              <span>Deep AI Decision Rationale</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-buy" />
              <span>Real-time Confidence Scoring</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-buy" />
              <span>Priority Trade Alerts</span>
            </li>
          </ul>
          <Button variant="secondary" className="w-full">Get Plus</Button>
        </motion.div>
      </div>
    </div>
  );
}
