import { notFound } from "next/navigation";
import { servicesData } from "@/config/services-data";
import { PageTransition, ScrollReveal } from "@/components/ui/visual-effects";
import ServiceConfigurator from "@/components/services/ServiceConfigurator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find(s => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} - Nani Systems`,
    description: service.description,
  };
}

export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 max-w-7xl">
        <ScrollReveal>
          <div className="mb-12">
            <Link href="/services" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  {service.icon}
                  {service.title}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                  Ready to start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-nani-cyan">{service.title.toLowerCase()}</span> project?
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              <div className="shrink-0 bg-card border border-border/50 rounded-2xl p-6 shadow-sm md:w-72">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Investment</p>
                <p className="text-2xl font-bold text-foreground mb-2">{service.price}</p>
                {service.disclaimer && (
                  <p className="text-xs text-muted-foreground leading-snug">{service.disclaimer}</p>
                )}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ideal For</p>
                  <p className="text-sm">{service.audience}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-16">
            <ServiceConfigurator service={service} />
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
