import { CheckCircle, Code, MessageSquare, Search, ClipboardCheck, FileText, TestTube, Rocket, LifeBuoy, ArrowRight } from "lucide-react";
import { PageTransition, ScrollReveal } from "@/components/ui/visual-effects";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function HowItWorksPage() {
  const steps = [
    { icon: <MessageSquare size={20} />, title: "Discover", description: "We discuss your business goals, target audience, and what you want to achieve. No technical spec required." },
    { icon: <Search size={20} />, title: "Assess", description: "If you have an existing system, we evaluate its architecture, code quality, and feasibility." },
    { icon: <FileText size={20} />, title: "Define & Quote", description: "We establish the project scope and provide a transparent, itemized quotation." },
    { icon: <ClipboardCheck size={20} />, title: "Contract", description: "Commercial terms are agreed upon, expectations are set, and invoices are issued." },
    { icon: <Code size={20} />, title: "Build", description: "Engineering begins. We keep you informed and involved at critical approval points." },
    { icon: <TestTube size={20} />, title: "Test", description: "Rigorous quality assurance, usability testing, and security checks." },
    { icon: <CheckCircle size={20} />, title: "Approve", description: "You review the final product in a staging environment." },
    { icon: <Rocket size={20} />, title: "Launch", description: "Deployment to production infrastructure. The system goes live." },
    { icon: <LifeBuoy size={20} />, title: "Support", description: "Optional ongoing managed hosting and maintenance." },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 lg:px-8 py-24 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-24 relative group/heading">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 text-4xl md:text-5xl font-extrabold tracking-tight mb-6 inline-block relative cursor-default transition-all duration-700 group-hover/heading:from-primary group-hover/heading:to-nani-cyan">
              How We Work
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent group-hover/heading:w-full transition-all duration-700" />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A professional, structured process from initial idea to successful launch. Information moving through an engineered process.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative ml-6 md:ml-12 space-y-16 pb-16">
          {/* Engineered Data Flow Line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40" />
          
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-nani-cyan to-primary opacity-70 animate-[data-flow_8s_linear_infinite] shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ backgroundSize: "100% 200%" }} />

          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={0.1}>
              <div className="relative pl-12 md:pl-20 group/step">
                {/* Node Connection */}
                <div className="absolute -left-[5px] top-1.5 w-[11px] h-[11px] rounded-full bg-background border-2 border-primary z-10 transition-transform duration-500 group-hover/step:scale-150 group-hover/step:bg-primary group-hover/step:shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <div className="absolute left-0 top-3 w-8 md:w-12 h-px bg-border group-hover/step:bg-primary transition-colors duration-500" />

                <div className="absolute left-8 md:left-12 -top-1 w-10 h-10 bg-secondary/30 border border-border group-hover/step:border-primary/50 text-muted-foreground group-hover/step:text-primary rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover/step:shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover/step:-translate-y-1">
                  {step.icon}
                </div>
                <div className="transition-all duration-500 group-hover/step:translate-x-2 pl-12 md:pl-10">
                  <h3 className="text-2xl font-bold mb-2 group-hover/step:text-foreground/90">{step.title}</h3>
                  <p className="text-muted-foreground text-lg group-hover/step:text-muted-foreground/90">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 mt-16 pt-16 border-t border-border/50 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div>
              <h2 className="text-3xl font-bold mb-6">Client Responsibilities</h2>
              <p className="text-muted-foreground mb-6">
                Successful delivery is a partnership. To ensure we can engineer your system efficiently, we rely on you for:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Accurate business information and goals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Timely feedback and approvals during the build.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Secure access to required third-party systems.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Payment according to the agreed schedule.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Scope Changes</h2>
              <p className="text-muted-foreground mb-6">
                Projects evolve, and that's okay. If you need something outside the original approved scope:
              </p>
              <div className="bg-secondary/10 p-6 rounded-2xl border border-border/50 relative overflow-hidden group/scope">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/scope:opacity-100 transition-opacity duration-500" />
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground relative z-10">
                  <li>You request the change.</li>
                  <li>We assess the technical impact.</li>
                  <li>We quote the additional scope (if necessary).</li>
                  <li>You approve the changes.</li>
                  <li>We build it into the system.</li>
                </ol>
                <p className="mt-4 text-sm font-medium text-foreground relative z-10">
                  Note: We do not offer "unlimited changes" under fixed quotes.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-24 text-center">
            <Link href="/contact">
              <Button size="lg" className="px-8 h-14 rounded-xl font-semibold group relative overflow-hidden transition-shadow hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 flex items-center">
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}

export default HowItWorksPage;
