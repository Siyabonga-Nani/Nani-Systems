"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { acceptQuoteAction } from "./actions";

export default function AcceptQuoteButton({ quoteId }: { quoteId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    if (!confirm("Are you sure you want to accept this quotation?")) return;
    setLoading(true);
    const res = await acceptQuoteAction(quoteId);
    if (res.success) {
      alert("Quote accepted successfully! We will prepare your contract.");
      router.refresh();
    } else {
      alert("Error accepting quote.");
      setLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleAccept} disabled={loading} className="w-full sm:w-auto px-12">
      {loading ? "Processing..." : "Accept Quotation"}
    </Button>
  );
}