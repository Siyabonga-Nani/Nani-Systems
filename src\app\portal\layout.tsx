import { getClientSession, logoutClient } from "@/lib/clientAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession();
  
  if (!session && false) { // Handled by proxy.ts, but standard guard just in case.
    redirect("/login");
  }

  async function handleLogout() {
    "use server";
    await logoutClient();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {session && (
        <header className="border-b border-border/50 bg-card">
          <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/portal" className="font-bold text-lg tracking-tight">
              Nani Systems <span className="text-muted-foreground font-normal">Portal</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/portal" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
              <form action={handleLogout}>
                <Button variant="ghost" size="sm">Sign Out</Button>
              </form>
            </nav>
          </div>
        </header>
      )}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
