import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Calendar,
  Globe,
  Tag,
  Cpu,
  Code2,
  ArrowUpRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { useStore } from "@/store";
import { CLUSTER_COLORS, NodeType } from "@/types";
import { useSound } from "../hooks/use-sound";

const containerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
      staggerChildren: 0.08,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { ease: "easeInOut", duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 200 },
  },
};

const DetailDrawer: React.FC = () => {
  const { activeNode, setActiveNode } = useStore();
  const { playHover, playClick } = useSound();

  const handleClose = () => {
    playClick();
    setActiveNode(null);
  };

  // Play sound when drawer opens
  useEffect(() => {
    if (activeNode) {
      playClick();
    }
  }, [activeNode, playClick]);

  const color = activeNode ? CLUSTER_COLORS[activeNode.type] : "#00ffff";

  return (
    <AnimatePresence>
      {activeNode && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-30"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full md:w-[550px] glass-premium z-40 border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            style={{
              borderColor: `${color}30`,
              boxShadow: `0 0 100px -20px ${color}20`,
            }}
          >
            {/* Animated Background Lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[1px] h-full bg-gradient-to-b from-transparent to-transparent"
                  style={{
                    right: 20 + i * 30,
                    backgroundImage: `linear-gradient(to bottom, transparent, ${color}30, transparent)`,
                  }}
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-full relative z-10 custom-scrollbar">
              {/* Header Image/Gradient */}
              <motion.div
                variants={itemVariants}
                className="relative h-64 w-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f] z-10" />
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${color}40 0%, transparent 60%)`,
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: color,
                      left: `${10 + i * 12}%`,
                      top: "50%",
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  onMouseEnter={playHover}
                  className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/40 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <div className="px-8 pb-10 -mt-16 relative z-20">
                {/* Type Badge */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 mb-5"
                >
                  <motion.span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 20px ${color}`,
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span
                    className="text-xs uppercase tracking-[0.2em] font-mono-tech border px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm"
                    style={{
                      borderColor: `${color}40`,
                      color: color,
                    }}
                  >
                    {activeNode.type}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight break-words"
                  style={{ textShadow: `0 0 30px ${color}30` }}
                >
                  {activeNode.label}
                </motion.h1>

                {/* Description */}
                <motion.div
                  variants={itemVariants}
                  className="text-zinc-400 leading-relaxed mb-8 border-l-2 pl-5"
                  style={{ borderColor: color }}
                >
                  <p className="text-lg">
                    {activeNode.desc ||
                      "Neural pathway initialized. Awaiting data stream input..."}
                  </p>
                </motion.div>

                {/* Type-specific Stats */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-3 mb-8"
                >
                  {/* Power Level - always show */}
                  <motion.div
                    whileHover={{ scale: 1.02, borderColor: color }}
                    onMouseEnter={playHover}
                    className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                      <Cpu className="w-3 h-3" /> Power Level
                    </div>
                    <div className="text-2xl font-display text-white">
                      {activeNode.val?.toFixed(1) || "N/A"}
                    </div>
                  </motion.div>

                  {/* Type-specific stat */}
                  {activeNode.rating !== undefined && (
                    <motion.div
                      whileHover={{ scale: 1.02, borderColor: color }}
                      onMouseEnter={playHover}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                        <Sparkles className="w-3 h-3" /> Rating
                      </div>
                      <div className="text-2xl font-display text-amber-400">
                        {activeNode.rating}/10
                      </div>
                    </motion.div>
                  )}

                  {activeNode.year !== undefined && (
                    <motion.div
                      whileHover={{ scale: 1.02, borderColor: color }}
                      onMouseEnter={playHover}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                        <Calendar className="w-3 h-3" /> Year
                      </div>
                      <div className="text-2xl font-display text-white">
                        {activeNode.year}
                      </div>
                    </motion.div>
                  )}

                  {activeNode.genre && !activeNode.rating && (
                    <motion.div
                      whileHover={{ scale: 1.02, borderColor: color }}
                      onMouseEnter={playHover}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                        <Tag className="w-3 h-3" /> Genre
                      </div>
                      <div className="text-xl font-display text-white truncate">
                        {activeNode.genre}
                      </div>
                    </motion.div>
                  )}

                  {/* Status - show when no other specific stats */}
                  {!activeNode.rating && !activeNode.year && (
                    <motion.div
                      whileHover={{ scale: 1.02, borderColor: color }}
                      onMouseEnter={playHover}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                        <Zap className="w-3 h-3" /> Status
                      </div>
                      <div className="text-2xl font-display text-emerald-400">
                        Active
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Energy Bar */}
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 font-mono-tech">
                    Connection Strength
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((activeNode.val || 5) * 10, 100)}%`,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}`,
                      }}
                    />
                  </div>
                </motion.div>

                {/* Tags */}
                {activeNode.tags && (
                  <motion.div variants={itemVariants} className="mb-8">
                    <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-4 font-mono-tech flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Related Clusters
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeNode.tags.map((tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: `${color}20`,
                          }}
                          onMouseEnter={playHover}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-zinc-300 rounded-lg text-xs font-mono-tech uppercase tracking-wide cursor-default transition-colors hover:text-white"
                          style={{ borderColor: `${color}20` }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                >
                  {(activeNode.github || activeNode.link) && (
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: `0 0 30px ${color}30`,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playClick();
                        window.open(
                          activeNode.github || activeNode.link,
                          "_blank",
                        );
                      }}
                      onMouseEnter={playHover}
                      className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest font-mono-tech text-sm flex items-center justify-center gap-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                      <Code2 className="w-4 h-4" />
                      {activeNode.github ? "View Source" : "View Details"}
                      <ArrowUpRight className="w-4 h-4 opacity-50" />
                    </motion.button>
                  )}

                  {activeNode.type === NodeType.PROJECT && activeNode.link && (
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        borderColor: color,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playClick();
                        window.open(activeNode.link, "_blank");
                      }}
                      onMouseEnter={playHover}
                      className="flex-1 py-4 border border-white/20 text-white font-mono-tech uppercase tracking-widest text-sm flex items-center justify-center gap-2 rounded-lg transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Launch
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailDrawer;
