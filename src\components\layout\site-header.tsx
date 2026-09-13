import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAccountSession } from "@/lib/accountAuth";
import { getClientSession } from "@/lib/clientAuth";
import { getSession } from "@/lib/auth";

export async function SiteHeader() {
  const routes = [
    { name: "Services", path: "/services" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Pricing", path: "/pricing" },
    { name: "Takeovers", path: "/takeover" },
    { name: "About", path: "/about" },
  ];

  const adminSession = await getSession();
  const clientSession = await getClientSession();
  const accountSession = await getAccountSession();

  let authLink = { name: "Sign In", path: "/login" };
  if (adminSession?.role === "admin") {
    authLink = { name: "Your Account", path: "/admin" };
  } else if (clientSession?.role === "client") {
    authLink = { name: "Client Portal", path: "/portal" };
  } else if (accountSession?.role === "account") {
    authLink = { name: "Your Account", path: "/account" };
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">NANI SYSTEMS</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link key={route.path} href={route.path} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href={authLink.path} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2">
            {authLink.name}
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="text-sm font-medium">
              Talk to Nani
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
              Start a Project
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger className="md:hidden p-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link key={route.path} href={route.path} className="text-lg font-medium">
                    {route.name}
                  </Link>
                ))}
                <Link href={authLink.path} className="text-lg font-medium">
                  {authLink.name}
                </Link>
                <div className="h-px bg-border my-4" />
                <Link href="/contact">
                  <Button className="w-full justify-start text-lg font-medium" variant="ghost">Talk to Nani</Button>
                </Link>
                <Link href="/contact">
                  <Button className="w-full justify-start text-lg font-medium bg-primary text-primary-foreground">Start a Project</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
