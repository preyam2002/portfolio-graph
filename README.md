# Portfolio Graph

An interactive 3D identity and portfolio visualization tool built with React, Three.js, and React Force Graph. Features a retro-futuristic CRT aesthetic with a boot sequence.

## Overview

This project visualizes identity networks and portfolio relationships in an immersive 3D space with a unique cyberpunk/retro terminal aesthetic. It includes:
- A 3D force-directed graph visualization
- Interactive node exploration with detail drawers
- CRT monitor effects and scanlines
- Boot sequence animation
- Command palette interface
- System log console

**Generated with**: Google AI Studio

## Tech Stack

- **Framework**: React 19.2.1 + Vite 6.4.1
- **Language**: TypeScript ~5.8.2
- **3D Graphics**: 
  - Three.js 0.160.0
  - @react-three/fiber 9.4.2
  - @react-three/postprocessing 3.0.4
  - three-render-objects 1.35.0
- **Graph Visualization**: react-force-graph-3d 1.29.0
- **Node Graphs**: reaflow 5.4.1
- **Styling**: 
  - Tailwind CSS v4.1.17
  - @tailwindcss/postcss
  - @emotion/react 11.14.0
  - @emotion/styled 11.14.1
- **State Management**: Zustand 4.4.7
- **Animations**: Framer Motion 11.0.0
- **Icons**: Lucide React 0.559.0
- **Routing**: React Router DOM 6.24.1
- **Utilities**: patch-package 8.0.1

## Features

### 3D Visualization
- Force-directed graph with physics simulation
- Interactive nodes with hover and selection
- Zoom, pan, and rotate camera controls
- Particle effects and starfield background
- Post-processing bloom effects

### Retro-Futuristic UI
- CRT monitor overlay with scanlines
- Phosphor glow and screen curvature effects
- Green phosphor terminal aesthetic
- Boot sequence animation on load
- System log console with scrolling output

### Interactive Interface
- Command palette for quick navigation
- Detail drawer for node information
- Keyboard shortcuts support
- Responsive design

### Data Visualization
- Node-link graph structure
- Variable node sizes based on importance
- Color-coded node categories
- Animated force simulation

## Project Structure

```
portfolio-graph/
├── src/
│   ├── pages/
│   │   └── Portfolio.tsx           # Portfolio page component
│   ├── features/
│   │   └── graph/
│   │       ├── components/
│   │       │   ├── GraphCanvas.tsx      # Main 3D graph component
│   │       │   ├── Interface.tsx        # NavBar and CommandPalette
│   │       │   ├── DetailDrawer.tsx     # Node detail panel
│   │       │   ├── SystemLog.tsx        # Terminal log output
│   │       │   └── three/
│   │       │       ├── Starfield.tsx    # Background stars
│   │       │       └── createNodeObject.ts  # Node geometry
│   │       └── hooks/
│   │           ├── use-animation.ts     # Animation utilities
│   │           └── use-sound.ts         # Audio effects
│   ├── core/
│   │   ├── components/
│   │   │   ├── BootSequence.tsx         # Initial boot animation
│   │   │   ├── CRTOverlay.tsx           # CRT screen effect
│   │   │   └── ErrorBoundary.tsx        # Error handling
│   │   ├── hooks/
│   │   │   └── use-animation.ts
│   │   └── styles/
│   │       └── theme.ts
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   ├── store.ts                    # Zustand store
│   ├── data.ts                     # Graph data
│   ├── types.ts                    # TypeScript types
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── patches/                        # Package patches
```

## NPM Scripts

```bash
npm run dev              # Start Vite development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run postinstall      # Apply package patches
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables (optional)
echo "GEMINI_API_KEY=your_api_key" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Controls

### Graph Navigation
- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag
- **Select Node**: Left-click on node

### Keyboard Shortcuts
- `Cmd/Ctrl + K`: Open command palette
- `Escape`: Close modals/drawers
- `?`: Show help

## Data Format

The graph expects data in the following format:

```typescript
interface GraphData {
  nodes: Array<{
    id: string;              // Unique identifier
    label: string;           // Display name
    color?: string;          // Hex color code
    val?: number;            // Node size (radius)
    description?: string;    // Detailed description
    category?: string;       // Node category
  }>;
  links: Array<{
    source: string;          // Source node ID
    target: string;          // Target node ID
    value?: number;          // Link strength/thickness
  }>;
}
```

### Example Data
```typescript
const data: GraphData = {
  nodes: [
    { id: "1", label: "Portfolio", val: 20, color: "#00ff88" },
    { id: "2", label: "Projects", val: 15, color: "#00ccff" },
    { id: "3", label: "Skills", val: 15, color: "#ff00ff" },
  ],
  links: [
    { source: "1", target: "2", value: 5 },
    { source: "1", target: "3", value: 5 },
  ]
};
```

## Customization

### Theme
Edit `src/core/styles/theme.ts` to customize:
- Colors (primary, secondary, accent)
- CRT effect intensity
- Animation speeds
- Typography

### Graph Physics
Modify graph parameters in `GraphCanvas.tsx`:
- Link distance
- Repulsion force
- Gravity
- Warmup ticks

### Boot Sequence
Customize the boot text in `BootSequence.tsx`:
```typescript
const bootLines = [
  "Initializing system...",
  "Loading neural network...",
  // Add your own lines
];
```

## Dependencies Explained

### Core
- **react-force-graph-3d**: 3D force-directed graph component
- **three**: WebGL 3D library
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/postprocessing**: Post-processing effects

### UI/Styling
- **@emotion/react/styled**: CSS-in-JS styling
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library

### State & Data
- **zustand**: Lightweight state management
- **react-router-dom**: Client-side routing

### Utilities
- **patch-package**: Fix node_modules packages
- **lucide-react**: Icon library

## Performance Considerations

- Graph rendering uses Three.js WebGL renderer
- Large graphs (>1000 nodes) may impact performance
- Consider using BVH acceleration for raycasting
- Enable frustum culling for off-screen nodes
- Use instanced meshes for repeated geometries

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- WebGL 2.0 required

## Known Issues

- Mobile touch controls may need adjustment
- High-DPI displays may require pixel ratio scaling
- Large graphs can cause memory pressure

## Roadmap

- [ ] Import data from JSON/CSV
- [ ] Node filtering and search
- [ ] Export graph as image/video
- [ ] Save/load graph layouts
- [ ] Collaborative editing (WebRTC)
- [ ] VR/AR support (WebXR)
- [ ] Audio-reactive visualization
- [ ] Custom node shapes
- [ ] Edge bundling

## Inspiration

This project draws inspiration from:
- Retro computer terminals (VT100, etc.)
- Cyberpunk aesthetics (Blade Runner, Neuromancer)
- Force-directed graph visualization research
- CRT monitor simulation techniques

## Author

**Preyam** - [GitHub](https://github.com/preyam2002)

## License

MIT

## Acknowledgments

- Three.js community
- React Force Graph by vasturiano
- Google AI Studio for initial generation
- Retro computing enthusiasts
