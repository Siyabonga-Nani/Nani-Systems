import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Palette, Lightbulb, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-24 max-w-5xl">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">About Nani Systems</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We are a professional software engineering and technology company. We act as long-term technology partners, engineering systems that drive business growth.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-6">Engineering Excellence</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We don't just write code; we architect solutions. Whether we are building a landing page or a complex internal business system, our approach is rooted in solid engineering principles.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our ecosystem spans modern web frameworks, scalable databases, mobile environments, and secure cloud infrastructure.
          </p>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-6">Core Technologies</h2>
          <div className="bg-secondary/10 p-6 rounded-2xl border border-border/50 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">Next.js & React</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">TypeScript</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">Node.js</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">PostgreSQL</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">Prisma</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">Tailwind CSS</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">REST APIs</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">AI Integrations</span>
            <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-sm">Shopify & WooCommerce</span>
            <span className="px-3 py-1 text-muted-foreground text-sm flex items-center">And more...</span>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-10 text-center">Our Principles</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <ShieldCheck className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-3">Security-Oriented</h3>
          <p className="text-muted-foreground text-sm">
            We implement robust authentication, authorization, input validation, and secure data handling. While we do not claim absolute invulnerability, we follow rigorous industry standards for system hardening and API security.
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <Palette className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-3">UI/UX as Engineering</h3>
          <p className="text-muted-foreground text-sm">
            User experience and interface design are not simply decoration. We treat UI/UX, responsive design, and accessibility as critical engineering requirements that dictate the usability of a system.
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <Lightbulb className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-3">Technical Consulting</h3>
          <p className="text-muted-foreground text-sm">
            Beyond coding, we provide paid technical consultation for architecture, software feasibility, modernization, and product development planning.
          </p>
        </div>
      </div>

      <div className="mt-24 p-8 border-l-4 border-primary bg-secondary/10">
        <h3 className="text-xl font-bold mb-3">Intellectual Property & Licensing</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
          We operate transparently regarding technology ownership. Commercial agreements clearly define which client assets you own outright, our proprietary Nani-owned technology layers, third-party software, and open-source components. Handover rights and reuse rights are explicitly documented in your contract.
        </p>
      </div>

      <div className="mt-24 text-center">
        <Link href="/contact">
          <Button size="lg" className="px-8 font-semibold">Talk to Nani <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  );
}
