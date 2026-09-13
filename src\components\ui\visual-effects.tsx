"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

// --- GLOBAL PAGE TRANSITION ---
export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) return <>{children}</>;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}


// --- SYSTEM LOADER ---
export function SystemLoader() {
  const [stage, setStage] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Only play once per session
    const hasPlayed = sessionStorage.getItem("nani_intro_played");
    if (!hasPlayed && !shouldReduceMotion) {
      setShouldPlay(true);
      
      // Sequence timing
      const timings = [
        { s: 1, t: 400 },   // CONNECT
        { s: 2, t: 1200 },  // ROUTE
        { s: 3, t: 2000 },  // ASSEMBLE
        { s: 4, t: 2800 },  // ILLUMINATE
        { s: 5, t: 3600 },  // ACTIVATE
        { s: 6, t: 4400 }   // EXIT
      ];
      
      timings.forEach(({s, t}) => {
        setTimeout(() => setStage(s), t);
      });
      
      sessionStorage.setItem("nani_intro_played", "true");
    }
  }, [shouldReduceMotion]);

  if (!shouldPlay) return null;
  if (stage === 6) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
      animate={{ opacity: stage === 5 ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ pointerEvents: stage >= 5 ? "none" : "all" }}
    >
      {/* Ambient environment */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]"
        animate={{ opacity: stage >= 4 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      />
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Placeholder Node Geometry for the Animation */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 absolute z-10 overflow-visible">
          {/* STAGE 1 & 2: CONNECT (Nodes appear) */}
          <motion.circle cx="20" cy="20" r="1.5" fill="#06b6d4" initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? 0.8 : 0 }} transition={{ duration: 0.5 }} />
          <motion.circle cx="80" cy="20" r="1.5" fill="#06b6d4" initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? 0.8 : 0 }} transition={{ duration: 0.5, delay: 0.1 }} />
          <motion.circle cx="50" cy="80" r="1.5" fill="#06b6d4" initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? 0.8 : 0 }} transition={{ duration: 0.5, delay: 0.2 }} />
          <motion.circle cx="50" cy="50" r="2" fill="#06b6d4" initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.3 }} />

          {/* STAGE 2: ROUTE (Pathways draw) */}
          <motion.path 
            d="M 20 20 L 50 50 M 80 20 L 50 50 M 50 80 L 50 50 M 20 20 L 80 20 L 50 80 Z" 
            fill="none" 
            stroke="rgba(6,182,212,0.3)" 
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: stage >= 2 ? 1 : 0, 
              opacity: stage >= 2 ? 1 : 0 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* STAGE 3: ROUTE LIGHTS (Data travelling) */}
          {stage >= 2 && (
            <motion.path 
              d="M 20 20 L 50 50 L 80 20" 
              fill="none" 
              stroke="#06b6d4" 
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 1, pathOffset: 0 }}
              animate={{ pathLength: [0, 0.2, 0], pathOffset: [0, 0.8, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, ease: "linear" }}
            />
          )}

          {/* STAGE 4: ASSEMBLE (Converging into central symbol) */}
          <motion.path 
            d="M 35 35 L 65 35 L 50 65 Z" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0, scale: 1.5, rotate: -30 }}
            animate={{ 
              pathLength: stage >= 3 ? 1 : 0, 
              opacity: stage >= 3 ? 1 : 0,
              scale: stage >= 3 ? 1 : 1.5,
              rotate: stage >= 3 ? 0 : -30
            }}
            style={{ transformOrigin: "50% 50%" }}
            transition={{ duration: 0.8, ease: "backOut" }}
          />

          {/* STAGE 5: ILLUMINATE (Glow and fill) */}
          <motion.path 
            d="M 35 35 L 65 35 L 50 65 Z" 
            fill={stage >= 4 ? "rgba(6,182,212,0.15)" : "transparent"} 
            stroke="#06b6d4" 
            strokeWidth="2"
            initial={{ opacity: 0, filter: "drop-shadow(0 0 0px rgba(6,182,212,0))" }}
            animate={{ 
              opacity: stage >= 4 ? 1 : 0,
              filter: stage >= 4 ? "drop-shadow(0 0 15px rgba(6,182,212,0.8))" : "drop-shadow(0 0 0px rgba(6,182,212,0))"
            }}
            transition={{ duration: 0.6 }}
          />
        </svg>

        {/* Outer assembly rings */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-primary/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: stage >= 3 ? 1 : 0.8, opacity: (stage >= 3 && stage < 5) ? 1 : 0 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute -inset-4 rounded-full border border-dashed border-primary/10"
          initial={{ scale: 0.9, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: stage >= 3 ? 1 : 0.9, 
            opacity: (stage >= 3 && stage < 5) ? 1 : 0,
            rotate: 90
          }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </div>

      <motion.div 
        className="mt-12 text-center space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: (stage >= 4 && stage < 5) ? 1 : 0, y: (stage >= 4 && stage < 5) ? 0 : 10 }}
      >
        <div className="font-bold tracking-[0.25em] text-sm text-foreground">NANI SYSTEMS</div>
        <div className="text-[10px] tracking-widest text-primary font-mono uppercase">
          {stage === 4 ? "System Online" : "Initializing..."}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- GLOW CARD ---
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}
export function GlowCard({ children, className, glowColor = "rgba(6, 182, 212, 0.15)" }: GlowCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || shouldReduceMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card border border-border/50 group transition-all duration-300 hover:border-border hover:shadow-lg",
        className
      )}
    >
      {!shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

// --- SCROLL REVEAL ---
export function ScrollReveal({ children, delay = 0, className }: { children: ReactNode, delay?: number, className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- ANIMATED GRID BACKGROUND ---
export function AnimatedGrid() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className="absolute inset-0 bg-background" />;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]">
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zM20 0h20v20H20V0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-nani-cyan/10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}


// --- GLOBAL CURSOR GLOW ---
export function GlobalCursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    // Simple check for touch devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  if (isMobile || shouldReduceMotion) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
      style={{
        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.03), transparent 40%)`
      }}
    />
  );
}
