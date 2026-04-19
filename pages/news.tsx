import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, Minus, Clock, Globe2, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import fearGreedImage from "@assets/IMG_9614_1776544035550.png";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Sentiment = "risk-on" | "risk-off" | "neutral";

interface Headline {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: "bullish" | "bearish" | "neutral";
  region: "US" | "EU" | "ASIA" | "GLOBAL" | "EM";
  category: string;
}

interface MacroIndicator {
  symbol: string;
  name: string;
  value: string;
  change: string;
  changePct: string;
  direction: "up" | "down" | "flat";
  category: string;
}

interface NewsFeed {
  riskSentiment: Sentiment;
  sentimentStrength: number;
  sentimentLabel: string;
  macroSummary: string;
  headlines: Headline[];
  macroIndicators: MacroIndicator[];
  lastUpdated: string;
}

function useNewsFeed() {
  return useQuery<NewsFeed>({
    queryKey: ["newsFeed"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/news/feed`);
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

const REGION_COLORS: Record<string, string> = {
  US: "bg-blue-500/20 text-blue-400",
  EU: "bg-yellow-500/20 text-yellow-400",
  ASIA: "bg-red-500/20 text-red-400",
  GLOBAL: "bg-purple-500/20 text-purple-400",
  EM: "bg-orange-500/20 text-orange-400",
};

const CAT_COLORS: Record<string, string> = {
  "Central Bank": "text-amber-400",
  Geopolitics: "text-red-400",
  Data: "text-sky-400",
  Commodities: "text-yellow-400",
  FX: "text-green-400",
  Bonds: "text-violet-400",
  Crypto: "text-orange-400",
};

const MACRO_TABS = ["Equities", "FX", "Commodities", "Bonds", "Crypto"];

function RiskGauge({ sentiment, strength, label }: { sentiment: Sentiment; strength: number; label: string }) {
  const isOn = sentiment === "risk-on";
  const isOff = sentiment === "risk-off";
  const gaugePct = isOn ? strength : isOff ? 100 - strength : 50;
  const imageClass = isOn ? "ring-green-400/30" : isOff ? "ring-red-400/30" : "ring-amber-400/30";

  return (
    <motion.div
      className={cn(
        "rounded-2xl border p-5 overflow-hidden relative",
        isOn ? "border-green-500/30 bg-green-500/5" :
        isOff ? "border-red-500/30 bg-red-500/5" :
        "border-border bg-secondary/30"
      )}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url(${fearGreedImage})` }} />
      <div className={cn("absolute inset-0 opacity-10 pointer-events-none", isOn ? "bg-gradient-to-br from-green-500 to-transparent" : isOff ? "bg-gradient-to-br from-red-500 to-transparent" : "bg-gradient-to-br from-amber-500 to-transparent")} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Fear & Greed Index</div>
            <div className={cn("text-3xl font-black tracking-tight", isOn ? "text-green-400" : isOff ? "text-red-400" : "text-amber-400")}>
              {isOn ? "GREED" : isOff ? "FEAR" : "NEUTRAL"}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
          </div>
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black border-2",
            isOn ? "border-green-400/40 bg-green-500/10 text-green-400" :
            isOff ? "border-red-400/40 bg-red-500/10 text-red-400" :
            "border-amber-400/40 bg-amber-500/10 text-amber-400"
          )}>
            {strength}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.2em] mb-3">
          <div className="rounded-lg bg-black/20 border border-white/5 px-3 py-2 text-red-300 flex items-center justify-between">
            <span>Extreme Fear</span>
            <span className="font-bold">0</span>
          </div>
          <div className="rounded-lg bg-black/20 border border-white/5 px-3 py-2 text-green-300 flex items-center justify-between">
            <span>Extreme Greed</span>
            <span className="font-bold">100</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-red-400 font-semibold w-12 text-right">FEAR</span>
          <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                isOn ? "bg-gradient-to-r from-amber-400 to-green-400" :
                isOff ? "bg-gradient-to-r from-red-500 to-red-400" :
                "bg-gradient-to-r from-amber-500 to-amber-400"
              )}
              initial={{ width: "50%" }}
              animate={{ width: `${gaugePct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-green-400 font-semibold w-12">GREED</span>
        </div>
      </div>
    </motion.div>
  );
}

function MacroSummary({ text }: { text: string }) {
  return (
    <motion.div
      className="rounded-xl bg-secondary/30 border border-border px-4 py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-start gap-2">
        <Globe2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

function HeadlineCard({ item, index }: { item: Headline; index: number }) {
  const sentimentIcon =
    item.sentiment === "bullish" ? <TrendingUp className="w-3.5 h-3.5 text-green-400" /> :
    item.sentiment === "bearish" ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> :
    <Minus className="w-3.5 h-3.5 text-muted-foreground" />;

  return (
    <motion.div
      className="py-3 border-b border-border last:border-0"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + index * 0.04 }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{sentimentIcon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{item.title}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide", REGION_COLORS[item.region] ?? "bg-secondary text-muted-foreground")}>
              {item.region}
            </span>
            <span className={cn("text-[10px] font-medium", CAT_COLORS[item.category] ?? "text-muted-foreground")}>
              {item.category}
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />{item.source} · {item.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function IndicatorRow({ item, index }: { item: MacroIndicator; index: number }) {
  const isUp = item.direction === "up";
  const isDown = item.direction === "down";

  return (
    <motion.div
      className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="w-16 flex-shrink-0">
        <div className="text-xs font-bold font-mono">{item.symbol}</div>
        <div className="text-[10px] text-muted-foreground truncate">{item.name}</div>
      </div>
      <div className="flex-1 text-right">
        <div className="text-sm font-mono font-semibold">{item.value}</div>
      </div>
      <div className={cn("text-right w-20 flex-shrink-0", isUp ? "text-green-400" : isDown ? "text-red-400" : "text-muted-foreground")}>
        <div className="text-xs font-mono">{item.changePct}</div>
        <div className="text-[10px] font-mono opacity-70">{item.change}</div>
      </div>
      <div className="w-4 flex-shrink-0">
        {isUp ? <TrendingUp className="w-3.5 h-3.5 text-green-400" /> :
         isDown ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> :
         <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
      </div>
    </motion.div>
  );
}

function LastUpdated({ iso, onRefresh, loading }: { iso: string; onRefresh: () => void; loading: boolean }) {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>Updated {time}</span>
      <button
        onClick={onRefresh}
        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
        disabled={loading}
      >
        <motion.div animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}>
          <RefreshCw className="w-3 h-3" />
        </motion.div>
        Refresh
      </button>
    </div>
  );
}

export default function News() {
  const { data, isLoading, refetch, isFetching } = useNewsFeed();
  const [activeTab, setActiveTab] = useState("Equities");

  const filteredIndicators = data?.macroIndicators.filter((m) => m.category === activeTab) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Global Macro</div>
            <h1 className="text-2xl font-bold">News Centre</h1>
          </div>
          {data && <LastUpdated iso={data.lastUpdated} onRefresh={() => refetch()} loading={isFetching} />}
        </motion.div>

        {data && (
          <RiskGauge
            sentiment={data.riskSentiment}
            strength={data.sentimentStrength}
            label={data.sentimentLabel}
          />
        )}

        {data && <MacroSummary text={data.macroSummary} />}

        <motion.div
          className="rounded-xl bg-card border border-card-border overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="font-semibold text-sm">Global Headlines</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Live Macro</div>
          </div>
          <div className="px-4">
            {data?.headlines.map((h, i) => (
              <HeadlineCard key={h.id} item={h} index={i} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl bg-card border border-card-border overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-4 py-3 border-b border-border">
            <div className="font-semibold text-sm mb-3">Market Snapshot</div>
            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {MACRO_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {filteredIndicators.map((item, i) => (
                  <IndicatorRow key={item.symbol} item={item} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
