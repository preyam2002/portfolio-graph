export enum NodeType {
  ROOT = 'root',
  PROJECT = 'project',
  PERSONALITY = 'personality',
  INTEREST = 'interest',
  SKILL = 'skill',
  LIFE = 'life',
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  val: number; // Size
  desc?: string;
  img?: string;
  tags?: string[];
  link?: string;
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
  [NodeType.ROOT]: '#ffffff',
  [NodeType.PROJECT]: '#00f0ff', // Cyan
  [NodeType.PERSONALITY]: '#ff0055', // Magenta
  [NodeType.INTEREST]: '#ffcc00', // Amber
  [NodeType.SKILL]: '#7000ff', // Violet
  [NodeType.LIFE]: '#00ff9d', // Spring Green
};
