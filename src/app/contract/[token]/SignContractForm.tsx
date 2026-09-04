"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signContractAction } from "./actions";

export default function SignContractForm({ contractId, expectedName }: { contractId: string, expectedName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const signatureName = formData.get("signatureName") as string;
    
    if (signatureName.toLowerCase().trim() !== expectedName.toLowerCase().trim()) {
      if (!confirm(`The typed name "${signatureName}" does not exactly match the expected name "${expectedName}". Proceed anyway?`)) {
        return;
      }
    }

    setLoading(true);
    const res = await signContractAction(contractId, formData);
    if (res.success) {
      alert("Contract successfully signed!");
      router.refresh();
    } else {
      alert("Error signing contract.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSign} className="space-y-4 max-w-sm mx-auto">
      <div className="space-y-2">
        <Label>Type your full name to electronically sign</Label>
        <Input required name="signatureName" placeholder={expectedName} />
      </div>
      <div className="space-y-2">
        <Label>Email address for audit</Label>
        <Input required name="signatureEmail" type="email" placeholder="email@example.com" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing..." : "Sign Agreement"}
      </Button>
      <p className="text-[10px] text-muted-foreground text-center">
        By clicking &quot;Sign Agreement&quot;, you consent to this electronic signature being a legally binding record. Your IP address and timestamp will be recorded.
      </p>
    </form>
  );
}