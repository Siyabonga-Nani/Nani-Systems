import { getAccountSession, logoutAccount } from "@/lib/accountAuth";
import { loginClient } from "@/lib/clientAuth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, User } from "lucide-react";

export default async function AccountPage() {
  const session = await getAccountSession();
  if (!session) redirect("/login");

  const account = await db.account.findUnique({
    where: { id: session.accountId }
  });

  if (!account) redirect("/login");

  // If they somehow got a client ID attached, they should be in the portal
  // Auto-upgrade their session to Client
  if (account.clientId) {
    await loginClient(account.clientId);
    redirect("/portal");
  }

  async function logoutAction() {
    "use server";
    await logoutAccount();
    redirect("/");
  }

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Account</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {account.name}.</p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Name</p>
            <p className="text-muted-foreground bg-secondary/20 p-2 rounded">{account.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Email</p>
            <p className="text-muted-foreground bg-secondary/20 p-2 rounded">{account.email}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Start a Project</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Ready to build something? You can request a custom quote or start a consultation. Once a contract is 
signed, you will automatically gain access to the full Nani Systems Client Portal.
            </p>
          </div>
          <div className="pt-4 flex gap-4">
            <Link href="/quote" className="flex-1">
              <Button className="w-full">Request Quote</Button>
            </Link>
            <Link href="/services" className="flex-1">
              <Button variant="secondary" className="w-full">View Services</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
