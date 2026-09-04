"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 bg-card border border-border/50 rounded-2xl shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Nani Systems Admin</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage leads and requests.</p>
        </div>
        
        <form action={formAction} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Admin Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
