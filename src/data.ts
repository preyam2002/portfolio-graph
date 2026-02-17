import { GraphData, GraphNode, NodeType } from "./types";

const generateMockData = (): GraphData => {
  const nodes: GraphNode[] = [];
  const links: any[] = [];

  const addNode = (
    node: Omit<GraphNode, "x" | "y" | "z" | "vx" | "vy" | "vz">,
  ) => {
    nodes.push(node as GraphNode);
  };

  const addLink = (source: string, target: string) => {
    links.push({ source, target });
  };

  // ═══════════════════════════════════════════════════
  // 1. ROOT - The Central Node
  // ═══════════════════════════════════════════════════
  addNode({
    id: "me",
    label: "PREYAM",
    type: NodeType.ROOT,
    val: 30,
    desc: "Full-Stack Developer • Web3 Builder • Open Source Enthusiast",
    link: "https://github.com/preyam2002",
  });

  // ═══════════════════════════════════════════════════
  // 2. SKILLS - Technical Abilities
  // ═══════════════════════════════════════════════════
  const skills = [
    { name: "React", desc: "Frontend Framework" },
    { name: "TypeScript", desc: "Type-Safe JavaScript" },
    { name: "Three.js", desc: "3D Graphics" },
    { name: "Node.js", desc: "Backend Runtime" },
    { name: "Python", desc: "ML & Scripting" },
    { name: "Go", desc: "Systems Programming" },
    { name: "Rust", desc: "Memory-Safe Systems" },
    { name: "GraphQL", desc: "API Query Language" },
    { name: "PostgreSQL", desc: "Relational Database" },
    { name: "Redis", desc: "In-Memory Cache" },
    { name: "Docker", desc: "Containerization" },
    { name: "Kubernetes", desc: "Container Orchestration" },
    { name: "AWS", desc: "Cloud Platform" },
    { name: "TensorFlow", desc: "Machine Learning" },
    { name: "WebGL", desc: "GPU Graphics" },
    { name: "GLSL", desc: "Shader Language" },
    { name: "Figma", desc: "UI/UX Design" },
    { name: "Blender", desc: "3D Modeling" },
    { name: "Git", desc: "Version Control" },
    { name: "Linux", desc: "Operating System" },
  ];

  skills.forEach((skill, i) => {
    const id = `skill_${i}`;
    addNode({
      id,
      label: skill.name,
      type: NodeType.SKILL,
      val: 6 + Math.random() * 4,
      desc: skill.desc,
    });
    addLink("me", id);
    if (i > 0 && Math.random() > 0.6) addLink(id, `skill_${i - 1}`);
  });

  // ═══════════════════════════════════════════════════
  // 3. PROJECTS - Portfolio Work
  // ═══════════════════════════════════════════════════
  const projects = [
    {
      name: "Neural Graph",
      desc: "3D Knowledge Visualization",
      skills: [0, 2, 1],
      link: "https://neural-graph.os.me",
      github: "https://github.com/preyam2002/neural-graph",
    },
    {
      name: "Quantum API",
      desc: "High-Performance Backend",
      skills: [3, 7, 8],
      link: "https://api.os.me",
      github: "https://github.com/preyam2002/quantum-api",
    },
    {
      name: "Holo UI",
      desc: "Futuristic Interface Kit",
      skills: [0, 16, 2],
      link: "https://holo-ui.os.me",
      github: "https://github.com/preyam2002/holo-ui",
    },
    {
      name: "Cyber Render",
      desc: "Real-time Ray Tracer",
      skills: [14, 15, 17],
      link: "https://render.os.me",
      github: "https://github.com/preyam2002/cyber-render",
    },
    {
      name: "Aletheia",
      desc: "DeFi Prediction Market on Sui",
      skills: [12, 13, 17], // Blockchain, AI, Rust?
      link: "https://aletheia.finance",
      github: "https://github.com/preyam2002/aletheia",
    },
    {
      name: "Lumora",
      desc: "Next-Gen Social Graph",
      skills: [0, 1, 8], // React, TS, Node
      github: "https://github.com/preyam2002/lumora-social",
    },
    {
      name: "Antigravity",
      desc: "Autonomous AI Agent",
      skills: [4, 13, 0], // Python, ML, React?
      github: "https://github.com/preyam2002/antigravity",
    },
    {
      name: "Portfolio Graph",
      desc: "This Website (Interactive 3D)",
      skills: [0, 6, 1], // React, Three.js, TS
      link: "https://os.me",
      github: "https://github.com/preyam2002/portfolio-graph",
    },
    {
      name: "Flux Engine",
      desc: "WebGL Game Engine",
      skills: [6, 14, 17],
      github: "https://github.com/preyam2002/flux-engine",
    },
    {
      name: "Neuronav",
      desc: "Brain-Computer Interface",
      skills: [13, 11, 4],
      link: "https://neuronav.tech",
    },
  ];

  projects.forEach((proj, i) => {
    const id = `proj_${i}`;
    addNode({
      id,
      label: proj.name,
      type: NodeType.PROJECT,
      val: 12 + Math.random() * 5, // Slightly bigger
      desc: proj.desc,
      link: proj.link,
      github: proj.github,
    });
    proj.skills.forEach((s) => {
      // Ensure skill index exists, modulo to be safe
      addLink(id, `skill_${s % 18}`);
    });
    addLink("me", id);
  });

  // ═══════════════════════════════════════════════════
  // 4. PERSONALITY - Traits & Values
  // ═══════════════════════════════════════════════════
  const traits = [
    "Curious",
    "Analytical",
    "Creative",
    "Stoic",
    "Driven",
    "Empathetic",
    "Strategic",
    "Resilient",
    "Optimistic",
    "Visionary",
  ];

  traits.forEach((trait, i) => {
    const id = `pers_${i}`;
    addNode({
      id,
      label: trait,
      type: NodeType.PERSONALITY,
      val: 5 + Math.random() * 3,
    });
    addLink("me", id);
    if (i > 0) addLink(id, `pers_${i - 1}`);
  });

  // ═══════════════════════════════════════════════════
  // 5. INTERESTS - Topics & Passions
  // ═══════════════════════════════════════════════════
  const interests = [
    "Cyberpunk",
    "Space Exploration",
    "AI Ethics",
    "Quantum Computing",
    "Philosophy",
    "Neuroscience",
    "Game Design",
    "Synthwave",
    "Typography",
    "Architecture",
    "Transhumanism",
    "Consciousness",
    "VR/AR",
    "Cryptography",
  ];

  interests.forEach((interest, i) => {
    const id = `int_${i}`;
    addNode({
      id,
      label: interest,
      type: NodeType.INTEREST,
      val: 4 + Math.random() * 4,
    });
    addLink(`pers_${i % traits.length}`, id);
    if (Math.random() > 0.7) addLink("me", id);
  });

  // ═══════════════════════════════════════════════════
  // 6. MOVIES - Favorite Films
  // ═══════════════════════════════════════════════════
  const movies = [
    { name: "Blade Runner 2049", year: 2017, rating: 10, genre: "Sci-Fi" },
    { name: "Interstellar", year: 2014, rating: 10, genre: "Sci-Fi" },
    { name: "The Matrix", year: 1999, rating: 9, genre: "Sci-Fi" },
    { name: "Inception", year: 2010, rating: 9, genre: "Thriller" },
    { name: "Dune", year: 2021, rating: 9, genre: "Sci-Fi" },
    { name: "Ghost in the Shell", year: 1995, rating: 9, genre: "Anime" },
    { name: "Akira", year: 1988, rating: 9, genre: "Anime" },
    { name: "Ex Machina", year: 2014, rating: 8, genre: "Sci-Fi" },
    { name: "Arrival", year: 2016, rating: 9, genre: "Sci-Fi" },
    { name: "2001: Space Odyssey", year: 1968, rating: 10, genre: "Sci-Fi" },
  ];

  movies.forEach((movie, i) => {
    const id = `movie_${i}`;
    addNode({
      id,
      label: movie.name,
      type: NodeType.MOVIE,
      val: 6 + movie.rating * 0.5,
      desc: `${movie.genre} • ${movie.year}`,
      year: movie.year,
      rating: movie.rating,
      genre: movie.genre,
    });
    // Connect to related interests
    const relatedInt = i % interests.length;
    addLink(id, `int_${relatedInt}`);
  });

  // ═══════════════════════════════════════════════════
  // 7. BOOKS - Reading List
  // ═══════════════════════════════════════════════════
  const books = [
    {
      name: "Neuromancer",
      author: "William Gibson",
      rating: 10,
      genre: "Cyberpunk",
    },
    {
      name: "Snow Crash",
      author: "Neal Stephenson",
      rating: 9,
      genre: "Sci-Fi",
    },
    { name: "Dune", author: "Frank Herbert", rating: 10, genre: "Sci-Fi" },
    { name: "1984", author: "George Orwell", rating: 9, genre: "Dystopian" },
    {
      name: "Brave New World",
      author: "Aldous Huxley",
      rating: 8,
      genre: "Dystopian",
    },
    { name: "Foundation", author: "Isaac Asimov", rating: 9, genre: "Sci-Fi" },
    { name: "Hyperion", author: "Dan Simmons", rating: 9, genre: "Sci-Fi" },
    {
      name: "The Three-Body Problem",
      author: "Liu Cixin",
      rating: 10,
      genre: "Sci-Fi",
    },
    {
      name: "Sapiens",
      author: "Yuval Harari",
      rating: 9,
      genre: "Non-Fiction",
    },
    {
      name: "Meditations",
      author: "Marcus Aurelius",
      rating: 10,
      genre: "Philosophy",
    },
  ];

  books.forEach((book, i) => {
    const id = `book_${i}`;
    addNode({
      id,
      label: book.name,
      type: NodeType.BOOK,
      val: 5 + book.rating * 0.4,
      desc: `by ${book.author} • ${book.genre}`,
      rating: book.rating,
      genre: book.genre,
    });
    addLink(id, `int_${(i + 3) % interests.length}`);
  });

  // ═══════════════════════════════════════════════════
  // 8. ANIME - Favorites
  // ═══════════════════════════════════════════════════
  const animes = [
    { name: "Steins;Gate", rating: 10, genre: "Sci-Fi/Thriller" },
    { name: "Cowboy Bebop", rating: 10, genre: "Space Western" },
    {
      name: "Neon Genesis Evangelion",
      rating: 9,
      genre: "Mecha/Psychological",
    },
    { name: "Attack on Titan", rating: 9, genre: "Action/Dark Fantasy" },
    { name: "Death Note", rating: 9, genre: "Psychological" },
    { name: "Psycho-Pass", rating: 9, genre: "Cyberpunk" },
    { name: "Serial Experiments Lain", rating: 8, genre: "Psychological" },
    { name: "Monster", rating: 10, genre: "Thriller" },
    { name: "Fullmetal Alchemist", rating: 9, genre: "Fantasy/Adventure" },
    { name: "Code Geass", rating: 8, genre: "Mecha/Political" },
  ];

  animes.forEach((anime, i) => {
    const id = `anime_${i}`;
    addNode({
      id,
      label: anime.name,
      type: NodeType.ANIME,
      val: 5 + anime.rating * 0.4,
      desc: anime.genre,
      rating: anime.rating,
      genre: anime.genre,
    });
    addLink(id, `int_${(i + 5) % interests.length}`);
    // Connect some anime to movies
    if (i < 3) addLink(id, `movie_${5 + i}`);
  });

  // ═══════════════════════════════════════════════════
  // 9. HOBBIES - Activities & Passions
  // ═══════════════════════════════════════════════════
  const hobbies = [
    { name: "Coding Side Projects", desc: "Building cool things" },
    { name: "Gaming", desc: "RPGs, Strategy, Indie" },
    { name: "Reading", desc: "Sci-Fi, Philosophy, Tech" },
    { name: "3D Art", desc: "Blender, Procedural Art" },
    { name: "Music Production", desc: "Synthwave, Electronic" },
    { name: "Photography", desc: "Urban, Night, Minimal" },
    { name: "Fitness", desc: "Gym, Running" },
    { name: "Writing", desc: "Technical & Creative" },
  ];

  hobbies.forEach((hobby, i) => {
    const id = `hobby_${i}`;
    addNode({
      id,
      label: hobby.name,
      type: NodeType.HOBBY,
      val: 7,
      desc: hobby.desc,
    });
    addLink("me", id);
    addLink(id, `pers_${i % traits.length}`);
  });

  // ═══════════════════════════════════════════════════
  // 10. MUSIC - Artists & Genres
  // ═══════════════════════════════════════════════════
  const music = [
    { name: "Synthwave", desc: "Retrowave, Outrun" },
    { name: "Electronic", desc: "Ambient, IDM" },
    { name: "Cyberpunk OSTs", desc: "Game & Film Soundtracks" },
    { name: "Lo-Fi", desc: "Chill, Study Beats" },
    { name: "Post-Rock", desc: "Atmospheric, Instrumental" },
    { name: "Daft Punk", desc: "Electronic Pioneers" },
    { name: "M83", desc: "Synth Pop/Rock" },
    { name: "Hans Zimmer", desc: "Epic Orchestral" },
  ];

  music.forEach((m, i) => {
    const id = `music_${i}`;
    addNode({
      id,
      label: m.name,
      type: NodeType.MUSIC,
      val: 5 + Math.random() * 3,
      desc: m.desc,
    });
    addLink(id, `hobby_4`); // Music production hobby
    addLink(id, `int_7`); // Synthwave interest
  });

  // ═══════════════════════════════════════════════════
  // 11. ACHIEVEMENTS - Milestones
  // ═══════════════════════════════════════════════════
  const achievements = [
    {
      name: "First Open Source PR",
      desc: "Contributed to major project",
      year: 2020,
    },
    {
      name: "10K Stars Repository",
      desc: "Popular GitHub project",
      year: 2022,
    },
    { name: "Tech Talk Speaker", desc: "Conference presentation", year: 2023 },
    { name: "Startup Founded", desc: "Built from zero to launch", year: 2023 },
    { name: "AI Paper Published", desc: "Research contribution", year: 2024 },
    { name: "100 Projects", desc: "Prolific builder milestone", year: 2024 },
  ];

  achievements.forEach((ach, i) => {
    const id = `ach_${i}`;
    addNode({
      id,
      label: ach.name,
      type: NodeType.ACHIEVEMENT,
      val: 8 + i,
      desc: `${ach.desc} • ${ach.year}`,
      year: ach.year,
    });
    addLink("me", id);
    // Connect to relevant skills
    addLink(id, `skill_${i % skills.length}`);
  });

  // ═══════════════════════════════════════════════════
  // 12. LIFE - Timeline Events
  // ═══════════════════════════════════════════════════
  const lifeEvents = [
    { name: "Born", desc: "The beginning" },
    { name: "First Computer", desc: "Started the journey" },
    { name: "Learned to Code", desc: "Hello World moment" },
    { name: "College", desc: "Computer Science" },
    { name: "First Job", desc: "Professional developer" },
    { name: "Started Freelancing", desc: "Independence" },
    { name: "Built First Startup", desc: "Entrepreneurship" },
    { name: "Today", desc: "Building the future" },
  ];

  lifeEvents.forEach((event, i) => {
    const id = `life_${i}`;
    addNode({
      id,
      label: event.name,
      type: NodeType.LIFE,
      val: 4 + i * 0.5,
      desc: event.desc,
    });
    if (i === 0) addLink("me", id);
    else addLink(id, `life_${i - 1}`);
  });

  return { nodes, links };
};

export const graphData = generateMockData();
