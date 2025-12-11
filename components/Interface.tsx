import React, { useEffect, useState } from 'react';
import { Search, Command, Activity, Radio, Minimize2 } from 'lucide-react';
import { useStore } from '../store';
import { graphData } from '../data';
import { CLUSTER_COLORS, NodeType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const CommandPalette: React.FC = () => {
  const { isCmdPaletteOpen, setCmdPaletteOpen, setActiveNode } = useStore();
  const [query, setQuery] = useState('');

  // Toggle on CMD+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdPaletteOpen(!isCmdPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCmdPaletteOpen, setCmdPaletteOpen]);

  const filteredNodes = graphData.nodes.filter(n => 
    n.label.toLowerCase().includes(query.toLowerCase()) || 
    n.desc?.toLowerCase().includes(query.toLowerCase())
  );

  if (!isCmdPaletteOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-xl glass-panel border border-cyan-500/30 rounded-none shadow-[0_0_40px_rgba(0,240,255,0.1)] overflow-hidden flex flex-col max-h-[60vh]"
      >
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            autoFocus
            className="w-full bg-transparent px-4 text-white outline-none font-mono-tech text-xl placeholder-zinc-600 uppercase"
            placeholder="Execute search protocol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-[10px] text-zinc-500 font-mono-tech border border-zinc-800 px-2 py-1">ESC</div>
        </div>
        
        <div className="overflow-y-auto p-2 bg-black/40">
          {filteredNodes.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 font-mono-tech uppercase tracking-widest">
              Signal Lost. No nodes found.
            </div>
          ) : (
            filteredNodes.map(node => (
              <button
                key={node.id}
                onClick={() => {
                  setActiveNode(node);
                  setCmdPaletteOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-cyan-500/10 border-l-2 border-transparent hover:border-cyan-400 flex items-center gap-4 group transition-all"
              >
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" 
                  style={{ backgroundColor: CLUSTER_COLORS[node.type] }}
                />
                <div>
                  <div className="text-zinc-200 group-hover:text-cyan-300 font-medium font-mono-tech text-lg tracking-wide">{node.label}</div>
                  <div className="text-[10px] text-zinc-600 font-mono-tech uppercase tracking-widest flex items-center gap-2">
                    {node.type} 
                    <span className="w-1 h-1 bg-zinc-700 rounded-full"/> 
                    ID: {node.id}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="px-4 py-2 bg-black/60 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-600 font-mono-tech uppercase">
          <span>{filteredNodes.length} Results Found</span>
          <span>System Ready</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const NavBar: React.FC = () => {
  const { setCmdPaletteOpen, activeClusterFilter, setActiveClusterFilter } = useStore();
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <>
      {/* Top Left Logo */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed top-6 left-6 md:top-8 md:left-8 z-30 pointer-events-none select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-sm">
            <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_15px_#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tighter leading-none">
              OS<span className="text-cyan-400">.ME</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono-tech tracking-[0.2em] uppercase mt-1">
              Neural Interface v2.0
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Right Command */}
      <motion.div 
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 1 }}
         className="fixed top-6 right-6 md:top-8 md:right-8 z-30"
      >
        <button 
          onClick={() => setCmdPaletteOpen(true)}
          className="glass-panel px-4 py-2 flex items-center gap-3 text-sm text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-all group"
        >
          <span className="hidden md:inline font-mono-tech text-xs tracking-widest text-cyan-400">SYS.CMD</span>
          <Command className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
        </button>
      </motion.div>

      {/* Bottom Left Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-30"
      >
        <div className="glass-panel p-1 flex flex-col gap-1 transition-all duration-300 relative">
           {/* Header / Toggle */}
           <button 
             onClick={() => setMenuOpen(!menuOpen)}
             className="flex items-center justify-between p-2 w-full text-left md:w-48 hover:bg-white/5 group"
           >
              <span className="text-[10px] text-zinc-500 font-mono-tech uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                 Filter Matrix
              </span>
              <Minimize2 className={`w-3 h-3 text-zinc-600 transition-transform ${menuOpen ? '' : 'rotate-180'}`} />
           </button>

           <AnimatePresence>
             {menuOpen && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                 {Object.values(NodeType).map(type => {
                   if (type === NodeType.ROOT) return null;
                   const isActive = activeClusterFilter === type;
                   return (
                     <button
                       key={type}
                       onClick={() => setActiveClusterFilter(isActive ? 'all' : type)}
                       className={`
                         flex items-center gap-3 px-3 py-2 w-full text-left transition-all border-l-2
                         ${isActive ? 'bg-white/5 border-cyan-400' : 'hover:bg-white/5 border-transparent'}
                       `}
                     >
                       <div 
                         className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'shadow-[0_0_8px_currentColor] scale-125' : 'opacity-40'}`}
                         style={{ backgroundColor: CLUSTER_COLORS[type] }}
                       />
                       <span className={`text-xs uppercase tracking-wider font-mono-tech ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                         {type}
                       </span>
                       {isActive && <Radio className="w-3 h-3 ml-auto text-cyan-500" />}
                     </button>
                   )
                 })}
                 <button
                    onClick={() => setActiveClusterFilter('all')}
                    className={`
                       mt-1 w-full py-2 text-[10px] uppercase font-mono-tech text-center border-t border-white/5
                       ${activeClusterFilter === 'all' ? 'text-cyan-400 bg-cyan-950/20' : 'text-zinc-600 hover:text-zinc-400'}
                    `}
                  >
                    Reset Visuals
                  </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer decorative */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1.5 }}
         className="fixed bottom-8 right-8 z-30 text-right pointer-events-none select-none hidden md:block"
      >
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-4 bg-cyan-900/40" style={{ opacity: 0.2 + (i * 0.15) }} />
            ))}
          </div>
          <div className="text-[10px] text-zinc-600 font-mono-tech tracking-wider">
            SYSTEM STATUS: <span className="text-emerald-500">OPTIMAL</span><br/>
            MEMORY: 64TB / FRAME: 120FPS
          </div>
        </div>
      </motion.div>
    </>
  );
};

export { CommandPalette, NavBar };