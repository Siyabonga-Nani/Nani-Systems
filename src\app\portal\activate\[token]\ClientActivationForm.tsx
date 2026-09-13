"use client";

import { useActionState } from "react";
import { activatePortalAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClientActivationForm({ token }: { token: string }) {
  const actionWithToken = activatePortalAction.bind(null, token);
  const [error, formAction, isPending] = useActionState(actionWithToken, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Create Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Activating..." : "Activate Account"}
      </Button>
    </form>
  );
}
