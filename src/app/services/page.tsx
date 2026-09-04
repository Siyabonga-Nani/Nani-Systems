import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Monitor, Smartphone, Code, TrendingUp, Bot, Terminal, Server, Gamepad2, Wrench, Shield, Cloud, ArrowRight } from "lucide-react";
import { PageTransition, GlowCard, ScrollReveal } from "@/components/ui/visual-effects";

const services = [
  {
    title: "Website Development",
    icon: <Monitor className="h-7 w-7" />,
    description: "Business websites, corporate portals, and responsive designs that communicate your value.",
    audience: "Businesses needing a strong digital presence.",
    price: "Starting from approx. R25,000",
    disclaimer: "Final quote depends on scope, design, and complexity.",
    color: "rgba(6, 182, 212, 0.15)",
  },
  {
    title: "Web Applications",
    icon: <Terminal className="h-7 w-7" />,
    description: "Interactive platforms, dashboards, and authenticated systems that go beyond informational sites.",
    audience: "Companies needing complex user interaction.",
    price: "Custom Quotation Required",
    color: "rgba(30, 58, 138, 0.15)",
  },
  {
    title: "Business Software",
    icon: <Code className="h-7 w-7" />,
    description: "Custom internal systems like CRMs, invoicing, project management, and automated workflows.",
    audience: "Businesses looking to streamline operations.",
    price: "Custom Quotation Required",
    color: "rgba(138, 43, 226, 0.15)",
  },
  {
    title: "Mobile Applications",
    icon: <Smartphone className="h-7 w-7" />,
    description: "Cross-platform mobile apps for iOS and Android, including backends and APIs.",
    audience: "Companies needing native mobile presence.",
    price: "Custom Quotation Required",
    color: "rgba(236, 72, 153, 0.15)",
  },
  {
    title: "E-Commerce",
    icon: <TrendingUp className="h-7 w-7" />,
    description: "Online stores, custom product systems, payment integrations.",
    audience: "Retailers moving online or upgrading stores.",
    price: "Custom Quotation Required",
    disclaimer: "Third-party platform costs are separate.",
    color: "rgba(255, 160, 122, 0.15)",
  },
  {
    title: "API & System Integration",
    icon: <Server className="h-7 w-7" />,
    description: "Connecting REST APIs, payment providers, and syncing external services to eliminate manual work.",
    audience: "Businesses using disconnected systems.",
    price: "Custom Quotation Required",
    color: "rgba(16, 185, 129, 0.15)",
  },
  {
    title: "Bug Fixing & System Repair",
    icon: <Wrench className="h-7 w-7" />,
    description: "When software breaks, deployments fail, or integrations stop working, we step in.",
    audience: "Teams with critical technical debt or failing systems.",
    price: "Custom Quotation Required",
    color: "rgba(239, 68, 68, 0.15)",
  },
  {
    title: "AI & Automation",
    icon: <Bot className="h-7 w-7" />,
    description: "Integrating AI models, automating workflows, and processing documents intelligently.",
    audience: "Companies wanting to leverage AI effectively.",
    price: "Custom Quotation Required",
    disclaimer: "Autonomous Nani Systems remain Coming Soon.",
    color: "rgba(16, 185, 238, 0.15)",
  },
  {
    title: "Game Development",
    icon: <Gamepad2 className="h-7 w-7" />,
    description: "Prototypes, gameplay systems, web games, and custom game architecture.",
    audience: "Creators bringing a game concept to life.",
    price: "Custom Quotation Required",
    color: "rgba(245, 158, 11, 0.15)",
  },
  {
    title: "Migration & Modernization",
    icon: <Cloud className="h-7 w-7" />,
    description: "Moving away from outdated systems safely. Platform, database, and infrastructure.",
    audience: "Businesses stuck on legacy technology.",
    price: "Custom Quotation Required",
    color: "rgba(109, 40, 217, 0.15)",
  },
];

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
              <GlowCard className="flex flex-col h-full bg-card/80 backdrop-blur md" glowColor={service.color}>
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
              <GlowCard className="bg-secondary/10 border-border/20" glowColor="rgba(0, 255, 136, 0.15)">
                <CardHeader>
                  <Server className="h-8 w-8 text-nani-emerald mb-2" />
                  <CardTitle>Managed Hosting</CardTitle>
                  <CardDescription>
                    Application infrastructure, deployment, and monitoring. We manage the availability and security of your systems. Third-party costs may apply separately.
                  </CardDescription>
                </CardHeader>
              </GlowCard>
              
              <GlowCard className="bg-secondary/10 border-border/20" glowColor="rgba(255, 191, 0, 0.15)">
                <CardHeader>
                  <Shield className="h-8 w-8 text-nani-amber mb-2" />
                  <CardTitle>Maintenance & Support</CardTitle>
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
