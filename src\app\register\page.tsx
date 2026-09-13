"use client";

import { useActionState, useEffect } from "react";
import { registerAccountAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAccountAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="space-y-6 bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join Nani Systems to manage your quotes and projects.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name or Company</Label>
            <Input id="name" name="name" required placeholder="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>

          {state?.error && <p className="text-sm text-destructive font-medium">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={isPending || !!state?.redirect}>
            {isPending || state?.redirect ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
