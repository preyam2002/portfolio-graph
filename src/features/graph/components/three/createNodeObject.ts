import * as THREE from "three";
import { CLUSTER_COLORS, GraphNode, NodeType } from "@/types";

// --- Shared Resources ---

// 1. Shared Geometries
// We create base geometries once and clone/scale them as needed (or just scale the mesh).
const geometryMap: Record<string, THREE.BufferGeometry> = {
  [NodeType.ROOT]: new THREE.OctahedronGeometry(1, 0),
  [NodeType.PROJECT]: new THREE.BoxGeometry(1, 1, 1),
  [NodeType.SKILL]: new THREE.TetrahedronGeometry(1),
  default: new THREE.SphereGeometry(1, 16, 16),
};

const wireGeometryMap: Record<string, THREE.BufferGeometry> = {
  [NodeType.ROOT]: new THREE.IcosahedronGeometry(1, 1),
};

const edgesGeometryMap: Record<string, THREE.BufferGeometry> = {
  [NodeType.PROJECT]: new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
};

// 2. Shared Textures
const createGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.15, "rgba(0, 240, 255, 1)");
    gradient.addColorStop(0.4, "rgba(0, 240, 255, 0.4)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
};

const globalGlowTexture = createGlowTexture();
globalGlowTexture.colorSpace = THREE.SRGBColorSpace;

// 3. Shared Materials (Base templates)
// It's often better to clone materials if we need unique colors,
// but we can share materials if they are identical.
// Since colors vary by type, we can cache materials by color/type.
const materialCache: Record<string, THREE.MeshPhysicalMaterial> = {};

const getMaterial = (color: string, transparent = true, opacity = 0.9) => {
  const key = `${color}-${opacity}`;
  if (!materialCache[key]) {
    materialCache[key] = new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: transparent,
      opacity: opacity,
      emissive: color,
      emissiveIntensity: 0.3,
    });
  }
  return materialCache[key];
};

// --- Helper: Text Sprite Creation ---
// We'll create this once per node and just toggle visibility/scale
const createTextSprite = (
  text: string,
  color: string,
  fontSize: number = 40,
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  const font = `bold ${fontSize}px "Rajdhani", sans-serif`;
  ctx.font = font;
  const textWidth = ctx.measureText(text).width || 100;

  canvas.width = Math.max(textWidth + 40, 80);
  canvas.height = fontSize + 40;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.shadowColor = "rgba(0, 240, 255, 0.8)";
  ctx.shadowBlur = 15;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  // texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  const scaleFactor = 0.15;
  sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

  return sprite;
};

// --- Main Factory ---

export type NodeThreeObject = THREE.Group & {
  __update?: (options: {
    isActive: boolean;
    isHovered: boolean;
    isDimmed: boolean;
  }) => void;
  __tick?: (delta: number) => void;
};

export const createNodeObject = (node: GraphNode): NodeThreeObject => {
  if (!node) return new THREE.Group();

  const group = new THREE.Group() as NodeThreeObject;
  const color = CLUSTER_COLORS[node.type as NodeType] || "#ffffff";
  const baseSize = node.val || 1;

  // -- 1. Main Mesh --
  let mainMesh: THREE.Mesh;
  let wireMesh: THREE.Mesh | null = null;
  let edgesMesh: THREE.LineSegments | null = null;

  const material = getMaterial(color); // Shared material reference (careful with modifications)

  // Note: We use the shared base geometry and scale the mesh
  if (node.type === NodeType.ROOT) {
    mainMesh = new THREE.Mesh(geometryMap[NodeType.ROOT], material.clone());
    mainMesh.scale.setScalar(baseSize * 0.8);

    // Wire
    const wireBase = wireGeometryMap[NodeType.ROOT];
    const wireMat = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    wireMesh = new THREE.Mesh(wireBase, wireMat);
    wireMesh.scale.setScalar(baseSize * 1.5);
    group.add(wireMesh);
  } else if (node.type === NodeType.PROJECT) {
    mainMesh = new THREE.Mesh(geometryMap[NodeType.PROJECT], material.clone());
    mainMesh.scale.setScalar(baseSize);

    // Edges
    const edgesBase = edgesGeometryMap[NodeType.PROJECT];
    edgesMesh = new THREE.LineSegments(
      edgesBase,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      }),
    );
    edgesMesh.scale.setScalar(baseSize);
    group.add(edgesMesh);
  } else if (node.type === NodeType.SKILL) {
    mainMesh = new THREE.Mesh(geometryMap[NodeType.SKILL], material.clone());
    mainMesh.scale.setScalar(baseSize * 0.8);
  } else {
    mainMesh = new THREE.Mesh(geometryMap.default, material.clone());
    mainMesh.scale.setScalar(baseSize * 0.5);
  }

  group.add(mainMesh);

  // -- 2. Glow Sprite --
  const spriteMaterial = new THREE.SpriteMaterial({
    map: globalGlowTexture,
    color: color,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowSprite = new THREE.Sprite(spriteMaterial);
  const glowScale = baseSize * 8;
  glowSprite.scale.set(glowScale, glowScale, 1);
  group.add(glowSprite);

  // -- 3. Text Label --
  const textSprite = createTextSprite(node.label, "rgba(255,255,255,0.8)", 40);
  const textOffset = glowScale * 0.4 + 4;
  textSprite.position.set(0, textOffset, 0);
  // Initially hidden or dim? Let's say dim.
  group.add(textSprite);

  // -- 4. Scanner Rings (hidden by default) --
  // Inner Ring
  const ringGeo = new THREE.RingGeometry(baseSize * 1.5, baseSize * 1.7, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const scannerRing = new THREE.Mesh(ringGeo, ringMat);
  scannerRing.rotation.x = Math.PI / 2;
  scannerRing.visible = false;
  group.add(scannerRing);

  // Pulse Ring
  const pulseGeo = new THREE.RingGeometry(baseSize * 1.8, baseSize * 2.1, 32);
  const pulseMat = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
  pulseRing.rotation.x = Math.PI / 2;
  pulseRing.visible = false;
  group.add(pulseRing);

  // --- Imperative Update Function ---
  group.__update = ({ isActive, isHovered, isDimmed }) => {
    const mat = mainMesh.material as THREE.MeshPhysicalMaterial;

    // 1. Mesh Updates
    if (isDimmed) {
      mat.opacity = 0.3;
      mat.emissiveIntensity = 0.1;
    } else if (isActive) {
      mat.opacity = 0.95;
      mat.emissiveIntensity = 1.0;
    } else if (isHovered) {
      mat.opacity = 0.9;
      mat.emissiveIntensity = 0.7;
    } else {
      mat.opacity = 0.9;
      mat.emissiveIntensity = 0.3;
    }

    // 2. Glow Updates
    const targetGlowScale = isActive ? glowScale * 1.5 : glowScale;
    glowSprite.scale.setScalar(targetGlowScale);
    glowSprite.material.opacity = isActive ? 0.8 : isHovered ? 0.6 : 0.4;
    glowSprite.visible = !isDimmed;

    // 3. Text Updates
    textSprite.visible =
      isActive ||
      isHovered ||
      isDimmed === false ||
      node.type === NodeType.ROOT;
    if (textSprite.visible) {
      const textMat = textSprite.material;
      textMat.opacity = isDimmed ? 0.2 : 1.0;
      textMat.color.setStyle(isActive ? "#ffffff" : "rgba(255,255,255,0.8)");
    }

    // 4. Scanner Visibility
    scannerRing.visible = isActive;
    pulseRing.visible = isActive;
    if (isActive) {
      scannerRing.material.opacity = 0.8;
      pulseRing.material.opacity = 0.4;
    }
  };

  // --- Animation Tick Function ---
  group.__tick = (delta: number) => {
    if (group.visible) {
      // Rotate wireframe slightly always
      if (wireMesh) {
        wireMesh.rotation.x += 0.005;
        wireMesh.rotation.y += 0.005;
      }

      // Active animations
      if (scannerRing.visible) {
        scannerRing.rotation.z -= 0.02;
      }
      if (pulseRing.visible) {
        // Simple pulse effect
        // We can use a custom property or just use time
        const scale = 1 + (Math.sin(Date.now() * 0.003) * 0.2 + 0.2);
        // Or expansive pulse logic requires resetting state, let's just oscillate for now
        pulseRing.scale.setScalar(scale);
        pulseRing.material.opacity = 0.6 - (scale - 1);
      }
    }
  };

  return group;
};
