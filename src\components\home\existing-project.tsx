"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/visual-effects";
import { motion } from "framer-motion";

export function ExistingProject() {
  return (
    <section className="py-32 bg-background relative overflow-hidden group/takeover">
      {/* Dynamic Data Flow background */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,var(--primary)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-shimmer pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Tech visualization elements */}
        <div className="absolute top-10 left-10 text-primary/10 w-24 h-24 hidden md:block animate-[pulse_4s_ease-in-out_infinite]">
          <svg viewBox="0 0 100 100">
            <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 10" />
            <path d="M 30 30 L 70 30 L 70 70 L 30 70 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <ScrollReveal>
          <div className="bg-secondary/10 border border-border/30 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-20 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 shadow-2xl relative overflow-hidden group">
            
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
            
            <div className="flex-1 space-y-8 relative z-10">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
                <Code2 className="mr-2 h-4 w-4" /> Existing Projects
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] group-hover/takeover:text-transparent group-hover/takeover:bg-clip-text group-hover/takeover:bg-gradient-to-r group-hover/takeover:from-foreground group-hover/takeover:to-primary transition-all duration-700">
                Have an unfinished or broken system?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                You don't always need to start from scratch. We can step in, <span className="text-foreground font-medium border-b border-primary/30 group-hover/takeover:border-primary transition-colors cursor-default">assess your current codebase</span>, and recommend a responsible path forward&#8212;whether that's repairing, restructuring, or a complete takeover.
              </p>
              <div className="pt-6">
                <Link href="/takeover">
                  <Button size="lg" className="px-8 h-14 rounded-xl text-base font-semibold group/btn overflow-hidden relative transition-shadow hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 flex items-center">
                      Learn About Takeovers <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center w-full relative z-10">
              <div className="w-full max-w-md aspect-square bg-card/40 backdrop-blur-md border border-border/40 rounded-[2rem] flex items-center justify-center p-8 relative shadow-2xl overflow-hidden group-hover:border-primary/30 transition-colors duration-700">
                
                {/* Tech visualization elements: Broken to Fixed System */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200">
                  {/* Broken lines */}
                  <motion.path 
                    d="M 40 40 L 80 80 M 160 40 L 120 80 M 100 120 L 100 160" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeDasharray="4 8"
                    animate={{ 
                      strokeDasharray: ["4 8", "8 0", "8 0"],
                      opacity: [1, 0.5, 1],
                      pathLength: [0.5, 1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-destructive group-hover:text-primary transition-colors duration-1000"
                  />
                  {/* Stable core */}
                  <motion.circle 
                    cx="100" cy="100" r="30" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1"
                    className="text-muted-foreground group-hover:text-primary transition-colors duration-1000"
                    animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                </svg>

                <div className="absolute inset-8 rounded-[1.5rem] border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-16 rounded-[1rem] border border-nani-cyan/20 border-dotted animate-[spin_40s_linear_infinite_reverse]" />
                
                <Code2 className="w-24 h-24 text-primary opacity-60 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
