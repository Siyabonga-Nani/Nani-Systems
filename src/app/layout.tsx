import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SystemLoader, GlobalCursorGlow } from "@/components/ui/visual-effects";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://nanisystems.com'),
  title: {
    default: "Nani Systems | We Build Digital Solutions",
    template: "%s | Nani Systems"
  },
  description: "Nani Systems designs and develops professional websites, applications, software, games and AI-powered solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased flex flex-col selection:bg-primary/30`}>
        <SystemLoader />
        <GlobalCursorGlow />
        <SiteHeader />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
