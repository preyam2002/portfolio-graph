import React, { useState, useEffect, ErrorInfo } from 'react';
import { HashRouter } from 'react-router-dom';
import GraphCanvas from './components/GraphCanvas';
import DetailDrawer from './components/DetailDrawer';
import { CommandPalette, NavBar } from './components/Interface';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: string;
}

// Error Boundary to catch render crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: '' };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error: error.toString() };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-black text-red-500 font-mono p-8 relative z-[9999]">
          <div className="border border-red-900 p-8 bg-red-950/20 max-w-lg">
            <h1 className="text-xl font-bold mb-4">SYSTEM FAILURE</h1>
            <p className="mb-4">The neural interface encountered a critical error.</p>
            <pre className="text-xs bg-black p-4 overflow-auto border border-red-900/50 max-h-48">
              {this.state.error}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-red-900/50 hover:bg-red-800 text-white uppercase text-sm tracking-widest cursor-pointer"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Boot Sequence Component
const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [text, setText] = useState('INITIALIZING...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Safety timeout: Ensure we finish even if logic hangs
    const safetyTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    const texts = [
      'LOADING CORE KERNEL...',
      'MOUNTING NEURAL VOLUMES...',
      'CALIBRATING OPTICS...',
      'ESTABLISHING LINK...'
    ];
    let step = 0;
    
    // Text cycle
    const textInterval = setInterval(() => {
      step++;
      if (step < texts.length) {
        setText(texts[step]);
      }
    }, 600);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(onComplete, 500); // Small delay at 100%
          clearTimeout(safetyTimer);
          return 100;
        }
        return prev + Math.random() * 8; // Faster boot
      });
    }, 80);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearTimeout(safetyTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono-tech text-cyan-500 select-none"
    >
      <div className="w-64 mb-4 flex justify-between text-xs tracking-[0.2em] text-zinc-500">
        <span>BIOS v2.0.4</span>
        <span>SECURE BOOT</span>
      </div>
      
      <div className="text-2xl md:text-4xl font-bold tracking-widest mb-8 text-white relative">
        <span className="text-glow">{text}</span>
      </div>

      <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden relative">
        <motion.div 
          className="h-full bg-cyan-400 shadow-[0_0_15px_#00f0ff]"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-2 w-64 flex justify-between text-xs text-cyan-700">
        <span>{Math.floor(progress)}%</span>
        <span>00FF04X</span>
      </div>
    </motion.div>
  );
};

const AppContent: React.FC = () => {
  const [booted, setBooted] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 ${booted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Navigation & UI Layers */}
        <NavBar />
        <CommandPalette />
        <DetailDrawer />
        
        {/* Background Graph - Persistent and isolated in ErrorBoundary */}
        <div className="absolute inset-0 z-0">
          <ErrorBoundary>
            {/* Only render graph when booted to save resources during animation */}
            {booted && <GraphCanvas />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;