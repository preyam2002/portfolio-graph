import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "../../features/graph/hooks/use-sound";

const BOOT_MESSAGES = [
  { text: "INITIALIZING NEURAL CORE...", delay: 0 },
  { text: "LOADING SYNAPTIC DRIVERS...", delay: 400 },
  { text: "MOUNTING MEMORY CLUSTERS...", delay: 800 },
  { text: "CALIBRATING OPTIC INTERFACE...", delay: 1200 },
  { text: "ESTABLISHING QUANTUM LINK...", delay: 1600 },
  { text: "SYNCHRONIZING TIMELINES...", delay: 2000 },
  { text: "ACCESS GRANTED", delay: 2400 },
];

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playBoot } = useSound();

  // Skip handler
  const handleSkip = () => {
    setIsSkipping(true);
    setTimeout(onComplete, 200);
  };

  // Matrix rain effect
  useEffect(() => {
    playBoot();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
    const drops: number[] = [];
    const columns = Math.floor(canvas.width / 14);

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = drops[i] * 14;

        // Gradient from cyan to dark
        const brightness = Math.max(0, 1 - drops[i] / 30);
        ctx.fillStyle = `rgba(0, ${180 + brightness * 75}, ${
          200 + brightness * 55
        }, ${0.5 + brightness * 0.5})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    return () => clearInterval(interval);
  }, []);

  // Progress and message animation - FASTER
  useEffect(() => {
    if (isSkipping) return;

    const safetyTimer = setTimeout(onComplete, 3500);

    // Show logo after a moment
    setTimeout(() => setShowLogo(true), 150);

    // Progress animation - FASTER
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + (prev > 80 ? 2 : 4 + Math.random() * 4);
      });
    }, 50);

    // Message sequence
    BOOT_MESSAGES.forEach((msg, index) => {
      setTimeout(() => setCurrentMessage(index), msg.delay);
    });

    return () => {
      clearInterval(progressInterval);
      clearTimeout(safetyTimer);
    };
  }, [onComplete, isSkipping]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05, filter: "blur(30px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono-tech select-none overflow-hidden"
    >
      {/* Matrix Rain Background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* Logo */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-16 h-16 border-2 border-cyan-500/50 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0,240,255,0.3)",
                      "0 0 40px rgba(0,240,255,0.6)",
                      "0 0 20px rgba(0,240,255,0.3)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-6 h-6 bg-cyan-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-5xl font-display font-bold text-white tracking-tight">
                    OS<span className="text-cyan-400">.ME</span>
                  </h1>
                  <p className="text-xs text-cyan-600 tracking-[0.3em] uppercase mt-1">
                    Neural Interface System
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boot Messages */}
        <div className="h-12 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl font-bold tracking-widest text-center"
              style={{
                color:
                  currentMessage === BOOT_MESSAGES.length - 1
                    ? "#22d3ee"
                    : "#ffffff",
                textShadow: "0 0 30px rgba(34, 211, 238, 0.5)",
              }}
            >
              {BOOT_MESSAGES[currentMessage]?.text}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar Container */}
        <div className="w-80 md:w-96">
          {/* Progress Bar */}
          <div className="h-1 bg-zinc-900 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #0891b2, #22d3ee, #67e8f9)",
                boxShadow: "0 0 20px #22d3ee, 0 0 40px #22d3ee",
              }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Stats */}
          <div className="mt-4 flex justify-between text-[10px] text-cyan-700 tracking-wider uppercase">
            <span>MEM: {Math.floor(progress * 6.4)}GB / 640GB</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {Math.floor(progress)}%
            </motion.span>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyan-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleSkip}
          className="mt-8 px-6 py-2 text-[11px] text-cyan-600 font-mono-tech uppercase tracking-[0.2em] 
                     border border-cyan-800/50 hover:border-cyan-500/50 hover:text-cyan-400 
                     transition-all duration-300 rounded backdrop-blur-sm
                     hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip Intro →
        </motion.button>
      </div>

      {/* Corner Tech Elements */}
      <div className="absolute top-8 left-8 text-[10px] text-cyan-900 font-mono-tech tracking-wider">
        <div>BIOS v4.2.1</div>
        <div className="text-cyan-600 animate-pulse">SECURE BOOT ENABLED</div>
      </div>

      <div className="absolute top-8 right-8 text-[10px] text-cyan-900 font-mono-tech tracking-wider text-right">
        <div>CORE: QUANTUM-X7</div>
        <div>STATUS: INITIALIZING</div>
      </div>

      <div className="absolute bottom-8 left-8 text-[10px] text-cyan-900 font-mono-tech tracking-wider">
        <div>© 2026 OS.ME CORP</div>
      </div>

      <div className="absolute bottom-8 right-8 text-[10px] text-cyan-900 font-mono-tech tracking-wider text-right">
        <div>BUILD: {new Date().toISOString().split("T")[0]}</div>
      </div>
    </motion.div>
  );
};

export default BootSequence;
