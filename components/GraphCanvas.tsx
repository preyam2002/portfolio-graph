import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useStore } from '../store';
import { graphData } from '../data';
import { CLUSTER_COLORS, GraphNode, NodeType } from '../types';
import * as THREE from 'three';

const GraphCanvas: React.FC = () => {
  const fgRef = useRef<any>();
  const starsRef = useRef<THREE.Points | null>(null);
  const nodeObjectsRef = useRef<Map<string, THREE.Group>>(new Map());
  
  // Camera Trail Refs
  const trailRef = useRef<THREE.Line | null>(null);
  const trailPositions = useRef<THREE.Vector3[]>([]);
  const MAX_TRAIL_POINTS = 100;

  const [rotationActive, setRotationActive] = useState(true);
  const { 
    setActiveNode, 
    setHoverNode, 
    setCameraRef, 
    activeClusterFilter,
    activeNode 
  } = useStore();

  // Create reusable particle texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(0, 240, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Helper: Create Text Sprite Natively (No external dependency)
  const createTextSprite = useCallback((text: string, color: string, fontSize: number = 40) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Sprite();

    const font = `bold ${fontSize}px "Rajdhani", sans-serif`;
    ctx.font = font;
    const textWidth = ctx.measureText(text).width || 100; // Fallback width
    
    // Add padding with safety min width
    canvas.width = Math.max(textWidth + 40, 80);
    canvas.height = fontSize + 40;

    // Redefine font after resize (canvas reset)
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Glow effect
    ctx.shadowColor = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true,
      depthWrite: false,
      depthTest: false // Always show label on top
    });
    
    const sprite = new THREE.Sprite(material);
    // Scale sprite to match aspect ratio
    const scaleFactor = 0.12; 
    sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);
    
    return sprite;
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      setCameraRef(fgRef.current);
      
      const scene = fgRef.current.scene();

      // --- Starfield ---
      const starsGeometry = new THREE.BufferGeometry();
      const starsCount = 2000;
      const posArray = new Float32Array(starsCount * 3);
      const colorsArray = new Float32Array(starsCount * 3);
      
      for(let i = 0; i < starsCount * 3; i+=3) {
        posArray[i] = (Math.random() - 0.5) * 3000;
        posArray[i+1] = (Math.random() - 0.5) * 3000;
        posArray[i+2] = (Math.random() - 0.5) * 3000;
        
        const starType = Math.random();
        if (starType > 0.9) {
          colorsArray[i] = 0;
          colorsArray[i+1] = 0.94; // Cyan-ish
          colorsArray[i+2] = 1;
        } else if (starType > 0.8) {
           colorsArray[i] = 1;
           colorsArray[i+1] = 0.2; // Magenta-ish
           colorsArray[i+2] = 0.5;
        } else {
          colorsArray[i] = 0.7;
          colorsArray[i+1] = 0.7;
          colorsArray[i+2] = 0.8;
        }
      }
      
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
      
      const starsMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const starMesh = new THREE.Points(starsGeometry, starsMaterial);
      starsRef.current = starMesh;
      scene.add(starMesh);

      // --- Camera Trail ---
      const trailGeometry = new THREE.BufferGeometry();
      // Initialize with empty buffer
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_TRAIL_POINTS * 3), 3));
      trailGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_TRAIL_POINTS * 3), 3));
      
      const trailMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        depthTest: false, // Make it visible through objects
        linewidth: 2, 
      });
      
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      trail.frustumCulled = false; // Always render
      trailRef.current = trail;
      scene.add(trail);

      // --- Lights ---
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(200, 200, 200);
      scene.add(dirLight);

      const blueLight = new THREE.PointLight(0x00f0ff, 0.8, 1000);
      blueLight.position.set(-200, 100, 200);
      scene.add(blueLight);

      // --- Force Config ---
      fgRef.current.d3Force('charge').strength(-300); // Increased repulsion
      fgRef.current.d3Force('link').distance(100);
      
      // Initial fly-in
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 600 });
    }
  }, [setCameraRef]);

  // Animation Loop (Pulse, Rotation, Trail)
  useEffect(() => {
    if (!fgRef.current) return;
    let frameId: number;
    let angle = 0;

    const animate = () => {
      const time = Date.now() * 0.003; // Time factor for pulse
      
      // 1. Rotate Stars
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0001;
        starsRef.current.rotation.x += 0.00005;
      }

      // 2. Rotate Camera (Idle)
      if (rotationActive && !activeNode) {
        angle += 0.0005;
        const distance = 600;
        const x = distance * Math.sin(angle);
        const z = distance * Math.cos(angle);
        const y = Math.sin(angle * 0.2) * 200; 
        fgRef.current.cameraPosition({ x, y, z }, { x: 0, y: 0, z: 0 }, 10); // Look at center
      }

      // 3. Pulse Nodes
      nodeObjectsRef.current.forEach((group, id) => {
        // Rotate the geometric mesh inside the group
        const mainMesh = group.getObjectByName('mainMesh');
        if (mainMesh) {
            mainMesh.rotation.x += 0.005;
            mainMesh.rotation.y += 0.005;
        }

        const sprite = group.getObjectByName('glowSprite');
        if (sprite) {
           const val = group.userData.val || 10;
           const baseScale = group.userData.baseScale || 10;
           const baseOpacity = group.userData.baseOpacity || 0.5;
           
           // Create organic pulse based on time and node value/id hash
           // Using charCodeAt to randomize phase
           const phase = id.charCodeAt(0) * 0.1; 
           const pulse = 1 + Math.sin(time + phase) * 0.15; // +/- 15% size
           
           sprite.scale.set(baseScale * pulse, baseScale * pulse, 1);
           
           // Also pulse opacity slightly
           const opacityPulse = 1 + Math.sin(time * 1.5 + phase) * 0.2;
           (sprite as THREE.Sprite).material.opacity = Math.max(0, Math.min(1, baseOpacity * opacityPulse));
        }
      });

      // 4. Update Camera Trail
      if (trailRef.current) {
        const camera = fgRef.current.camera();
        const currentPos = camera.position.clone();
        
        // Add point if moved
        const lastPos = trailPositions.current.length > 0 ? trailPositions.current[trailPositions.current.length - 1] : null;
        
        // Threshold to avoid adding points when still
        if (!lastPos || lastPos.distanceTo(currentPos) > 1.0) {
          trailPositions.current.push(currentPos);
          if (trailPositions.current.length > MAX_TRAIL_POINTS) {
            trailPositions.current.shift();
          }
        }
        
        // Always update geometry to handle the "snake" effect
        const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
        const colors = trailRef.current.geometry.attributes.color.array as Float32Array;
        
        const pointCount = trailPositions.current.length;
        
        for (let i = 0; i < pointCount; i++) {
           const p = trailPositions.current[i];
           positions[i * 3] = p.x;
           positions[i * 3 + 1] = p.y;
           positions[i * 3 + 2] = p.z;
           
           // Fade color from head (index = pointCount - 1) to tail (index = 0)
           const alpha = i / Math.max(1, pointCount - 1);
           
           // Cyan Trail
           // Use alpha to fade to black (since AdditiveBlending, black = transparent)
           colors[i * 3] = 0;
           colors[i * 3 + 1] = 0.94 * alpha; 
           colors[i * 3 + 2] = 1.0 * alpha;
        }
        
        // Update draw range
        trailRef.current.geometry.setDrawRange(0, pointCount);
        trailRef.current.geometry.attributes.position.needsUpdate = true;
        trailRef.current.geometry.attributes.color.needsUpdate = true;
      }

      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(frameId);
  }, [rotationActive, activeNode]);

  const filteredData = useMemo(() => {
    if (activeClusterFilter === 'all') return graphData;
    
    const nodes = graphData.nodes.filter(
      n => n.type === activeClusterFilter || n.type === NodeType.ROOT
    );
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = graphData.links.filter(l => {
      const source = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
      const target = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
      return nodeIds.has(source as string) && nodeIds.has(target as string);
    });
    
    return { nodes, links };
  }, [activeClusterFilter]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (!node) return;
    setActiveNode(node);
    setRotationActive(false);
    
    // Safety check for coordinates
    const nx = node.x || 0;
    const ny = node.y || 0;
    const nz = node.z || 0;
    
    const distance = 120;
    // Prevent div by zero
    const currentDist = Math.hypot(nx, ny, nz) || 1;
    const distRatio = 1 + distance / currentDist;

    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: nx * distRatio, y: ny * distRatio, z: nz * distRatio },
        node,
        1500
      );
    }
  }, [setActiveNode]);

  const handleBackgroundClick = useCallback(() => {
    setActiveNode(null);
    setRotationActive(true);
  }, [setActiveNode]);

  const createNodeObject = useCallback((node: GraphNode) => {
    if (!node) return new THREE.Object3D(); // Safety
    
    const color = CLUSTER_COLORS[node.type as NodeType] || '#ffffff';
    const isActive = activeNode?.id === node.id;
    const group = new THREE.Group();
    
    // Store in Ref Map for animation loop access
    nodeObjectsRef.current.set(node.id, group);
    
    let mesh;
    // Enhanced Material
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 1, // Full opacity for main mesh
      emissive: color,
      emissiveIntensity: isActive ? 0.8 : 0.4
    });

    // Geometric Shapes based on Type
    if (node.type === NodeType.ROOT) {
      const geometry = new THREE.OctahedronGeometry(node.val * 0.8, 0);
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'mainMesh';
      
      const wireGeo = new THREE.IcosahedronGeometry(node.val * 1.2, 1);
      const wireMat = new THREE.MeshBasicMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.3 });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      group.add(wire);
      
    } else if (node.type === NodeType.PROJECT) {
      const geometry = new THREE.BoxGeometry(node.val, node.val, node.val);
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'mainMesh';
      
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
      group.add(line);
      
    } else if (node.type === NodeType.SKILL) {
      const geometry = new THREE.TetrahedronGeometry(node.val * 0.8);
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'mainMesh';
    } else {
      const geometry = new THREE.SphereGeometry(node.val * 0.5, 16, 16);
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'mainMesh';
    }

    group.add(mesh);

    // Glow Sprite (reused texture)
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: particleTexture, // Reuse texture
      color: color, 
      transparent: true, 
      opacity: isActive ? 1.0 : 0.6, 
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    const scale = isActive ? node.val * 8 : node.val * 5;
    sprite.scale.set(scale, scale, 1);
    sprite.name = 'glowSprite'; // Named for animation finding
    group.add(sprite);
    
    // Store animated props in userData
    group.userData = {
      val: node.val,
      baseScale: scale,
      baseOpacity: isActive ? 1.0 : 0.6
    };

    // Label using Native Canvas Sprite (No library)
    const textSprite = createTextSprite(
        node.label, 
        isActive ? '#ffffff' : 'rgba(255,255,255,0.9)',
        40
    );
    // Position label above node
    textSprite.position.set(0, scale * 0.5 + 4, 0);
    group.add(textSprite);

    return group;
  }, [activeNode, particleTexture, createTextSprite]);

  return (
    <div className="fixed inset-0 z-0 bg-black cursor-move">
      <ForceGraph3D
        ref={fgRef}
        graphData={filteredData}
        backgroundColor="#000000"
        nodeLabel="label"
        nodeRelSize={6}
        
        // Link Styling
        linkWidth={0.5}
        linkOpacity={0.2}
        linkColor={() => "#1a2a4a"} // Dark blue base
        
        // Data Stream Particles
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={() => Math.random() * 0.005 + 0.002} // Varied speed
        linkDirectionalParticleWidth={0} // Using object instead
        linkDirectionalParticleThreeObject={() => {
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: particleTexture, 
                color: 0x00f0ff,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(3, 3, 1);
            return sprite;
        }}
        
        nodeThreeObject={(node: any) => createNodeObject(node)}
        onNodeClick={(node: any) => handleNodeClick(node)}
        onBackgroundClick={handleBackgroundClick}
        onNodeHover={(node: any) => {
           setHoverNode(node || null);
           setRotationActive(!node);
           document.body.style.cursor = node ? 'pointer' : 'move';
        }}
        showNavInfo={false}
      />
    </div>
  );
};

export default GraphCanvas;