const fs = require('fs');
let content = fs.readFileSync('src/app/services/page.tsx', 'utf8');

// Replace everything from const services = [ to ]; with an import
content = content.replace(/const services = \[\s*\{[\s\S]*?\n\];/g, 'import { servicesData as services } from "@/config/services-data";');

// Update GlowCard mappings
content = content.replace(
  /<GlowCard className="flex flex-col h-full bg-card\/80 backdrop-blur md" glowColor=\{service.color\}>([\s\S]*?)<\/GlowCard>/g,
  `<Link href={\`/services/\${service.slug}\`} className="block h-full group">
                <GlowCard className="flex flex-col h-full bg-card/80 backdrop-blur md transition-all hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]" glowColor={service.color}>
                  $1
                </GlowCard>
              </Link>`
);

content = content.replace(
  /<CardTitle>Managed Hosting<\/CardTitle>/g,
  `<CardTitle><Link href="/services/managed-hosting" className="hover:text-primary transition-colors after:absolute after:inset-0">Managed Hosting</Link></CardTitle>`
);
content = content.replace(
  /<CardTitle>Maintenance & Support<\/CardTitle>/g,
  `<CardTitle><Link href="/services/maintenance-support" className="hover:text-primary transition-colors after:absolute after:inset-0">Maintenance & Support</Link></CardTitle>`
);

content = content.replace(
  /className="bg-secondary\/10 border-border\/20"/g,
  `className="bg-secondary/10 border-border/20 relative group hover:border-primary/50 transition-colors"`
);

fs.writeFileSync('src/app/services/page.tsx', content);
