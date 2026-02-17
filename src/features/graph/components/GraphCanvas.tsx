import React, { useRef, useEffect, useCallback, useMemo } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { useSound } from "../hooks/use-sound";
import { graphData } from "@/data";
import { GraphNode, NodeType, GraphLink } from "@/types";
import { useStore } from "@/store";
import * as THREE from "three";
import { createNodeObject, NodeThreeObject } from "./three/createNodeObject";

const GraphCanvas: React.FC = () => {
  const fgRef = useRef<any>();
  const { playClick } = useSound();
  const {
    activeNode,
    setActiveNode,
    hoverNode,
    setHoverNode,
    activeClusterFilter,
  } = useStore();

  // Filter graph data based on active cluster filter
  const filteredGraphData = useMemo(() => {
    if (activeClusterFilter === "all") {
      return graphData;
    }

    // Get filtered node IDs
    const filteredNodeIds = new Set(
      graphData.nodes
        .filter(
          (n) => n.type === activeClusterFilter || n.type === NodeType.ROOT,
        )
        .map((n) => n.id),
    );

    // Also include nodes connected to filtered nodes
    const connectedNodeIds = new Set(filteredNodeIds);
    graphData.links.forEach((link) => {
      const sourceId =
        typeof link.source === "string"
          ? link.source
          : (link.source as GraphNode).id;
      const targetId =
        typeof link.target === "string"
          ? link.target
          : (link.target as GraphNode).id;

      if (filteredNodeIds.has(sourceId)) {
        connectedNodeIds.add(targetId);
      }
      if (filteredNodeIds.has(targetId)) {
        connectedNodeIds.add(sourceId);
      }
    });

    const filteredNodes = graphData.nodes.filter((n) =>
      connectedNodeIds.has(n.id),
    );
    const filteredLinks = graphData.links.filter((link) => {
      const sourceId =
        typeof link.source === "string"
          ? link.source
          : (link.source as GraphNode).id;
      const targetId =
        typeof link.target === "string"
          ? link.target
          : (link.target as GraphNode).id;
      return connectedNodeIds.has(sourceId) && connectedNodeIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [activeClusterFilter]);

  // Handle node click with camera animation
  const handleNodeClick = useCallback(
    (node: any) => {
      if (!node) return;
      playClick();
      setActiveNode(node);

      const distance = 100;
      const distRatio =
        1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0);

      fgRef.current?.cameraPosition(
        {
          x: (node.x || 0) * distRatio,
          y: (node.y || 0) * distRatio,
          z: (node.z || 0) * distRatio,
        },
        node,
        1000, // Animation duration
      );
    },
    [setActiveNode, playClick],
  );

  // Handle background click
  const handleBackgroundClick = useCallback(() => {
    playClick();
    setActiveNode(null);
    // Zoom out
    fgRef.current?.cameraPosition(
      { x: 0, y: 0, z: 600 },
      { x: 0, y: 0, z: 0 },
      1000,
    );
  }, [setActiveNode, playClick]);

  // Handle hover
  const handleNodeHover = useCallback(
    (node: any) => {
      setHoverNode(node || null);
      document.body.style.cursor = node ? "pointer" : "grab";
    },
    [setHoverNode],
  );

  // Check if a node is highlighted (matches filter or is root)
  const isNodeHighlighted = useCallback(
    (node: any) => {
      if (activeClusterFilter === "all") return true;
      return node.type === activeClusterFilter || node.type === NodeType.ROOT;
    },
    [activeClusterFilter],
  );

  // Optimized Node Creation
  const nodeThreeObject = useCallback((node: any) => {
    return createNodeObject(node);
  }, []);

  // Imperative Visual Updates
  useEffect(() => {
    filteredGraphData.nodes.forEach((node) => {
      const obj = (node as any).__threeObj as NodeThreeObject;
      if (!obj || !obj.__update) return;

      const isActive = activeNode?.id === node.id;
      const isHovered = hoverNode?.id === node.id;
      let isDimmed = false;

      // Simple dimming logic mostly handled by filters now, but we check highlights
      // If we filtered out non-highlighted nodes, then remaining match filter.
      // But we can check highlighting if we want to visually dim within displayed set.
      // Current logic: activeNode usually implies others are dimmed?
      // Step 248 logic: `isDimmed = false` was default.
      // Let's implement active focus dimming.
      if (activeNode && !isActive && !isHovered) {
        isDimmed = true;
      }

      obj.__update({ isActive, isHovered, isDimmed });
    });
  }, [activeNode, hoverNode, activeClusterFilter, filteredGraphData]);

  // Scene Setup (Lights & Controls)
  useEffect(() => {
    if (fgRef.current) {
      const scene = fgRef.current.scene();

      // Clear existing lights to avoid duplicates on HMR
      scene.children = scene.children.filter(
        (child: any) => !(child instanceof THREE.Light),
      );

      // Ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);

      // Colored point lights
      const cyanLight = new THREE.PointLight(0x00ffff, 1.5, 1000);
      cyanLight.position.set(300, 200, 300);
      scene.add(cyanLight);

      const magentaLight = new THREE.PointLight(0xff00ff, 1, 1000);
      magentaLight.position.set(-300, -100, -300);
      scene.add(magentaLight);

      const blueLight = new THREE.PointLight(0x0066ff, 0.8, 800);
      blueLight.position.set(0, 300, 0);
      scene.add(blueLight);

      // Initial Camera
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 600 });

      // Controls config
      const controls = fgRef.current.controls();
      if (controls) {
        controls.minDistance = 150;
        controls.maxDistance = 2000;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = 0.5;
      }

      // Force config
      fgRef.current.d3Force("charge").strength(-300);
      fgRef.current.d3Force("link").distance(80);
    }
  }, []);

  // Animation Frame Loop for Node Effects
  useEffect(() => {
    let frameId: number;
    const animateFromData = () => {
      filteredGraphData.nodes.forEach((node) => {
        const obj = (node as any).__threeObj as NodeThreeObject;
        if (obj && obj.__tick) {
          obj.__tick(1);
        }
      });
      frameId = requestAnimationFrame(animateFromData);
    };

    animateFromData();
    return () => cancelAnimationFrame(frameId);
  }, [filteredGraphData]);

  // Get link color
  const getLinkColor = useCallback(
    (link: any) => {
      const sourceId =
        typeof link.source === "string" ? link.source : link.source?.id;
      const targetId =
        typeof link.target === "string" ? link.target : link.target?.id;

      if (activeNode) {
        if (sourceId === activeNode.id || targetId === activeNode.id) {
          return "#00f0ff";
        }
      }
      if (hoverNode) {
        if (sourceId === hoverNode.id || targetId === hoverNode.id) {
          return "#00ccff";
        }
      }
      return activeClusterFilter !== "all" ? "#0d2a4a" : "#1a3a6a";
    },
    [activeNode, hoverNode, activeClusterFilter],
  );

  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#050510] via-[#080815] to-[#0a0a20]">
      <ForceGraph3D
        ref={fgRef}
        graphData={filteredGraphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        linkColor={getLinkColor}
        linkOpacity={0.6}
        linkWidth={1.5}
        linkDirectionalParticles={3}
        linkDirectionalParticleWidth={2.5}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={() => "#00f0ff"}
        linkCurvature={0.1}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        onNodeHover={handleNodeHover}
        enableNodeDrag={true}
        showNavInfo={false}
        warmupTicks={50}
        cooldownTicks={100}
      />
    </div>
  );
};

export default GraphCanvas;
