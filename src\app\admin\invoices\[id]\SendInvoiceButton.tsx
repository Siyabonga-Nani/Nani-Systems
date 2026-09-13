"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sendInvoiceToClientAction } from "./actions";

export default function SendInvoiceButton({ invoiceId, disabled }: { invoiceId: string, disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setLoading(true);
    const res = await sendInvoiceToClientAction(invoiceId);
    if (res.success) {
      setSent(true);
    } else {
      alert("Failed to send invoice.");
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
