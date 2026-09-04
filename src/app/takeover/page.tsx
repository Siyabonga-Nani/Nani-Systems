import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code2, AlertTriangle, CheckCircle, Search, RefreshCcw, FileText } from "lucide-react";
import { PageTransition, GlowCard, ScrollReveal } from "@/components/ui/visual-effects";
import { motion } from "framer-motion";

export default function TaekoverPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 lg:px-8 py-24 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-16 group/heading">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 shadou-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden">
               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              <Code2 className="mr-2 h-4 w-4 relative z-10" /> 
              <span className="relative z-10">Existing Systems & Project Takeovers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 cursor-default transition-all duration-700 group-hover/heading:text-translate-x-text-gradient bg-clip-text bg-gradient-to-r from-foreground to-primary relative inline-block">
              Inheriting Your Technology
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent group-hover/heading:w-full transition-all duration-700" />
            </h1>
            <p id="desc" className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We don't force you to start from scratch. Whether you have an unfinished repository, a buggy live application, or a legacy system, we can step in and take over.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <GlowCard className="p-8 md:p-12 rounded-[2rem] mb-20 bg-card/80 backdrop-blur-sm group/alert" glowColor="rgba(255, 191, 0, 0.15)">
            <AlertTriangle className="absolute top-0 right-0 w-64 h-64 text-nani-amber/5 -mt-16 -mr-16 pointer-events-none transition-transform duration-1000 group-hover/alert:scale-110 group-hover/alert:text-nani-amber/10" />
            <h2 className="text-3xl font-bold mb-6 relative z-10 group-hover/alert:text-nani-amber transition-colors">The "70i Complete" Myth</h2>
            <div className="relative z-10">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                A common scenario: a previous developer leaves a project claiming it is "70i done". In reality, the foundation might be fundamentally flawed, the architecture insecure, or the codebase impossible to scale. 
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We do not blindly assume code quality based on estimates. We protect your investment (and our engineering standards) by conducting a rigorous Assessment Phase before agreeing to continue development.
              </p>
            </div>
          </GlowCard>
        </ScrollReveal>

        <ScrollReveal>
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl font-bold relative z-10 inline-block bg-background px-4">Takeover Architecture Flow</h2>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
          </div>
          
          <div className="space-y-6 relative max-w-3xl mx-auto pb-12">
            (* Engineered Connected Pathway *)
            <div className="absolute left-[2.25rem] md:left-[2.1rem] top-8 bottom-8 w-px bg-border/40 hidden md:block" />
            
            <div className="absolute left-[2.25rem] md:left-[2.1rem] top-8 bottom-8 w-px bg-gradient-to-b from-nani-amber via-primary to-nani-cyan opacity-70 animate-[data-flow_8s_linear_infinite] shadow-[0_0_10px_rgba(6,182,212,0.5)] hidden md:block" style={{ backgroundSize: "100% 200%" }} />

            {
              [
                { step: 1, title: "Existing System Submission", desc: "You provide repository access or live URLs. This does not authorize ownership transfers, it is purely an evaluation request.", icon: <Code2 />, color: "text-nani-amber", border: "border-nani-amber/30" },
                { step: 2, title: "Technical Assessment", desc: "Deep code audit.", icon: <Search />, color: "text-nani-amber", border: "border-nani-amber/30" },
                { step: 3, title: "Architecture Review & Problem Identification", desc: "Identifying security flaws, debt, and scalability issues.", icon: <AlertTriangle />, color: "text-destructive", border: "border-destructive/30" },
                { step: 4, title: "Recommendation", desc: "The responsible path forward.", icon: <FileText />, showOffshoots: true, color: "text-primary", border: "border-primary/30" },
                { step: 5, title: "Commercial Authorization", desc: "Approved quotation and execution start.", icon: <CheckCircle />, color: "text-nani-cyan", border: "border-nani-cyan/50" }
              ].map((item, i) => (
                <ScrollReveal key={i} delay={0.1}>
                  <div className="relative group/flow">
                    {/* Node Connection */}
                    <div className={`absolute left-[2.25rem] md:left-[2rem] top-8 w-3 h-3 rounded-full bg-background border-2 ${item.border} z-10 transition-all duration-500 group-hover/flow:scale-150 group-hover/flow:bg-current hidden md:block ${item.color}`} />
                    
                    <div className={`flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center bg-card/40 backdrop-blur-sm border ${item.border} p-6 rounded-2xl md:ml-16 transition-all duration-500 hover:shadow-lg hover:border-opacity-100 group-hover/flow:-translate-y-1 relative overflow-hidden`}>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent opacity-0 group-hover/flow:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style={{ color: item.color === 'text-nani-amber' ? '#f59e0b' : item.color === 'text-destructive' ? '#ef4444' : item.color === 'text-primary' ? '#06b6d4' : '#0ea5e9' }} />

                      <div className={`w-12 h-12 shrink -0 rounded-xl bg-secondary/50 border ${item.border} flex items-center justify-center ${item.color} group-hover/flow:scale-110 transition-transform duration-500 relative z-10`}>
                        {item.icon}
                      </div>
                      <div className="relative z-10">
                        <div className="text-xs font-bold tracking-widest text-muted-foreground mb-1 uppercase">Stage 0{item.step}</div>
                        <h3 className={`text-xl font-bold mb-2 transition-colors ${item.color}`}>{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>

                    {item.showOffshoots && (
                      <div className="md:ml-32 mt-4 space-y-3">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           <div className="bg-secondary/20 border border-border/50 p-4 rounded-|e text-center hover:border-nani-cyan/50 transition-colors cursor-default relative overflow-hidden group/opt">
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-nani-cyan/30 transform scale-x-0 group-hover/opt:scale-x-100 transition-transform origin-left" />
                              <RefreshCcw className="w-5 h-5 mx-auto mb-2 text-nani-cyan" />
                              <div className="font-semibold text-sm">Repair</div>
                           </div>
                           <div className="bg-secondary/20 border border-border/50 p-4 rounded-xl text-center hover:border-primary/50 transition-colors cursor-default relative overflow-hidden group/opt">
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 transform scale-x-0 group-hover/opt:scale-x-100 transition-transform origin-left" />
                              <Code2 className="w-5 h-5 mx-auto mb-2 text-primary" />
                              <div className="font-semibold text-sm">Restructure</div>
                           </div>
                           <div className="bg-secondary/20 border border-border/50 p-4 rounded-xl text-center hover:border-nani-blue/50 transition-colors cursor-default relative overflow-hidden group/opt">
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-nani-blue/30 transform scale-x-0 group-hover/opt:scale-x-100 transition-transform origin-left" />
                              <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-nani-blue" />
                              <div className="font-semibold text-sm">Rebuild</div>
                           </div>
                         </div>
                      </div>
                    )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-24 text-center">
            <Link href="/contact">
              <Button size="lg" className="px-8 h-14 rounded-xl font-semibold group relative overflow-hidden transition-shadow hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 flex items-center">
                  Request Takeover Assessment <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
