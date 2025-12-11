import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Globe, Tag, Cpu, Code2, ArrowUpRight } from 'lucide-react';
import { useStore } from '../store';
import { CLUSTER_COLORS, NodeType } from '../types';

const containerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 200,
      staggerChildren: 0.1 
    } 
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { ease: 'easeInOut', duration: 0.3 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4 } 
  }
};

const DetailDrawer: React.FC = () => {
  const { activeNode, setActiveNode } = useStore();

  const handleClose = () => setActiveNode(null);

  if (!activeNode) return null;

  const color = CLUSTER_COLORS[activeNode.type];

  return (
    <AnimatePresence>
      {activeNode && (
        <>
          {/* Backdrop for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full md:w-[600px] glass-panel z-40 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto"
          >
            {/* Image Header with Gradient Overlay */}
            <motion.div variants={itemVariants} className="relative h-72 w-full overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg)] z-10 opacity-80" />
              {activeNode.img ? (
                <img 
                  src={activeNode.img} 
                  alt={activeNode.label} 
                  className="w-full h-full object-cover opacity-80 scale-105"
                />
              ) : (
                <div 
                  className="w-full h-full opacity-20" 
                  style={{ 
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)` 
                  }} 
                />
              )}
              
              <button 
                onClick={handleClose}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/5 backdrop-blur-md group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </motion.div>

            <div className="p-8 md:p-12 -mt-20 relative z-20">
              {/* Type Badge */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                <span 
                  className="w-2 h-2 rounded-full shadow-[0_0_12px_currentColor] animate-pulse" 
                  style={{ color: color, backgroundColor: color }}
                />
                <span className="text-xs uppercase tracking-[0.2em] text-cyan-200/70 font-mono-tech border border-cyan-500/20 px-2 py-0.5 rounded backdrop-blur-sm bg-cyan-950/30">
                  {activeNode.type} :: 00{Math.floor(activeNode.val)}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1 
                variants={itemVariants} 
                className="text-5xl md:text-6xl font-display font-bold text-white mb-6 uppercase leading-[0.85] tracking-tight"
                style={{ textShadow: `0 0 30px ${color}40` }}
              >
                {activeNode.label}
              </motion.h1>

              {/* Description */}
              <motion.div variants={itemVariants} className="prose prose-invert prose-lg text-zinc-300 font-light leading-relaxed mb-10 border-l-2 border-white/10 pl-6">
                <p>{activeNode.desc || "Data segment initialized. Waiting for input stream..."}</p>
              </motion.div>

              {/* Stats / Details Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-10">
                {activeNode.type === NodeType.PROJECT && (
                  <>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-lg backdrop-blur-sm hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                        <Calendar className="w-3 h-3" /> Release
                      </div>
                      <div className="text-xl font-display text-white">2024.Q1</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-lg backdrop-blur-sm hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                        <Globe className="w-3 h-3" /> Environment
                      </div>
                      <div className="text-xl font-display text-emerald-400">Live</div>
                    </div>
                  </>
                )}
                {/* Fallback stats for other nodes */}
                {activeNode.type !== NodeType.PROJECT && (
                   <div className="col-span-2 bg-white/5 border border-white/5 p-4 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-mono-tech">
                        <Cpu className="w-3 h-3" /> Compute Value
                      </div>
                      <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(activeNode.val * 8, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full" 
                          style={{ backgroundColor: color }} 
                        />
                      </div>
                   </div>
                )}
              </motion.div>

              {/* Tags */}
              {activeNode.tags && (
                <motion.div variants={itemVariants} className="mb-10">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-4 font-mono-tech flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Related Clusters
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/20 text-cyan-200 rounded text-xs font-mono-tech uppercase tracking-wide hover:bg-cyan-500/20 transition-colors cursor-default">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors font-mono-tech text-sm flex items-center justify-center gap-2 group">
                  <Code2 className="w-4 h-4" />
                  View Source
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                {activeNode.type === NodeType.PROJECT && (
                  <button className="flex-1 py-4 border border-white/20 text-white font-mono-tech uppercase tracking-widest hover:bg-white/5 transition-colors text-sm flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Launch
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailDrawer;