"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { sendPortalInviteAction } from "./actions";

export function ClientPortalInvite({ clientId, hasPassword, portalToken }: { clientId: string, hasPassword: boolean, portalToken: string | null }) {
  const actionWithId = sendPortalInviteAction.bind(null, clientId);
  const [error, formAction, isPending] = useActionState(actionWithId, null);

  if (hasPassword) {
    return <div className="text-sm text-green-500 font-medium">Portal Active</div>;
  }

  return (
    <div className="inline-flex flex-col items-end gap-2 ml-4">
      <form action={formAction}>
        <Button variant="outline" size="sm" disabled={isPending}>
          {isPending ? "Generating..." : (portalToken ? "Regenerate Invite" : "Generate Portal Invite")}
        </Button>
        {error && <span className="text-xs text-destructive ml-2">{error}</span>}
      </form>
      {portalToken && (
        <div className="text-xs text-muted-foreground text-right mt-1">
          Activation Link:<br />
          <input 
            type="text" 
            readOnly 
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/portal/activate/${portalToken}`}
            className="mt-1 w-64 px-2 py-1 bg-secondary/20 border border-border/50 rounded text-[10px]"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>
      )}
    </div>
  );
}
