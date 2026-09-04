import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-bold text-xl tracking-tight">
            NANI SYSTEMS
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            We build digital solutions that move businesses forward.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-sm text-foreground">Services</h4>
          <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Web & Software</Link>
          <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mobile Applications</Link>
          <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">System Integrations</Link>
          <Link href="/takeover" className="text-sm text-muted-foreground hover:text-primary transition-colors">Project Takeovers</Link>
          <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hosting & Maintenance</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-sm text-foreground">Company</h4>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
          <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">Portfolio</Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-sm text-foreground">Legal & Policies</h4>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          <span className="text-xs text-muted-foreground mt-4">
            * Legal documents subject to final professional review.
          </span>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
