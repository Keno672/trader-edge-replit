import { useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGetSignalQueryKey, useGetSignal } from "@workspace/api-client-react";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function Chart() {
  const { id } = useParams();
  const { data: signal, isLoading } = useGetSignal(Number(id), {
    query: { enabled: !!id, queryKey: getGetSignalQueryKey(Number(id)) }
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!signal?.ticker || !containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== "undefined") {
        new window.TradingView.widget({
          autosize: true,
          symbol: signal.ticker,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          backgroundColor: "rgba(10, 10, 10, 1)",
          gridColor: "rgba(30, 30, 30, 1)",
          hide_top_toolbar: true,
          hide_legend: false,
          save_image: false,
          container_id: "tradingview_widget",
          toolbar_bg: "rgba(10, 10, 10, 1)"
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [signal?.ticker]);

  if (isLoading) {
    return <div className="min-h-[100dvh] bg-background flex items-center justify-center">Loading chart...</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <Link href="/top5">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-none">{signal?.ticker}</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{signal?.category}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-md text-xs font-bold ${signal?.direction === 'BUY' ? 'bg-buy/10 text-buy' : 'bg-sell/10 text-sell'}`}>
          {signal?.direction}
        </div>
      </div>

      <div className="flex-1 w-full relative bg-black">
        <div id="tradingview_widget" ref={containerRef} className="absolute inset-0" />
      </div>

      <div className="p-4 bg-background border-t border-border">
        <Link href={`/decision/${id}`}>
          <Button size="lg" className="w-full h-14 text-lg font-bold">
            <Target className="mr-2 w-5 h-5" /> Scan This Chart
          </Button>
        </Link>
      </div>
    </div>
  );
}
