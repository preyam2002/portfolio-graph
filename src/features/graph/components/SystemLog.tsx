import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { useStore } from "@/store";

const FLAVOR_MESSAGES = [
  { type: "info", msg: "SCANNING SECTOR 7..." },
  { type: "info", msg: "PACKET LOSS: 0.0004%" },
  { type: "info", msg: "DECRYPTING METADATA..." },
  { type: "success", msg: "RENDER QUEUE OPTIMIZED" },
  { type: "warning", msg: "FLUX CAPACITOR: CALIBRATING" },
  { type: "error", msg: "MINOR BUFFER UNDERRUN" },
  { type: "info", msg: "RE-ROUTING TRAFFIC..." },
  { type: "info", msg: "QUANTUM STATE: STABLE" },
  { type: "info", msg: "MEMORY DEFRAG: COMPLETE" },
  { type: "warning", msg: "HIGH ENTROPY DETECTED" },
];

const typeColors: Record<string, string> = {
  info: "text-cyan-500",
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-rose-400",
  action: "text-fuchsia-400", // New color for user actions
};

interface LogEntry {
  id: number;
  timestamp: string;
  type: string;
  msg: string;
}

const SystemLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  // Store subscriptions
  const activeNode = useStore((state) => state.activeNode);
  const activeClusterFilter = useStore((state) => state.activeClusterFilter);
  const hoverNode = useStore((state) => state.hoverNode);
  const isCmdPaletteOpen = useStore((state) => state.isCmdPaletteOpen);

  // Refs to track previous values for diffing
  const prevActiveNode = useRef(activeNode);
  const prevFilter = useRef(activeClusterFilter);
  const prevCmdOpen = useRef(isCmdPaletteOpen);

  // Helper to add log
  const addLog = (type: string, msg: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });
    setLogs((prev) =>
      [{ id: Date.now() + Math.random(), timestamp, type, msg }, ...prev].slice(
        0,
        8,
      ),
    );
  };

  // 1. Random Flavor Logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) return; // Reduce frequency
      const entry =
        FLAVOR_MESSAGES[Math.floor(Math.random() * FLAVOR_MESSAGES.length)];
      addLog(entry.type, entry.msg);
    }, 4000); // Slower interval
    return () => clearInterval(interval);
  }, []);

  // 2. Interactive Logs
  useEffect(() => {
    if (activeNode && activeNode.id !== prevActiveNode.current?.id) {
      addLog("action", `SELECTED NODE: ${activeNode.label.toUpperCase()}`);
    }
    prevActiveNode.current = activeNode;
  }, [activeNode]);

  useEffect(() => {
    if (activeClusterFilter !== prevFilter.current) {
      addLog("action", `FILTER APPLIED: ${activeClusterFilter.toUpperCase()}`);
    }
    prevFilter.current = activeClusterFilter;
  }, [activeClusterFilter]);

  useEffect(() => {
    if (isCmdPaletteOpen !== prevCmdOpen.current) {
      addLog(
        "action",
        isCmdPaletteOpen ? "COMMAND PALETTE: OPEN" : "COMMAND PALETTE: CLOSED",
      );
    }
    prevCmdOpen.current = isCmdPaletteOpen;
  }, [isCmdPaletteOpen]);

  useEffect(() => {
    if (hoverNode) {
      // Debounce hover logs slightly or just show unique ones?
      // Maybe detailed hover logs are too noisy. Let's skip or make very rare.
      // Instead, let's log "TARGET ACQUIRED" randomly when hovering
      if (Math.random() > 0.8) {
        addLog("info", `TARGET ACQUIRED: ${hoverNode.id}`);
      }
    }
  }, [hoverNode]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-24 left-6 md:left-8 z-20 pointer-events-none hidden lg:block font-mono-tech text-[10px] w-72"
    >
      <div className="glass-premium border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
          <Terminal className="w-3 h-3 text-cyan-500" />
          <span className="text-cyan-600 font-bold tracking-widest uppercase text-[9px]">
            System Logs
          </span>
          <motion.div
            className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        {/* Log Entries */}
        <div className="flex flex-col gap-1 max-h-40 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1 - i * 0.1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                layout
                className="flex items-start gap-2 text-[9px] leading-tight"
              >
                <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
                <span
                  className={`${typeColors[log.type] || "text-zinc-400"} truncate`}
                >
                  {log.msg}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
export default SystemLog;
