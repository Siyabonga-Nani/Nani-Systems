"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sendOnboardingToClientAction } from "./actions";

export default function SendOnboardingButton({ onboardingId, disabled }: { onboardingId: string, disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setLoading(true);
    const res = await sendOnboardingToClientAction(onboardingId);
    if (res.success) {
      setSent(true);
    } else {
      alert("Failed to send onboarding link.");
    }
    setLoading(false);
  }

  if (sent) return <Button disabled size="sm">Sent!</Button>;

  return (
    <Button onClick={handleSend} disabled={disabled || loading} size="sm">
      {loading ? "Sending..." : "Send to Client"}
    </Button>
  );
}
