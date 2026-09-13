const fs = require('fs');
const content = fs.readFileSync('src/app/services/page.tsx', 'utf8');

const slugMap = {
  "Website Development": "website-development",
  "Web Applications": "web-applications",
  "Business Software": "business-software",
  "Mobile Applications": "mobile-applications",
  "E-Commerce": "e-commerce",
  "API & System Integration": "api-integration",
  "Bug Fixing & System Repair": "bug-fixing",
  "AI & Automation": "ai-automation",
  "Game Development": "game-development",
  "Migration & Modernization": "migration"
};

let newContent = content;

for (const [title, slug] of Object.entries(slugMap)) {
  newContent = newContent.replace(`title: "${title}",`, `slug: "${slug}",\n    title: "${title}",`);
}

newContent = newContent.replace(
  /<GlowCard className="flex flex-col h-full bg-card\/80 backdrop-blur md" glowColor=\{service.color\}>([\s\S]*?)<\/GlowCard>/g,
  `<Link href={\`/services/\${service.slug}\`} className="block h-full group">
                <GlowCard className="flex flex-col h-full bg-card/80 backdrop-blur md transition-all hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]" glowColor={service.color}>
                  $1
                </GlowCard>
              </Link>`
);

newContent = newContent.replace(
  /<CardTitle>Managed Hosting<\/CardTitle>/g,
  `<CardTitle><Link href="/services/managed-hosting" className="hover:text-primary transition-colors after:absolute after:inset-0">Managed Hosting</Link></CardTitle>`
);
newContent = newContent.replace(
  /<CardTitle>Maintenance & Support<\/CardTitle>/g,
  `<CardTitle><Link href="/services/maintenance-support" className="hover:text-primary transition-colors after:absolute after:inset-0">Maintenance & Support</Link></CardTitle>`
);

newContent = newContent.replace(
  /className="bg-secondary\/10 border-border\/20"/g,
  `className="bg-secondary/10 border-border/20 relative group hover:border-primary/50 transition-colors"`
);

fs.writeFileSync('src/app/services/page.tsx', newContent);
