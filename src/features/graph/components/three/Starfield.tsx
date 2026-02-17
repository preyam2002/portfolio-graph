import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Starfield: React.FC = () => {
  const starsRef = useRef<THREE.Points | null>(null);

  const [positions, colors] = useMemo(() => {
    const starsCount = 3000;
    const posArray = new Float32Array(starsCount * 3);
    const colorsArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 4000;
      posArray[i + 1] = (Math.random() - 0.5) * 4000;
      posArray[i + 2] = (Math.random() - 0.5) * 4000;

      const starType = Math.random();
      if (starType > 0.9) {
        colorsArray[i] = 0;
        colorsArray[i + 1] = 0.94; // Cyan-ish
        colorsArray[i + 2] = 1;
      } else if (starType > 0.8) {
        colorsArray[i] = 1;
        colorsArray[i + 1] = 0.2; // Magenta-ish
        colorsArray[i + 2] = 0.5;
      } else {
        colorsArray[i] = 0.8;
        colorsArray[i + 1] = 0.8;
        colorsArray[i + 2] = 0.9;
      }
    }

    return [posArray, colorsArray];
  }, []);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
      starsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={starsRef as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default Starfield;
