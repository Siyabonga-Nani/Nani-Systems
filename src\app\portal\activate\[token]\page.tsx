import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ClientActivationForm } from "./ClientActivationForm";

export default async function ActivatePortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const client = await db.client.findUnique({
    where: { portalToken: token },
    include: { lead: true }
  });

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md p-8 space-y-4 text-center bg-card rounded-2xl border border-border/50">
          <h1 className="text-2xl font-bold tracking-tight text-destructive">Invalid Link</h1>
          <p className="text-muted-foreground">This activation link is invalid or has already been used.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl border border-border/50">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Activate Portal</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {client.lead.name}. Create a password to access your secure client portal.</p>
        </div>

        <ClientActivationForm token={token} />
      </div>
    </div>
  );
}
