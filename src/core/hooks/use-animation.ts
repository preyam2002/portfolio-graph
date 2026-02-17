import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/store';

export const useAnimation = (fgRef: any) => {
  const { activeNode } = useStore();
  const rotationActive = useRef(true);

  useFrame((state) => {
    const { camera } = state;
    let angle = 0;

    if (rotationActive.current && !activeNode) {
      angle += 0.0005;
      const distance = 600;
      const x = distance * Math.sin(angle);
      const z = distance * Math.cos(angle);
      const y = Math.sin(angle * 0.2) * 200; 
      fgRef.current.cameraPosition({ x, y, z }, { x: 0, y: 0, z: 0 }, 10);
    }
  });

  useEffect(() => {
    rotationActive.current = !activeNode;
  }, [activeNode]);

  return rotationActive;
};
