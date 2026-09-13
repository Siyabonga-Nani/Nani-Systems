"use client";

import { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, Monitor, Smartphone, Server } from "lucide-react";
import { GlowCard, ScrollReveal } from "@/components/ui/visual-effects";
import { motion } from "framer-motion";

export function Services() {
  const highlightServices = [
    { id: 'web', title: 'Web & Software', description: 'Business websites, corporate portals, and complex web applications.', icon: <Monitor className="h-6 w-6 relative z-10" />, color: "rgba(6, 182, 212, 0.2)", stroke: "#06b6d4" },
    { id: 'app', title: 'Mobile Applications', description: 'Cross-platform mobile apps for iOS and Android.', icon: <Smartphone className="h-6 w-6 relative z-10" />, color: "rgba(138, 43, 226, 0.2)", stroke: "#8a2be2" },
    { id: 'infrastructure', title: 'Hosting & Maintenance', description: 'Managed application infrastructure, deployment, and ongoing support.', icon: <Server className="h-6 w-6 relative z-10" />, color: "rgba(0, 255, 136, 0.2)", stroke: "#00ff88" },
  ];

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden group/section">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nani-violet/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Global Connection Field */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-1000">
        <svg className="w-full h-full opacity-10">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 group/heading cursor-default inline-block">
              <span className="relative">
                What We Build
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover/heading:w-full" />
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you have a new idea, an existing website, or an unfinished project, we act as your long-term technology partner.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {highlightServices.map((service, index) => (
            <ScrollReveal key={service.id} delay={index * 0.1}>
              <GlowCard className="flex flex-col h-full bg-card/60 backdrop-blur-md border-border/40 overflow-visible" glowColor={service.color}>
                {/* Visual Pathway */}
                <div className="absolute -top-12 right-6 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <motion.path 
                      d="M 50 100 L 50 50 L 100 50" 
                      fill="none" 
                      stroke={service.stroke} 
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      whileHover={{ pathLength: 1, strokeDashoffset: -20 }}
                      transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                    />
                    <circle cx="100" cy="50" r="3" fill={service.stroke} className="animate-pulse" />
                  </svg>
                </div>

                <CardHeader className="relative z-10">
                  <div className="mb-6 p-3 bg-secondary/30 w-fit rounded-xl border border-border/50 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-background relative overflow-hidden group/icon">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-primary/20 opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl flex items-center justify-between group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-3 pt-6 mt-auto border-t border-border/30 relative z-10 bg-card/40 backdrop-blur-sm rounded-b-2xl">
                  <Link href="/services" className={buttonVariants({ variant: "ghost", className: "w-full justify-between group/btn hover:bg-primary/5 hover:text-primary" })}>
                    Learn More <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </Link>
                </CardFooter>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
        
        <ScrollReveal delay={0.4}>
          <div className="mt-12 flex justify-center">
             <Link href="/services">
               <Button variant="default" size="lg" className="rounded-full px-8 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-shadow hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02]">
                 View All Capabilities
               </Button>
             </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
