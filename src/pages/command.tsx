import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCurrentSession,
  useStartSession,
  useGenerateTop5,
  getGetCurrentSessionQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Upload, Zap, AlertCircle, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type ScanSlot = "scan1" | "scan2";

interface ParsedRow {
  ticker: string;
  category: string;
  side: string;
  score: number;
  reason: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function uploadScanFile(slot: ScanSlot, file: File): Promise<{ count: number; rows: ParsedRow[] }> {
  const form = new FormData();
  form.append("scanSlot", slot);
  form.append("file", file);
  const res = await fetch(`${BASE}/api/session/upload-scan`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error ?? "Upload failed");
  }
  return res.json();
}

function DropZone({
  slot,
  label,
  uploaded,
  count,
  onUpload,
  disabled,
}: {
  slot: ScanSlot;
  label: string;
  uploaded: boolean;
  count: number;
  onUpload: (slot: ScanSlot, file: File) => Promise<void>;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handle(file: File) {
    setUploading(true);
    try {
      await onUpload(slot, file);
    } finally {
      setUploading(false);
    }
  }

  return (
    <motion.div
      className={`relative rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors ${
        uploaded
          ? "border-green-500/50 bg-green-500/5"
          : dragging
          ? "border-primary/70 bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-primary/5"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handle(file);
      }}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handle(file);
          e.target.value = "";
        }}
      />
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          uploaded ? "bg-green-500/20 text-green-400" : "bg-secondary text-muted-foreground"
        }`}>
          {uploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Upload className="w-5 h-5" />
            </motion.div>
          ) : uploaded ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{label}</div>
          {uploaded ? (
            <div className="text-xs text-green-400 mt-0.5">{count} setups loaded — tap to replace</div>
          ) : (
            <div className="text-xs text-muted-foreground mt-0.5">
              Drop .txt or .csv — or tap to browse
            </div>
          )}
        </div>
        {uploaded && (
          <div className="text-2xl font-mono font-bold text-green-400">{count}</div>
        )}
      </div>
      {uploaded && (
        <motion.div
          className="absolute inset-0 rounded-xl ring-1 ring-green-500/30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
}

function ScanFormatHint() {
  return (
    <div className="rounded-lg bg-secondary/50 border border-border p-4 text-xs text-muted-foreground">
      <div className="font-semibold text-foreground mb-2">Scan file format</div>
      <div className="font-mono space-y-1">
        <div className="text-green-400">GOLD,Commodities,SELL,92,Resistance fade</div>
        <div className="text-green-400">NAS100|Indices|BUY|88|Dip support</div>
      </div>
      <div className="mt-2">Comma or pipe-separated · 5 columns: Ticker, Category, Side, Score, Reason</div>
    </div>
  );
}

export default function Command() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [sessionLabel, setSessionLabel] = useState("Morning Command");
  const [scan1Count, setScan1Count] = useState(0);
  const [scan2Count, setScan2Count] = useState(0);
  const [scan1Done, setScan1Done] = useState(false);
  const [scan2Done, setScan2Done] = useState(false);
  const [generatedTop5, setGeneratedTop5] = useState<any[]>([]);
  const [showFormat, setShowFormat] = useState(false);

  const { data: session } = useGetCurrentSession({
    query: { queryKey: getGetCurrentSessionQueryKey() },
  });

  const startSession = useStartSession();
  const generateTop5 = useGenerateTop5();

  async function handleStart() {
    await startSession.mutateAsync({ data: { label: sessionLabel } });
    setScan1Done(false);
    setScan2Done(false);
    setScan1Count(0);
    setScan2Count(0);
    setGeneratedTop5([]);
    queryClient.invalidateQueries({ queryKey: getGetCurrentSessionQueryKey() });
    toast({ title: "Session started", description: sessionLabel });
  }

  async function handleUpload(slot: ScanSlot, file: File) {
    const result = await uploadScanFile(slot, file);
    if (slot === "scan1") {
      setScan1Done(true);
      setScan1Count(result.count);
    } else {
      setScan2Done(true);
      setScan2Count(result.count);
    }
    toast({ title: `${slot === "scan1" ? "Scan 1" : "Scan 2"} uploaded`, description: `${result.count} setups parsed` });
  }

  async function handleGenerate() {
    const result = await generateTop5.mutateAsync({});
    setGeneratedTop5(result.session?.top5 ?? []);
    queryClient.invalidateQueries({ queryKey: ["listSignals"] });
    toast({ title: "Top 5 generated", description: "Navigate to Top 5 to see results" });
  }

  const canGenerate = scan1Done && scan2Done;
  const hasResults = generatedTop5.length > 0;

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Session Manager</div>
          <h1 className="text-2xl font-bold">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload two scans, merge them, generate today's Top 5.
          </p>
        </motion.div>

        {/* Session setup */}
        <motion.div
          className="rounded-xl bg-card border border-card-border p-5 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="text-xs text-muted-foreground uppercase tracking-widest">Session Label</div>
          <div className="flex gap-2">
            <Input
              value={sessionLabel}
              onChange={(e) => setSessionLabel(e.target.value)}
              placeholder="e.g. Morning Command"
              className="flex-1 bg-background"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleStart}
              disabled={startSession.isPending}
              title="Reset session"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          {session?.session?.id && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Active: {session.session.label}
            </div>
          )}
        </motion.div>

        {/* Scan Upload */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Upload Scans</div>
            <button
              className="text-xs text-primary underline-offset-2 hover:underline"
              onClick={() => setShowFormat(!showFormat)}
            >
              {showFormat ? "Hide" : "Show"} format
            </button>
          </div>

          <AnimatePresence>
            {showFormat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <ScanFormatHint />
              </motion.div>
            )}
          </AnimatePresence>

          <DropZone
            slot="scan1"
            label="Scan 1 — First session"
            uploaded={scan1Done}
            count={scan1Count}
            onUpload={handleUpload}
            disabled={false}
          />
          <DropZone
            slot="scan2"
            label="Scan 2 — Confirmation session"
            uploaded={scan2Done}
            count={scan2Count}
            onUpload={handleUpload}
            disabled={false}
          />
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Button
            size="lg"
            className="w-full h-14 text-base font-bold"
            disabled={!canGenerate || generateTop5.isPending}
            onClick={handleGenerate}
          >
            {generateTop5.isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Zap className="w-5 h-5" />
              </motion.div>
            ) : (
              <Zap className="mr-2 w-5 h-5" />
            )}
            {generateTop5.isPending ? "Generating..." : "Generate Top 5"}
          </Button>
          {!canGenerate && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Upload both scans to unlock
            </p>
          )}
        </motion.div>

        {/* Results Preview */}
        <AnimatePresence>
          {hasResults && (
            <motion.div
              className="rounded-xl bg-card border border-card-border overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="font-semibold">Generated Top 5</div>
                <button
                  onClick={() => navigate("/top5")}
                  className="flex items-center gap-1 text-xs text-primary font-medium"
                >
                  View full <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-border">
                {generatedTop5.map((item: any) => (
                  <motion.div
                    key={item.rank}
                    className="flex items-center gap-4 px-5 py-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.rank * 0.05 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {item.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{item.ticker}</div>
                      <div className="text-xs text-muted-foreground truncate">{item.reason}</div>
                    </div>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded ${
                      item.side === "BUY"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {item.side}
                    </div>
                    <div className="text-sm font-mono font-bold text-muted-foreground">
                      {item.score}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Button
                  className="w-full"
                  onClick={() => navigate("/top5")}
                >
                  Open Top 5 <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Merge logic info */}
        <motion.div
          className="rounded-lg border border-border bg-secondary/30 p-4 text-xs text-muted-foreground space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="font-semibold text-foreground">How it works</div>
          <div>1. Scans are parsed — comma or pipe-separated rows</div>
          <div>2. Both scans are merged and tickers deduplicated</div>
          <div>3. Scores are averaged · Direction by majority vote</div>
          <div>4. +5 bonus when both scans agree on direction</div>
          <div>5. Top 5 by score are saved as today's signals</div>
        </motion.div>
      </div>
    </div>
  );
}
