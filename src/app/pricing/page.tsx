import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { PageTransition, GlowCard, ScrollReveal } from "@/components/ui/visual-effects";

export default function PricingPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 lg:px-8 py-24 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4|e md:text-5xl font-extrabold tracking-tight mb-6">Transparent Commercials</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We don't hide our pricing logic. We provide honest estimates based on the reality of your engineering requirements.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <ScrollReveal>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Why "Starting From"?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Software is not a commodity. We list starting prices (e.g., Website Development starting from ~R25,000) to give you a realistic baseline. Your final quote depends entirely on the required architecture, functionality, design, integrations, and testing required for your specific business case.
                </p>
              </div>
              
              <div className="bg-secondary/10 p-8 rounded-[1rem] border border-border/50">
                <h3 className="font-semibold text-lg mb-4">What affects the final price?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span className="text-sm">Scope & Complexity of features</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span className="text-sm">Custom UI/UX Design requirements</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span className="text-sm">Third-party API Integrations</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span className="text-sm">Condition of existing systems (for takeovers)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span className="text-sm">Infrastructure and deployment architecture</span></li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Budget Handling</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If your requested scope exceeds your immediate budget, we don't automatically decline the project. We can help you:
                </p>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li className="list-disc ml-5">Reduce non-essential scope</li>
                  <li className="list-disc ml-5">Create a smaller Minimum Viable Product (MVP)</li>
                  <li className="list-disc ml-5">Defer complex features to a later phase</li>
                  <li className="list-disc ml-5">Establish a solid foundation to build upon later</li>
                </ul>
                <p className="mt-4 text-muted-foreground leading-relaxed font-medium">
                  We will be honest if the requested outcome simply cannot be responsibly engineered within the provided budget.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-24">
          <ScrollReveal>
            <GlowCard className="p-8 rounded-[1rem]" glowColor="rgba(6, 182, 212, 0.15)">
              <h3 className="text-2xl font-bold mb-4">Payment Methods</h3>
              <p className="text-muted-foreground mb-4">
                We currently accept the following payment methods for project invoices and recurring services:
              </p>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>&#8226; Electronic Funds Transfer (EFT)</li>
                <li>&#8226; PayPal Checkout (including eligible Credit/Debit Cards via PayPal)</li>
              </ul>
              <p className="text-xs text-muted-foreground">
                * VAT and Tax implications will be explicitly detailed on your quotation and final invoice based on current commercial regulations.
              </p>
            </GlowCard>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <GlowCard className="p-8 rounded-[1rem] overflow-hidden" glowColor="rgba(30, 58, 138, 0.15)">
              <ShieldAlert className="absolute -right-4 -bottom-4 w-32 h-32 text-secondary/20 pointer-events-none" />
              <h3 className="text-2xl font-bold mb-4">Declining Projects</h3>
              <p className="text-muted-foreground mb-4">
                We operate professionally, which means we do not accept every project. We may decline work if:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>&#8226; The project is technically unsuitable or insecure.</li>
                <li>&#8226; We do not have the current capacity to guarantee quality.</li>
                <li>&#8226; The scope is commercially impractical.</li>
                <li>&#8226; It requires legal/regulatory compliance outside our scope.</li>
              </ul>
            </GlowCard>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2}>
          <div className="mt-24 text-center">
            <Link href="/contact">
              <Button size="lg" className="px-8 h-14 rounded-xl font-semibold group">Request a Quote <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
