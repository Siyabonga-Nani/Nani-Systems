import { portfolioItems } from "@/config/portfolio";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Selected Work</h2>
          <p className="text-lg text-muted-foreground">
            A showcase of systems, applications, and digital experiences we&apos;ve engineered.
          </p>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="text-center py-20 bg-secondary/5 border border-border/30 rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium text-foreground">Recent Projects</h3>
            <p className="text-muted-foreground mt-2 max-w-md">Our recent client case studies and technical architectures are currently being compiled and will be published shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden bg-card/40 border-border/50 hover:border-border transition-colors group">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-500">
                    <span className="font-mono text-xs opacity-50">Project Visual</span>
                  </div>
                </div>
                <CardHeader className="pt-6">
                  <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{item.category}</div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-secondary/50 text-xs font-normal text-muted-foreground">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pb-6">
                  <Link href="#" className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors">
                    View Project <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}