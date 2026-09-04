import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, PhoneCall, Calendar } from "lucide-react";

export function CTA() {
  return (
    <section id="contact" className="py-24 bg-primary/5 border-t border-primary/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-card border border-border/50 rounded-3xl p-8 md:p-16 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Have an Idea? Let&apos;s Talk.</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Whether you need a custom application, an enterprise website, or an AI integration, our team is ready to engineer the right solution.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/quote" className="w-full">
              <Button size="lg" className="w-full py-8 text-base font-semibold flex flex-col gap-2 h-auto">
                <MessageSquare className="h-5 w-5" />
                Request a Quotation
              </Button>
            </Link>
            <Link href="/consultation" className="w-full">
              <Button size="lg" variant="secondary" className="w-full py-8 text-base font-semibold flex flex-col gap-2 h-auto">
                <Calendar className="h-5 w-5 text-primary" />
                Book a Consultation
              </Button>
            </Link>
            <Link href="/contact" className="w-full">
              <Button size="lg" variant="outline" className="w-full py-8 text-base font-semibold flex flex-col gap-2 h-auto bg-background/50">
                <PhoneCall className="h-5 w-5" />
                Request a Call
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}