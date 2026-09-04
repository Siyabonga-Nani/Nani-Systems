"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold tracking-tighter text-destructive/20">500</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-2">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <button 
        onClick={() => reset()}
        className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-11 px-8 font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}