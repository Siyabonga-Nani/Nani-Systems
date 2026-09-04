"use client";

import { useActionState } from "react";
import { submitConsultation } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialState = { success: false, message: "" };

export default function ConsultationPage() {
  const [state, formAction, pending] = useActionState(submitConsultation, initialState);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-24 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">Book a Consultation</h1>
      <p className="text-muted-foreground mb-8">
        Request a call or meeting with our engineering team to discuss your requirements.
      </p>

      {state.success ? (
        <div className="p-8 bg-card border border-border/50 rounded-xl text-center">
          <h2 className="text-2xl font-semibold mb-2">Request Received</h2>
          <p className="text-muted-foreground">{state.message}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {state.message && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {state.message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+27 00 000 0000" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Preference *</Label>
              <Select name="meetingType" required defaultValue="google_meet">
                <SelectTrigger>
                  <SelectValue placeholder="How should we meet?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">Video Call (Google Meet)</SelectItem>
                  <SelectItem value="zoom">Video Call (Zoom)</SelectItem>
                  <SelectItem value="phone_call">Phone Call</SelectItem>
                  <SelectItem value="in_person">In-Person (If applicable)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedDate">Preferred Date / Time</Label>
              <Input id="requestedDate" name="requestedDate" placeholder="e.g. Next Tuesday morning" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Meeting Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="Briefly describe what you'd like to discuss..." className="min-h-[100px]" />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Submitting Request..." : "Request Consultation"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            In the future, this form will connect directly to our live availability calendar.
          </p>
        </form>
      )}
    </div>
  );
}