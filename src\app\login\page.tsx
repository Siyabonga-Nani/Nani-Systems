"use client";

import { useActionState, useEffect } from "react";
import { unifiedLoginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(unifiedLoginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <div className="container max-w-md mx-auto py-24 px-4">
      <div className="space-y-6 bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
          <p className="text-muted-foreground text-sm">Welcome back to Nani Systems.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          {state?.error && <p className="text-sm text-destructive font-medium">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={isPending || !!state?.redirect}>
            {isPending || state?.redirect ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
