/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOnboardingAction } from "./actions";

export default function OnboardingGeneratorForm({ clients }: { clients: Record<string, any>[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setFormError("Please select a client.");
      return;
    }
    setFormError("");
    setLoading(true);
    
    try {
      const selectedClient = clients.find(c => c.id === clientId);
      const contractId = undefined;

      const res = await createOnboardingAction({
        clientId,
        contractId,
      });
      if (res.success) {
        router.push(`/admin/onboarding/${res.id}`);
      } else {
        setFormError(res.message || "Unknown error");
      }
    } catch {
      setFormError("Error creating onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 border border-border/50 rounded-xl shadow-sm">
      {formError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium">
          {formError}
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select Client</Label>
          <Select value={clientId} onValueChange={(v) => setClientId(v || "")} required>
            <SelectTrigger>
              <SelectValue placeholder="Choose a client..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.lead.name} ({c.lead.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Generating..." : "Generate Link"}
      </Button>
    </form>
  );
}