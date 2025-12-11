import { GraphData, NodeType } from './types';

export const graphData: GraphData = {
  nodes: [
    // --- ROOT ---
    { id: 'me', label: 'ALEX.OS', type: NodeType.ROOT, val: 20, desc: 'Interactive Neural Interface' },

    // --- PROJECTS ---
    { id: 'p_ai_dashboard', label: 'Sentient Dash', type: NodeType.PROJECT, val: 10, desc: 'Real-time AI analytics dashboard visualizing neural network states.', tags: ['React', 'Three.js', 'Python'], img: 'https://picsum.photos/800/600?random=1' },
    { id: 'p_defi_app', label: 'Flux Protocol', type: NodeType.PROJECT, val: 10, desc: 'Decentralized liquidity aggregator built on Solana.', tags: ['Rust', 'Solidity', 'Web3'], img: 'https://picsum.photos/800/600?random=2' },
    { id: 'p_design_sys', label: 'Aura UI', type: NodeType.PROJECT, val: 8, desc: 'A composable, accessible design system for enterprise apps.', tags: ['TypeScript', 'Storybook', 'A11y'], img: 'https://picsum.photos/800/600?random=3' },
    { id: 'p_portfolio_v1', label: 'Legacy Site', type: NodeType.PROJECT, val: 6, desc: 'Previous iteration of my digital garden.', tags: ['Gatsby', 'GraphQL'], img: 'https://picsum.photos/800/600?random=4' },

    // --- PERSONALITY ---
    { id: 'pers_core', label: 'Core Self', type: NodeType.PERSONALITY, val: 12, desc: 'INTJ-A / Architect' },
    { id: 'pers_values', label: 'Values', type: NodeType.PERSONALITY, val: 8, desc: 'Autonomy, Mastery, Purpose' },
    { id: 'pers_method', label: 'Methodology', type: NodeType.PERSONALITY, val: 8, desc: 'First Principles Thinking' },
    { id: 'pers_collab', label: 'Collaboration', type: NodeType.PERSONALITY, val: 8, desc: 'Async-first, radical candor.' },

    // --- INTERESTS ---
    { id: 'int_scifi', label: 'Sci-Fi', type: NodeType.INTEREST, val: 7, desc: 'Asimov, Gibson, Liu Cixin.' },
    { id: 'int_synth', label: 'Synthwave', type: NodeType.INTEREST, val: 6, desc: 'Designing soundscapes.' },
    { id: 'int_photo', label: 'Photography', type: NodeType.INTEREST, val: 7, desc: 'Street & Architecture.' },
    { id: 'int_philo', label: 'Philosophy', type: NodeType.INTEREST, val: 8, desc: 'Stoicism & Existentialism.' },

    // --- SKILLS ---
    { id: 'skill_stack', label: 'Tech Stack', type: NodeType.SKILL, val: 12, desc: 'Full Stack Engineering' },
    { id: 's_react', label: 'React / Next.js', type: NodeType.SKILL, val: 8 },
    { id: 's_ts', label: 'TypeScript', type: NodeType.SKILL, val: 8 },
    { id: 's_node', label: 'Node / Go', type: NodeType.SKILL, val: 7 },
    { id: 's_3d', label: 'WebGL / GLSL', type: NodeType.SKILL, val: 9 },

    // --- LIFE ---
    { id: 'life_now', label: 'Now', type: NodeType.LIFE, val: 10, desc: 'Currently reading "Structure of Scientific Revolutions". Training for a marathon.' },
    { id: 'life_travel', label: 'Travel', type: NodeType.LIFE, val: 7, desc: 'Recent: Tokyo, Reykjavik. Next: Patagonia.' },
  ],
  links: [
    // Root Connections
    { source: 'me', target: 'p_ai_dashboard' },
    { source: 'me', target: 'p_defi_app' },
    { source: 'me', target: 'p_design_sys' },
    { source: 'me', target: 'pers_core' },
    { source: 'me', target: 'skill_stack' },
    { source: 'me', target: 'life_now' },

    // Projects -> Skills
    { source: 'p_ai_dashboard', target: 's_react' },
    { source: 'p_ai_dashboard', target: 's_3d' },
    { source: 'p_defi_app', target: 's_ts' },
    { source: 'p_design_sys', target: 's_react' },
    { source: 'p_design_sys', target: 's_ts' },

    // Personality -> Interests
    { source: 'pers_core', target: 'int_philo' },
    { source: 'pers_core', target: 'pers_values' },
    { source: 'pers_core', target: 'pers_method' },
    { source: 'pers_core', target: 'pers_collab' },

    // Interests
    { source: 'int_scifi', target: 'int_synth' },
    { source: 'life_travel', target: 'int_photo' },

    // Skills
    { source: 'skill_stack', target: 's_react' },
    { source: 'skill_stack', target: 's_ts' },
    { source: 'skill_stack', target: 's_node' },
    { source: 'skill_stack', target: 's_3d' },

    // Life
    { source: 'life_now', target: 'life_travel' },
    { source: 'life_now', target: 'p_portfolio_v1' }, // Past work led to now
  ]
};