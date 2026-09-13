/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createQuoteAction } from "./actions";

export default function QuoteForm({ leads, defaultLeadId, defaultRequestId }: { leads: Record<string, any>[], defaultLeadId?: string, defaultRequestId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState(defaultLeadId || "");
  const [taxRate, setTaxRate] = useState(0); 
  const [items, setItems] = useState([{ description: "", quantity: 1, unitPrice: 0 }]);
  const [formError, setFormError] = useState("");

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as Record<string, any>)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) {
      setFormError("Please select a lead.");
      return;
    }
    setFormError("");
    setLoading(true);
    
    try {
      const res = await createQuoteAction({
        leadId,
        requestId: defaultRequestId,
        lineItems: items,
        subtotal,
        taxAmount,
        total,
      });
      if (res.success) {
        router.push(`/admin/quotes/${res.id}`);
      } else {
        setFormError(res.message || "Unknown error");
      }
    } catch {
      setFormError("Error creating quote");
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
          <Label>Select Client / Lead</Label>
          <Select value={leadId} onValueChange={(v) => setLeadId(v || "")} required disabled={!!defaultLeadId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a lead..." />
            </SelectTrigger>
            <SelectContent>
              {leads.map(l => (
                <SelectItem key={l.id} value={l.id}>{l.name} ({l.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {defaultRequestId && (
            <p className="text-xs text-muted-foreground mt-1">This quotation will be linked to the incoming quote request.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tax Handling</Label>
          <Select value={taxRate.toString()} onValueChange={(v) => setTaxRate(parseFloat(v || "0"))}>
            <SelectTrigger>
              <SelectValue placeholder="Select tax rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Tax</SelectItem>
              <SelectItem value="0.15">15% VAT (South Africa)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Line Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>Add Item</Button>
        </div>
        
        {items.map((item, index) => (
          <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-secondary/10 p-4 rounded-lg border border-border/50">
            <div className="flex-1 space-y-2 w-full md:w-auto">
              <Label>Description</Label>
              <Input required value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} placeholder="e.g. Website Development" />
            </div>
            <div className="w-full md:w-24 space-y-2">
              <Label>Qty</Label>
              <Input type="number" required min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))} />
            </div>
            <div className="w-full md:w-32 space-y-2">
              <Label>Unit Price</Label>
              <Input type="number" required min="0" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value))} />
            </div>
            <Button type="button" variant="destructive" onClick={() => removeItem(index)} className="w-full md:w-auto">X</Button>
          </div>
        ))}
      </div>

      <div className="border-t border-border/50 pt-6 space-y-2 text-right">
        <p className="text-muted-foreground">Subtotal: ZAR {subtotal.toLocaleString()}</p>
        <p className="text-muted-foreground">Tax: ZAR {taxAmount.toLocaleString()}</p>
        <p className="text-2xl font-bold">Total: ZAR {total.toLocaleString()}</p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Generate Quote"}
      </Button>
    </form>
  );
}