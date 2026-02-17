import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Code2,
  Briefcase,
  User,
  Heart,
  Send,
  ArrowRight,
  Star,
  Calendar,
  BookOpen,
  Film,
  Music,
  Gamepad2,
  Trophy,
  Zap,
  MapPin,
  Globe,
  Download,
} from "lucide-react";
import { graphData } from "@/data";
import { NodeType, CLUSTER_COLORS } from "@/types";
import { useSound } from "@/features/graph/hooks/use-sound";

// ═══════════════════════════════════════════════════
// Data Extraction from graphData
// ═══════════════════════════════════════════════════
const getNodesByType = (type: NodeType) =>
  graphData.nodes.filter((n) => n.type === type);

const rootNode = graphData.nodes.find((n) => n.type === NodeType.ROOT);
const skills = getNodesByType(NodeType.SKILL);
const projects = getNodesByType(NodeType.PROJECT);
const personality = getNodesByType(NodeType.PERSONALITY);
const interests = getNodesByType(NodeType.INTEREST);
const movies = getNodesByType(NodeType.MOVIE);
const books = getNodesByType(NodeType.BOOK);
const animes = getNodesByType(NodeType.ANIME);
const hobbies = getNodesByType(NodeType.HOBBY);
const music = getNodesByType(NodeType.MUSIC);
const achievements = getNodesByType(NodeType.ACHIEVEMENT);
const lifeEvents = getNodesByType(NodeType.LIFE);

// Social Links - Update these with your actual links
const SOCIAL_LINKS = {
  github: "https://github.com/preyam2002",
  twitter: "https://twitter.com/preyam",
  linkedin: "https://linkedin.com/in/preyam",
  email: "preyam@example.com",
};

// ═══════════════════════════════════════════════════
// Animation Variants
// ═══════════════════════════════════════════════════
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// ═══════════════════════════════════════════════════
// Section Header Component
// ═══════════════════════════════════════════════════
interface SectionHeaderProps {
  icon: React.ElementType;
  label: string;
  title: string;
  description?: string;
  color?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  label,
  title,
  description,
  color = "cyan",
}) => {
  const colorClasses: Record<string, string> = {
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="text-center mb-16"
    >
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm mb-6 ${colorClasses[color]}`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">{description}</p>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════
// Navigation Component
// ═══════════════════════════════════════════════════
const Navigation: React.FC = () => {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 15, 0)", "rgba(10, 10, 15, 0.95)"],
  );
  const { playHover, playClick } = useSound();

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Journey", href: "#experience" },
    { label: "Interests", href: "#interests" },
  ];

  return (
    <motion.nav
      style={{ backgroundColor }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/0 hover:border-white/5 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={playClick}
          onMouseEnter={playHover}
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-white">
            {rootNode?.label || "PREYAM"}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ y: -2 }}
              onMouseEnter={playHover}
              onClick={playClick}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg transition-all relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all" />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={playHover}
            onClick={playClick}
            className="hidden sm:flex px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Mail className="w-4 h-4" />
            Contact
          </motion.a>
          <Link
            to="/"
            onClick={playClick}
            onMouseEnter={playHover}
            className="px-4 py-2 text-sm bg-white/5 border border-white/10 text-zinc-300 rounded-lg hover:border-cyan-500/30 hover:text-cyan-400 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">3D View</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

// ═══════════════════════════════════════════════════
// Hero Section
// ═══════════════════════════════════════════════════
const HeroSection: React.FC = () => {
  const { playHover, playClick } = useSound();

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-transparent to-purple-950/20" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]"
        />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-400 mb-8"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Available for work
          <MapPin className="w-3 h-3 ml-1" />
          Remote
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-md opacity-60"
            />
            <div className="relative w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-1 shadow-2xl shadow-cyan-500/30">
              <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-6xl">
                ⚡
              </div>
            </div>
          </div>
        </motion.div>

        {/* Name & Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
            {rootNode?.label || "PREYAM"}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-zinc-400 mb-4 max-w-2xl mx-auto"
        >
          {rootNode?.desc || "Developer • Creator • Explorer"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-base text-zinc-500 mb-10 max-w-xl mx-auto"
        >
          Building beautiful, performant web experiences with modern
          technologies. Passionate about Web3, AI, and creating tools that
          matter.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href="#projects"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={playClick}
            onMouseEnter={playHover}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            View My Work
            <ArrowRight className="w-5 h-5" />
          </motion.a>
          <motion.a
            href={`mailto:${SOCIAL_LINKS.email}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playClick}
            onMouseEnter={playHover}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 flex items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Get in Touch
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          {[
            { icon: Github, href: SOCIAL_LINKS.github, label: "GitHub" },
            { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
            { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.1 }}
              onClick={playClick}
              onMouseEnter={playHover}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all"
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-cyan-400 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════
// About Section
// ═══════════════════════════════════════════════════
const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          icon={User}
          label="About Me"
          title="Who I Am"
          description="A passionate developer exploring the intersection of technology, creativity, and human experience."
        />

        {/* Personality Traits */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
        >
          {personality.map((trait, index) => (
            <motion.div
              key={trait.id}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -4 }}
              className="p-6 bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/10 rounded-2xl text-center hover:border-pink-500/30 transition-all cursor-default group"
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 15 }}
                className="text-3xl mb-3"
              >
                🧠
              </motion.div>
              <p className="text-white font-medium group-hover:text-pink-300 transition-colors">
                {trait.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interests Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {interests.slice(0, 8).map((interest, index) => (
            <motion.div
              key={interest.id}
              variants={fadeInUp}
              whileHover={{ x: 4 }}
              className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-amber-500/30 hover:bg-amber-500/5 transition-all flex items-center gap-3"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CLUSTER_COLORS[NodeType.INTEREST] }}
              />
              <p className="text-zinc-300 text-sm">{interest.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════
// Projects Section
// ═══════════════════════════════════════════════════
const ProjectsSection: React.FC = () => {
  // Project colors for variety
  const projectGradients = [
    "from-cyan-500/20 via-cyan-500/5",
    "from-purple-500/20 via-purple-500/5",
    "from-pink-500/20 via-pink-500/5",
    "from-emerald-500/20 via-emerald-500/5",
    "from-amber-500/20 via-amber-500/5",
    "from-blue-500/20 via-blue-500/5",
  ];

  return (
    <section id="projects" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeader
          icon={Code2}
          label="Projects"
          title="What I've Built"
          description="A selection of projects that showcase my passion for building innovative solutions."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={scaleIn}
              whileHover={{ y: -8 }}
              className="group relative bg-[#0f0f14] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              {/* Project Header/Image Area */}
              <div
                className={`h-44 bg-gradient-to-br ${projectGradients[index % projectGradients.length]} to-transparent relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/10 group-hover:scale-110 transition-transform">
                    💻
                  </div>
                </motion.div>
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Active
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {project.label}
                </h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                  {project.desc}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {["React", "TypeScript", "Node.js"]
                    .slice(0, (index % 3) + 1)
                    .map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white/5 rounded text-xs text-zinc-500"
                      >
                        {tech}
                      </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Source
                    </a>
                  )}
                  {!project.link && !project.github && (
                    <span className="text-sm text-zinc-600">Coming soon</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:text-white hover:border-white/20 transition-all"
          >
            <Github className="w-5 h-5" />
            View All Projects on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════
// Skills Section
// ═══════════════════════════════════════════════════
const SkillsSection: React.FC = () => {
  const categories = [
    {
      name: "Frontend",
      icon: "🎨",
      skills: ["React", "TypeScript", "Three.js", "WebGL", "GLSL"],
      color: "cyan",
    },
    {
      name: "Backend",
      icon: "⚙️",
      skills: ["Node.js", "Python", "Go", "GraphQL", "PostgreSQL", "Redis"],
      color: "emerald",
    },
    {
      name: "DevOps & Cloud",
      icon: "☁️",
      skills: ["Docker", "Kubernetes", "AWS", "Linux", "Git"],
      color: "purple",
    },
    {
      name: "Design & AI",
      icon: "🤖",
      skills: ["Figma", "Blender", "TensorFlow"],
      color: "pink",
    },
  ];

  const colorClasses: Record<string, string> = {
    cyan: "from-cyan-500/20 border-cyan-500/20 hover:border-cyan-500/40",
    emerald:
      "from-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/40",
    purple:
      "from-purple-500/20 border-purple-500/20 hover:border-purple-500/40",
    pink: "from-pink-500/20 border-pink-500/20 hover:border-pink-500/40",
  };

  const skillColors: Record<string, string> = {
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20",
    emerald:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20",
    purple:
      "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20",
    pink: "bg-pink-500/10 border-pink-500/20 text-pink-300 hover:bg-pink-500/20",
  };

  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          icon={Zap}
          label="Skills"
          title="Tech Stack"
          description="Technologies and tools I use to bring ideas to life."
          color="purple"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={slideInLeft}
              whileHover={{ scale: 1.02 }}
              className={`p-6 bg-gradient-to-br ${colorClasses[category.color]} to-transparent border rounded-2xl transition-all`}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-lg font-semibold text-white">
                  {category.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skillName) => (
                  <motion.span
                    key={skillName}
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1.5 border rounded-lg text-sm transition-all cursor-default ${skillColors[category.color]}`}
                  >
                    {skillName}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* All Skills */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <p className="text-sm text-zinc-500 mb-6">
            And {skills.length - 17}+ more technologies I work with...
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {skills.slice(0, 20).map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-default"
              >
                {skill.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════
// Experience Section
// ═══════════════════════════════════════════════════
const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="max-w-4xl mx-auto px-6 relative">
        <SectionHeader
          icon={Briefcase}
          label="Journey"
          title="My Path"
          color="emerald"
        />

        {/* Achievements */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-20"
        >
          <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            Achievements
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={fadeInUp}
                whileHover={{ x: 8 }}
                className="p-5 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/10 rounded-xl hover:border-amber-500/30 transition-all group"
              >
                <h4 className="text-white font-medium mb-1 group-hover:text-amber-300 transition-colors">
                  {achievement.label}
                </h4>
                <p className="text-zinc-400 text-sm">{achievement.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            Life Timeline
          </h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-cyan-500 to-purple-500" />

            {lifeEvents.map((event, index) => (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                className="relative pl-14 pb-10 last:pb-0"
              >
                {/* Timeline Dot */}
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className="absolute left-3 w-5 h-5 rounded-full bg-[#0a0a0f] border-2 border-emerald-500 shadow-lg shadow-emerald-500/30"
                  style={{ top: "4px" }}
                />

                <motion.div
                  whileHover={{ x: 8 }}
                  className="p-5 bg-white/5 border border-white/5 rounded-xl hover:border-emerald-500/20 hover:bg-white/[0.07] transition-all"
                >
                  <h4 className="text-white font-medium text-lg">
                    {event.label}
                  </h4>
                  <p className="text-zinc-400 text-sm">{event.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════
// Interests Section
// ═══════════════════════════════════════════════════
const InterestsSection: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("movies");

  const tabs = [
    {
      id: "movies",
      label: "Movies",
      icon: Film,
      data: movies,
      color: "#ffd700",
    },
    {
      id: "books",
      label: "Books",
      icon: BookOpen,
      data: books,
      color: "#10b981",
    },
    {
      id: "anime",
      label: "Anime",
      icon: Sparkles,
      data: animes,
      color: "#ff69b4",
    },
    { id: "music", label: "Music", icon: Music, data: music, color: "#9333ea" },
    {
      id: "hobbies",
      label: "Hobbies",
      icon: Gamepad2,
      data: hobbies,
      color: "#ff8c00",
    },
  ];

  const activeData = tabs.find((t) => t.id === activeTab);

  return (
    <section id="interests" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          icon={Heart}
          label="Interests"
          title="What I Love"
          description="Beyond code — the movies, books, anime, and music that inspire me."
          color="pink"
        />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/10 border-2 text-white shadow-lg"
                    : "bg-white/5 border border-transparent text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
                style={
                  isActive
                    ? {
                        borderColor: tab.color,
                        boxShadow: `0 0 20px ${tab.color}30`,
                      }
                    : {}
                }
              >
                <Icon
                  className="w-4 h-4"
                  style={isActive ? { color: tab.color } : {}}
                />
                {tab.label}
                <span className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {tab.data.length}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Content Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {activeData?.data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                  {item.label}
                </h4>
                {item.rating && (
                  <div
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${activeData.color}20`,
                      color: activeData.color,
                    }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {item.rating}
                  </div>
                )}
              </div>
              <p className="text-zinc-400 text-sm">{item.desc || item.genre}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════
// Contact Section
// ═══════════════════════════════════════════════════
const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/30 via-purple-950/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-cyan-500/20 to-transparent rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
            <Send className="w-4 h-4" />
            Let's Connect
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Got a project in mind?
          </h2>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-12">
            I'm always open to discussing new opportunities, interesting
            projects, or just having a chat about tech.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.a
              href={`mailto:${SOCIAL_LINKS.email}`}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-cyan-500 to-purple-500 text-white font-semibold rounded-xl shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Send me an email
            </motion.a>
            <motion.a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              Check my GitHub
            </motion.a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: Github, href: SOCIAL_LINKS.github, label: "GitHub" },
              { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
              {
                icon: Linkedin,
                href: SOCIAL_LINKS.linkedin,
                label: "LinkedIn",
              },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.1 }}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                aria-label={label}
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════
// Footer
// ═══════════════════════════════════════════════════
const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} {rootNode?.label || "PREYAM"}. Built with
          ❤️ and lots of ☕
        </p>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Explore 3D Experience
          </Link>
        </div>
      </div>
    </footer>
  );
};

// ═══════════════════════════════════════════════════
// Main Portfolio Page
// ═══════════════════════════════════════════════════
const Portfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <InterestsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
