import { useEffect } from "react";
import * as THREE from "three";

// Simple hook to handle any necessary per-frame updates not handled by the force graph
export const useAnimation = (fgRef: any) => {
  useEffect(() => {
    let frameId: number;

    const animate = () => {
      // If we need global tween updating or other per-frame logic
      // TWEEN.update(); // If we were using TWEEN explicitly

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [fgRef]);
};
