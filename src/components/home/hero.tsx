"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { AnimatedGrid, PageTransition, ScrollReveal } from "@/components/ui/visual-effects";
import { motion, Variants } from "framer-motion";

export function Hero() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <PageTransition>
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <AnimatedGrid />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <ScrollReveal delay={0.1}>
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)] group relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                <Terminal className="mr-2 h-4 w-4 relative z-10" /> 
                <span className="relative z-10">Enterprise Software Engineering</span>
              </div>
            </ScrollReveal>
            
            <motion.h1 
              variants={container}
              initial="hidden"
              animate="show"
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.1] flex flex-wrap gap-x-4 gap-y-2"
            >
              <motion.span variants={item}>We</motion.span>
              <motion.span variants={item}>Build</motion.span>
              <motion.span variants={item} className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-nani-cyan">Digital</span>
                <motion.span 
                  className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </motion.span>
              <motion.span variants={item} className="text-transparent bg-clip-text bg-gradient-to-r from-nani-cyan to-nani-blue">Solutions</motion.span>
              <motion.span variants={item}>That</motion.span>
              <motion.span variants={item}>Move</motion.span>
              <motion.span variants={item}>Businesses</motion.span>
              <motion.span variants={item}>Forward.</motion.span>
            </motion.h1>
            
            <ScrollReveal delay={0.5}>
              <p className="text-xl font-medium text-foreground mb-4 max-w-2xl leading-relaxed">
                You don't have to know exactly what you need. You just need to know where you want your business or product to go.
              </p>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                Nani Systems builds, improves, repairs, modernizes, and hosts digital systems. From custom web platforms to complex business software.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.6}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto text-base font-semibold group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-primary">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 flex items-center">
                      Start a Project 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold transition-all hover:bg-secondary/50 hover:text-primary hover:border-primary/50">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
