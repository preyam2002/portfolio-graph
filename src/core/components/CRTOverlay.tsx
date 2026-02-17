import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CRTOverlay: React.FC = () => {
  const [flicker, setFlicker] = useState(false);

  // Random flicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.97) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 50 + Math.random() * 100);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
      />

      {/* RGB Shift / Chromatic Aberration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `linear-gradient(90deg, 
            rgba(255, 0, 0, 0.5) 0%, 
            transparent 3%, 
            transparent 97%, 
            rgba(0, 0, 255, 0.5) 100%
          )`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%)`,
        }}
      />

      {/* Glowing edges */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Flicker overlay */}
      <motion.div
        className="absolute inset-0 bg-white mix-blend-overlay"
        animate={{ opacity: flicker ? 0.05 : 0 }}
        transition={{ duration: 0.05 }}
      />

      {/* Horizontal scan line that moves */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-cyan-500/10"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/20" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-500/20" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-500/20" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-500/20" />
    </div>
  );
};

export default CRTOverlay;
