import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Command,
  Activity,
  Radio,
  Minimize2,
  Zap,
  Cpu,
  Database,
  ArrowDown,
  ArrowUp,
  Layout,
  Globe,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useStore } from "@/store";
import { graphData } from "@/data";
import { CLUSTER_COLORS, NodeType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "../hooks/use-sound";
import { Link, useNavigate } from "react-router-dom";

const CommandPalette: React.FC = () => {
  const { isCmdPaletteOpen, setCmdPaletteOpen, setActiveNode } = useStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { playHover, playClick, playType } = useSound();

  const filteredNodes = graphData.nodes
    .filter(
      (n) =>
        n.label.toLowerCase().includes(query.toLowerCase()) ||
        n.desc?.toLowerCase().includes(query.toLowerCase()) ||
        n.type.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 20);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdPaletteOpen(!isCmdPaletteOpen);
      }
      if (e.key === "Escape") {
        setCmdPaletteOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCmdPaletteOpen, setCmdPaletteOpen]);

  // Reset selection when query or open state changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isCmdPaletteOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredNodes.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredNodes[selectedIndex]) {
      e.preventDefault();
      setActiveNode(filteredNodes[selectedIndex]);
      setCmdPaletteOpen(false);
    }
  };

  if (!isCmdPaletteOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-md"
      onClick={() => setCmdPaletteOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-premium rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[65vh] border border-white/10"
      >
        {/* Search Header */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-white/5">
          <Search className="w-5 h-5 text-cyan-400 animate-pulse" />
          <input
            ref={inputRef}
            autoFocus
            className="w-full bg-transparent px-4 text-white outline-none font-mono-tech text-lg placeholder-zinc-500 tracking-wide"
            placeholder="Search nodes, projects, skills..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              playType();
            }}
            onKeyDown={(e) => {
              handleKeyDown(e);
              if (e.key === "ArrowUp" || e.key === "ArrowDown") playHover();
              if (e.key === "Enter") playClick();
            }}
          />
          <div className="hidden md:flex items-center gap-1 mr-3 text-[10px] text-zinc-500 font-mono-tech">
            <ArrowUp className="w-3 h-3" />
            <ArrowDown className="w-3 h-3" />
            <span>navigate</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            onMouseEnter={playHover}
            className="text-[10px] text-zinc-400 font-mono-tech border border-zinc-700 px-2 py-1 rounded cursor-pointer hover:border-cyan-500 hover:text-cyan-400 transition-colors"
            onClick={() => {
              playClick();
              setCmdPaletteOpen(false);
            }}
          >
            ESC
          </motion.div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-2 bg-black/40 flex-1 custom-scrollbar">
          {filteredNodes.length === 0 ? (
            <div className="p-12 text-center">
              <Cpu className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <div className="text-zinc-500 font-mono-tech uppercase tracking-widest">
                No matching nodes found
              </div>
              <div className="text-zinc-600 font-mono-tech text-sm mt-2">
                Try searching by name, type, or description
              </div>
            </div>
          ) : (
            filteredNodes.map((node, index) => {
              const isSelected = index === selectedIndex;
              return (
                <motion.button
                  key={node.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.015 }}
                  onClick={() => {
                    playClick();
                    setActiveNode(node);
                    setCmdPaletteOpen(false);
                  }}
                  onMouseEnter={() => {
                    setSelectedIndex(index);
                    playHover();
                  }}
                  className={`w-full text-left p-3 border-l-2 flex items-center gap-4 group transition-all duration-200 rounded-r-lg mb-1 ${
                    isSelected
                      ? "bg-cyan-500/10 border-cyan-400"
                      : "border-transparent hover:bg-white/5 hover:border-white/20"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.5 }}
                    className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ml-2"
                    style={{ backgroundColor: CLUSTER_COLORS[node.type] }}
                  />
                  <div className="flex-1">
                    <div
                      className={`font-medium font-mono-tech text-sm tracking-wide transition-colors ${isSelected ? "text-cyan-300" : "text-zinc-300 group-hover:text-white"}`}
                    >
                      {node.label}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono-tech uppercase tracking-widest flex items-center gap-2 mt-0.5">
                      <span style={{ color: CLUSTER_COLORS[node.type] }}>
                        {node.type}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Zap className="w-4 h-4 text-cyan-400" />}
                </motion.button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono-tech uppercase">
          <span className="flex items-center gap-2">
            <Database className="w-3 h-3" />
            {filteredNodes.length} nodes indexed
          </span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            System Online
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const NavBar: React.FC = () => {
  const {
    setCmdPaletteOpen,
    activeClusterFilter,
    setActiveClusterFilter,
    hoverNode,
    isMuted,
    toggleMute,
  } = useStore();
  const [menuOpen, setMenuOpen] = useState(true);
  const { playHover, playClick } = useSound();
  const navigate = useNavigate();

  return (
    <>
      {/* Top Bar Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-start z-30 pointer-events-none"
      >
        {/* Left: Logo & Navigation */}
        <div className="flex flex-col gap-6 pointer-events-auto">
          <motion.div
            className="flex items-center gap-4 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={playHover}
            onClick={playClick}
          >
            <motion.div
              className="w-12 h-12 border border-cyan-500/30 bg-black/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.2)] group-hover:border-cyan-400/50 transition-colors rounded-lg"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,240,255,0.2)",
                  "0 0 30px rgba(0,240,255,0.4)",
                  "0 0 20px rgba(0,240,255,0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-5 h-5 bg-cyan-500 rounded-full shadow-[0_0_15px_#00f0ff]" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight leading-none text-glow">
                OS<span className="text-cyan-400">.ME</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono-tech tracking-[0.25em] uppercase mt-1 group-hover:text-cyan-600 transition-colors">
                Neural Interface v2.0
              </p>
            </div>
          </motion.div>

          {/* Navigation Link */}
          <Link to="/portfolio" onClick={playClick}>
            <motion.button
              whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
              onMouseEnter={playHover}
              className="flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-all group w-max"
            >
              <Layout className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono-tech uppercase tracking-widest">
                Standard View
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Right: Search / Actions */}
        <div className="flex gap-4 pointer-events-auto">
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toggleMute();
              if (isMuted) {
                // turning ON sound, maybe play a blip?
                // playClick won't work immediately if it reads old state in closure?
                // actually toggleMute updates store, component re-renders.
                // But playClick from useSound hook might refer to old isMuted?
                // useSound depends on isMuted?
                // Yes, I added [isMuted] dependency to playClick.
                // So playClick will be recreated.
                // But inside THIS render, playClick captures OLD isMuted.
                // So calling it here uses OLD isMuted.
                // If isMuted was true (muted), playClick returns early.
                // So no sound on unmute click. That's fine.
                // If isMuted was false (sound on), playClick plays.
                // Then we mute.
                // So user hears click then silence. Correct.
                playClick();
              }
            }}
            className="glass-panel p-3 border border-white/10 rounded-lg bg-black/40 text-zinc-400 hover:text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(0, 240, 255, 0.1)",
              borderColor: "rgba(0, 240, 255, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClick();
              setCmdPaletteOpen(true);
            }}
            onMouseEnter={playHover}
            aria-label="Open search (⌘K)"
            className="glass-panel px-4 py-3 md:px-5 md:py-3 flex items-center gap-3 text-sm border border-white/10 transition-all group shadow-lg rounded-lg bg-black/40"
          >
            <Search className="w-4 h-4 md:hidden text-cyan-400" />
            <span className="hidden md:inline font-mono-tech text-xs tracking-widest text-cyan-400 group-hover:text-cyan-300">
              SEARCH
            </span>
            <span className="hidden md:inline ml-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-zinc-400">
              ⌘K
            </span>
            <Command className="hidden md:block w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors ml-1" />
          </motion.button>
        </div>
      </motion.div>

      {/* Hover Node Indicator */}
      <AnimatePresence>
        {hoverNode && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-20 glass-premium px-6 py-3 border border-white/10 rounded-full shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                layoutId="hover-indicator"
                className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]"
                style={{
                  backgroundColor: CLUSTER_COLORS[hoverNode.type as NodeType],
                }}
              />
              <span className="font-display text-base text-white tracking-wide">
                {hoverNode.label}
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-500 uppercase border-l border-white/10 pl-3">
                {hoverNode.type}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Left Filter Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-30"
      >
        <div className="glass-premium p-1 flex flex-col gap-1 transition-all duration-300 border border-white/10 hover:border-cyan-500/20 rounded-lg bg-black/40">
          <button
            onClick={() => {
              playClick();
              setMenuOpen(!menuOpen);
            }}
            onMouseEnter={playHover}
            className="flex items-center justify-between p-3 w-full text-left md:w-52 hover:bg-white/5 group transition-colors rounded-md"
          >
            <span className="text-[10px] text-zinc-400 font-mono-tech uppercase tracking-widest group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Filter Data
            </span>
            <motion.div animate={{ rotate: menuOpen ? 0 : 180 }}>
              <Minimize2 className="w-3 h-3 text-zinc-600" />
            </motion.div>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {Object.values(NodeType).map((type, index) => {
                  if (type === NodeType.ROOT) return null;
                  const isActive = activeClusterFilter === type;
                  return (
                    <motion.button
                      key={type}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        playClick();
                        setActiveClusterFilter(isActive ? "all" : type);
                      }}
                      onMouseEnter={playHover}
                      className={`
                        flex items-center gap-3 px-4 py-2 w-full text-left transition-all border-l-2 rounded-r-md my-0.5
                        ${
                          isActive
                            ? "bg-white/5 border-cyan-400"
                            : "hover:bg-white/5 border-transparent hover:border-cyan-400/50"
                        }
                      `}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.3 : 1 }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          isActive
                            ? "shadow-[0_0_10px_currentColor]"
                            : "opacity-50"
                        }`}
                        style={{ backgroundColor: CLUSTER_COLORS[type] }}
                      />
                      <span
                        className={`text-xs uppercase tracking-wider font-mono-tech ${
                          isActive ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {type}
                      </span>
                      {isActive && (
                        <Radio className="w-3 h-3 ml-auto text-cyan-500" />
                      )}
                    </motion.button>
                  );
                })}
                <motion.button
                  whileHover={{ backgroundColor: "rgba(0,240,255,0.1)" }}
                  onClick={() => {
                    playClick();
                    setActiveClusterFilter("all");
                  }}
                  onMouseEnter={playHover}
                  className={`
                    mt-1 w-full py-2.5 text-[10px] uppercase font-mono-tech text-center border-t border-white/5 transition-colors rounded-b-md
                    ${
                      activeClusterFilter === "all"
                        ? "text-cyan-400 bg-cyan-950/30"
                        : "text-zinc-500 hover:text-cyan-400"
                    }
                  `}
                >
                  Reset Filter
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Right Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-8 right-8 z-30 text-right pointer-events-none select-none hidden md:block"
      >
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-cyan-500/30"
                animate={{ height: [8, 16 + Math.random() * 8, 8] }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono-tech tracking-wider glass-panel px-3 py-2 rounded border border-white/5">
            STATUS: <span className="text-emerald-400">ONLINE</span>
            <span className="mx-2">|</span>
            <span className="text-zinc-400">
              NODES: {graphData.nodes.length}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export { CommandPalette, NavBar };
