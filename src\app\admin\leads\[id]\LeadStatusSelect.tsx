"use client";

import { useState } from "react";
import { updateLeadStatus } from "./actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function LeadStatusSelect({ leadId, initialStatus }: { leadId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setLoading(true);
    try {
      await updateLeadStatus(leadId, newStatus);
      setStatus(newStatus);
    } catch (e) {
      console.error(e);
      setStatus(status); // revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NEW">NEW</SelectItem>
          <SelectItem value="CONTACTED">CONTACTED</SelectItem>
          <SelectItem value="QUALIFIED">QUALIFIED</SelectItem>
          <SelectItem value="LOST">LOST</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
