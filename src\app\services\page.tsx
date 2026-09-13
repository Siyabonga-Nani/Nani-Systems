import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Monitor, Smartphone, Code, TrendingUp, Bot, Terminal, Server, Gamepad2, Wrench, Shield, Cloud, ArrowRight } from "lucide-react";
import { PageTransition, GlowCard, ScrollReveal } from "@/components/ui/visual-effects";

import { servicesData as services } from "@/config/services-data";

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 lg:px-8 py-24 max-w-7xl">
        <ScrollReveal>
          <div className="max-w-4xl mb-16">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              Our Capabilities
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              We engineer systems that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-nani-cyan">solve problems.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From custom software and complex web applications to repairing broken systems and modernizing legacy code. We build what your business needs to move forward.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={(index % 3) * 0.1}>
              <Link href={`/services/${service.slug}`} className="block h-full group">
                <GlowCard className="flex flex-col h-full bg-card/80 backdrop-blur md transition-all hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]" glowColor={service.color}>
                  
                <CardHeader>
                  <div className="mb-4 p-3 rounded-xl bg-secondary/50 w-fit border border-border/50 text-foreground">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl flex items-center justify-between">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2 min-h-[4rem]">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 border-t border-border/20 pt-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Who it's for</p>
                    <p className="text-sm">{service.audience}</p>
                  </div>
                  <div className="pt-4 border-t border-border/20">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pricing</p>
                    <p className="text-sm font-bold">{service.price}</p>
                    {service.disclaimer && <p className="text-xs text-muted-foreground mt-1">{service.disclaimer}</p>}
                  </div>
                </CardContent>
              
                </GlowCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-24 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Recurring Services</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Beyond one-time projects, we offer managed infrastructure and ongoing support so you don't have to worry about uptime.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlowCard className="bg-secondary/10 border-border/20 relative group hover:border-primary/50 transition-colors" glowColor="rgba(0, 255, 136, 0.15)">
                <CardHeader>
                  <Server className="h-8 w-8 text-nani-emerald mb-2" />
                  <CardTitle><Link href="/services/managed-hosting" className="hover:text-primary transition-colors after:absolute after:inset-0">Managed Hosting</Link></CardTitle>
                  <CardDescription>
                    Application infrastructure, deployment, and monitoring. We manage the availability and security of your systems. Third-party costs may apply separately.
                  </CardDescription>
                </CardHeader>
              </GlowCard>
              
              <GlowCard className="bg-secondary/10 border-border/20 relative group hover:border-primary/50 transition-colors" glowColor="rgba(255, 191, 0, 0.15)">
                <CardHeader>
                  <Shield className="h-8 w-8 text-nani-amber mb-2" />
                  <CardTitle><Link href="/services/maintenance-support" className="hover:text-primary transition-colors after:absolute after:inset-0">Maintenance & Support</Link></CardTitle>
                  <CardDescription>
                    Routine updates, system health, and security maintenance. Note: Maintenance is not unlimited development. Major feature requests are quoted separately.
                  </CardDescription>
                </CardHeader>
              </GlowCard>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-32 border-t border-border/20 pt-16 relative">
            <h2 className="text-3 xl font-bold tracking-tight mb-2 text-center">Technology Stack</h2>
            <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto">We engineer using reliable, modern, production-ready technologies.</p>
-
            <div className="flex flex-wrap justify-center gap-4">
              {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "AVK/Rest API", "PayPal", "Android", "iOS", "Vercel"].map((tech, i) => (
                <div key={i} className="px-6 py-3 rounded-full border border-border/40 bg-card/20 backdrop-blur-sm text-sm font-medium">
                  {tech}
                </div>
              ))}
              <div className="px-6 py-3 rounded-full border border-transparent text-sm font-medium text-muted-foreground">
                And more&hellip;
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-32 p-8 md:p-12 bg-gradient-to-b from-card to-background border border-border/30 rounded-[2REM] text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--primary)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-3 xl font-bold mb-4">Don't know exactly what you need?</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                You don't need a complete technical specification to start. Tell us where your business needs to go, and we'll help architect the solution.
              </p>
              <Link href="/contact">
                <Button size="lg" className="px-8 font-semibold rounded-xl h-14 group">
                  Start a Project <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
