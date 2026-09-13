import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-24 max-w-5xl text-center">
      <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
        <Code className="mr-2 h-4 w-4" /> Our Work
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Real Engineering</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
        We build internal business systems, proprietary web applications, and digital products. Due to strict NDAs and enterprise confidentiality, we only share case studies when explicitly authorized by our clients.
      </p>

      <div className="bg-secondary/10 p-12 rounded-3xl border border-border/50 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Looking for a specific capability?</h2>
        <p className="text-muted-foreground mb-8">
          If you want to know if we have experience with your specific industry or technology stack, the best approach is to start a conversation.
        </p>
        <Link href="/contact">
          <Button size="lg" className="px-8 font-semibold">Talk to Nani <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  );
}
