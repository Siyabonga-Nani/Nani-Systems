import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Search, FileText, Code, Rocket } from "lucide-react";

export function Process() {
  const steps = [
    { number: "01", title: "Discover & Assess", description: "We discuss your goals or evaluate your existing codebase.", icon: <Search className="h-6 w-6" /> },
    { number: "02", title: "Define & Quote", description: "Clear scope, architecture plan, and commercial terms.", icon: <FileText className="h-6 w-6" /> },
    { number: "03", title: "Build & Test", description: "Engineering, quality assurance, and security checks.", icon: <Code className="h-6 w-6" /> },
    { number: "04", title: "Launch & Support", description: "Deployment and optional ongoing managed infrastructure.", icon: <Rocket className="h-6 w-6" /> },
  ];

  return (
    <section id="process" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How We Work</h2>
          <p className="text-lg text-muted-foreground">
            A professional, transparent process designed to reduce risk and deliver high-quality engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className="mb-6 h-16 w-16 bg-secondary/30 rounded-2xl flex items-center justify-center text-primary border border-border/50 group-hover:border-primary/50 transition-colors">
                {step.icon}
              </div>
              <div className="absolute top-0 right-0 text-6xl font-black text-muted/10 -mt-4 -mr-4 pointer-events-none transition-all group-hover:text-primary/5">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <Link href="/how-it-works">
             <Button variant="outline" size="lg">Read the Full Process <ArrowRight className="ml-2 h-4 w-4" /></Button>
           </Link>
        </div>
      </div>
    </section>
  );
}
