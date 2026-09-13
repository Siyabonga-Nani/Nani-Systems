"use client";

import { Badge } from "@/components/ui/badge";
import { Zap, Bot, Database, Workflow, Briefcase, Layers } from "lucide-react";
import { GlowCard, ScrollReveal } from "@/components/ui/visual-effects";
import { motion } from "framer-motion";

export function ComingSoon() {
  const futureProducts = [
    {
      id: "business-ops",
      icon: <Briefcase className="h-5 w-5 relative z-10" />,
      title: "Nani Business Suite",
      category: "Business Management",
      description: "A comprehensive enterprise resource planning and invoicing system tailored for service businesses.",
      status: "IN DEVELOPMENT",
    },
    {
      id: "automation-engine",
      icon: <Workflow className="h-5 w-5 relative z-10" />,
      title: "Automation Orchestrator",
      category: "Workflow Automation",
      description: "Visual workflow builder to connect APIs, sync databases, and automate repetitive business operations.",
      status: "PLANNED",
    },
    {
      id: "ai-tools",
      icon: <Bot className="h-5 w-5 relative z-10" />,
      title: "Nani Intelligence API",
      category: "AI Integration",
      description: "Drop-in AI models for client applications and document processing pipelines.",
      status: "COMING SOON",
    },
    {
      id: "data-sync",
      icon: <Database className="h-5 w-5 relative z-10" />,
      title: "Data Sync Engine",
      category: "Data Infrastructure",
      description: "Secure, real-time data synchronization across disconnected legacy systems.",
      status: "CONCEPT",
    },
    {
      id: "dev-tools",
      icon: <Layers className="h-5 w-5 relative z-10" />,
      title: "Developer Tools",
      category: "Engineering",
      description: "Proprietary React components, authentication wrappers, and tooling for rapid development.",
      status: "COMING SOON",
    }
  ];

  return (
    <section className="py-32 border-t border-border/40 relative overflow-hidden group/ecosystem">
      {/* Decorative gradient */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-md h-[1px] bg-primary blur-sm"></div>
      
      {/* Ecosystem Central Node Visualization */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl pointer-events-none opacity-0 group-hover/ecosystem:opacity-100 transition-opacity duration-1000">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-primary/5 animate-[spin_60s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full border border-nani-cyan/5 border-dashed animate-[spin_80s_linear_infinite_reverse]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)] relative z-10 group-hover/ecosystem:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-shadow duration-700">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            {/* Connection beam to ecosystem */}
            <div className="absolute left-1/2 top-12 -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary/50 to-transparent -z-10 animate-data-flow opacity-0 group-hover/ecosystem:opacity-100 transition-opacity duration-700" />

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Expanding The Ecosystem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nani Systems is continuously engineering new capabilities. These products will soon integrate seamlessly into our existing digital infrastructure.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {futureProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.1}>
              <GlowCard className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/30 p-6 group/product relative overflow-hidden" glowColor="rgba(6, 182, 212, 0.15)">
                
                {/* Node Connection Pathway inside card */}
                <div className="absolute -top-4 -right-4 w-24 h-24 pointer-events-none opacity-0 group-hover/product:opacity-100 transition-opacity duration-500 z-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <motion.path 
                      d="M 20 80 L 50 50 L 100 50" 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      whileHover={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.circle 
                      cx="20" cy="80" r="3" 
                      fill="#06b6d4"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="p-2.5 bg-secondary/50 rounded-lg text-primary group-hover/product:bg-primary/10 transition-colors duration-300">
                    {product.icon}
                  </div>
                  <Badge variant="outline" className="bg-secondary/20 text-muted-foreground border-border/50 text-[10px] uppercase tracking-wider group-hover/product:border-primary/50 group-hover/product:text-primary transition-colors">
                    {product.status}
                  </Badge>
                </div>
                
                <div className="relative z-10">
                  <p className="text-xs font-medium text-primary/80 mb-1 tracking-wide">{product.category}</p>
                  <h3 className="text-lg font-bold mb-2 group-hover/product:text-primary transition-colors">{product.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
