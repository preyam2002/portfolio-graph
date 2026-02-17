import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import GraphCanvas from "./features/graph/components/GraphCanvas";
import DetailDrawer from "./features/graph/components/DetailDrawer";
import { CommandPalette, NavBar } from "./features/graph/components/Interface";
import SystemLog from "./features/graph/components/SystemLog";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./core/components/ErrorBoundary";
import BootSequence from "./core/components/BootSequence";
import CRTOverlay from "./core/components/CRTOverlay";
import Portfolio from "./pages/Portfolio";

// Original 3D Graph Experience
const GraphExperience: React.FC = () => {
  const [booted, setBooted] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      <CRTOverlay />
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      <div
        className={`transition-opacity duration-1000 ${
          booted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Navigation & UI Layers */}
        <NavBar />
        <CommandPalette />
        <SystemLog />
        <DetailDrawer />

        {/* Background Graph */}
        <div className="absolute inset-0 z-0">
          <ErrorBoundary>{booted && <GraphCanvas />}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<GraphExperience />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
