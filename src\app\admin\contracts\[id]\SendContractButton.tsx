"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sendContractToClientAction } from "./actions";

export default function SendContractButton({ contractId, disabled }: { contractId: string, disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setLoading(true);
    const res = await sendContractToClientAction(contractId);
    if (res.success) {
      setSent(true);
    } else {
      alert("Failed to send contract.");
    }
    setLoading(false);
  }

  if (sent) return <Button disabled>Sent!</Button>;

  return (
    <Button onClick={handleSend} disabled={disabled || loading}>
      {loading ? "Sending..." : "Send to Client"}
    </Button>
  );
}
