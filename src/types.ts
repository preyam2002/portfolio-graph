export enum NodeType {
  ROOT = "root",
  PROJECT = "project",
  PERSONALITY = "personality",
  INTEREST = "interest",
  SKILL = "skill",
  LIFE = "life",
  MOVIE = "movie",
  BOOK = "book",
  ANIME = "anime",
  HOBBY = "hobby",
  MUSIC = "music",
  ACHIEVEMENT = "achievement",
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  val: number;
  desc?: string;
  img?: string;
  tags?: string[];
  link?: string;
  github?: string;
  rating?: number; // 1-10 for media
  year?: number; // Release year for media
  genre?: string;
  // Dynamic props added by graph engine
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export type ClusterColorMap = {
  [key in NodeType]: string;
};

export const CLUSTER_COLORS: ClusterColorMap = {
  [NodeType.ROOT]: "#ffffff",
  [NodeType.PROJECT]: "#00f0ff", // Cyan
  [NodeType.PERSONALITY]: "#ff0055", // Magenta
  [NodeType.INTEREST]: "#ffcc00", // Amber
  [NodeType.SKILL]: "#7000ff", // Violet
  [NodeType.LIFE]: "#00ff9d", // Spring Green
  [NodeType.MOVIE]: "#ffd700", // Gold
  [NodeType.BOOK]: "#10b981", // Emerald
  [NodeType.ANIME]: "#ff69b4", // Hot Pink
  [NodeType.HOBBY]: "#ff8c00", // Dark Orange
  [NodeType.MUSIC]: "#9333ea", // Purple
  [NodeType.ACHIEVEMENT]: "#cd7f32", // Bronze
};

// Icon mapping for UI
export const NODE_ICONS: Record<NodeType, string> = {
  [NodeType.ROOT]: "⚡",
  [NodeType.PROJECT]: "💻",
  [NodeType.PERSONALITY]: "🧠",
  [NodeType.INTEREST]: "✨",
  [NodeType.SKILL]: "🔧",
  [NodeType.LIFE]: "🌱",
  [NodeType.MOVIE]: "🎬",
  [NodeType.BOOK]: "📚",
  [NodeType.ANIME]: "🌸",
  [NodeType.HOBBY]: "🎯",
  [NodeType.MUSIC]: "🎵",
  [NodeType.ACHIEVEMENT]: "🏆",
};
