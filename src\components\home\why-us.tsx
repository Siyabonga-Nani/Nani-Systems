import { CheckCircle2 } from "lucide-react";

export function WhyUs() {
  const principles = [
    {
      title: "Built Around Your Requirements",
      description: "Solutions are designed around the actual business problem, not forced into a generic template.",
    },
    {
      title: "Scalable Architecture",
      description: "We build solid foundations that can grow with your business and handle increased demand.",
    },
    {
      title: "Modern Technology",
      description: "Appropriate use of modern technologies to ensure fast, secure, and maintainable systems without unnecessary complexity.",
    },
    {
      title: "Human Support",
      description: "Direct communication with our team. We believe in clear, honest, and accessible client relations.",
    },
    {
      title: "Transparent Process",
      description: "Clear scopes, accurate quotations, and defined project milestones from day one.",
    },
  ];

  return (
    <section className="py-20 border-y border-border/40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Why Nani Systems</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              We approach every project with engineering rigor and business pragmatism. We build what you need to succeed.
            </p>
          </div>
          <div className="space-y-8">
            {principles.map((principle, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}