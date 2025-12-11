import { create } from 'zustand';
import { GraphNode, NodeType } from './types';

interface AppState {
  activeNode: GraphNode | null;
  setActiveNode: (node: GraphNode | null) => void;
  hoverNode: GraphNode | null;
  setHoverNode: (node: GraphNode | null) => void;
  isCmdPaletteOpen: boolean;
  setCmdPaletteOpen: (isOpen: boolean) => void;
  activeClusterFilter: NodeType | 'all';
  setActiveClusterFilter: (type: NodeType | 'all') => void;
  cameraRef: any;
  setCameraRef: (ref: any) => void;
}

export const useStore = create<AppState>((set) => ({
  activeNode: null,
  setActiveNode: (node) => set({ activeNode: node }),
  hoverNode: null,
  setHoverNode: (node) => set({ hoverNode: node }),
  isCmdPaletteOpen: false,
  setCmdPaletteOpen: (isOpen) => set({ isCmdPaletteOpen: isOpen }),
  activeClusterFilter: 'all',
  setActiveClusterFilter: (type) => set({ activeClusterFilter: type }),
  cameraRef: null,
  setCameraRef: (ref) => set({ cameraRef: ref }),
}));