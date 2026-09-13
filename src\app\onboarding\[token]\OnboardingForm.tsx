"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { submitOnboardingAction } from "./actions";

export default function OnboardingForm({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await submitOnboardingAction(token, formData);
    
    if (res.success) {
      router.refresh();
    } else {
      setError(res.message || "An unknown error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-b border-border/50 pb-2">1. Business Context</h3>
        
        <div className="space-y-2">
          <Label>What is the primary objective of this project?</Label>
          <Textarea name="projectObjectives" required placeholder="Describe the main goal you want to achieve..." className="min-h-[100px]" />
        </div>
        
        <div className="space-y-2">
          <Label>Describe your business and target audience.</Label>
          <Textarea name="businessContext" required placeholder="Who are your customers? What problem do you solve?" className="min-h-[100px]" />
        </div>

        <div className="space-y-2">
          <Label>Who are your main competitors or reference websites you like?</Label>
          <Textarea name="competitors" placeholder="Provide URLs and what you like about them..." />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-b border-border/50 pb-2">2. Branding & Content</h3>
        
        <div className="space-y-2">
          <Label>Do you have an existing domain name?</Label>
          <Input name="existingDomain" placeholder="e.g. nanisystems.com (or specify if you need one)" />
        </div>

        <div className="space-y-2">
          <Label>Brand Guidelines / Logo Assets Link (Google Drive / Dropbox)</Label>
          <Input type="url" name="brandGuidelines" placeholder="https://drive.google.com/..." />
          <p className="text-xs text-muted-foreground">Please ensure link sharing is set to &quot;Anyone with the link&quot;.</p>
        </div>

        <div className="space-y-2">
          <Label>Additional Resource Links</Label>
          <Input type="url" name="resourceLinks" placeholder="Links to copy, images, or previous designs..." />
        </div>

        <div className="space-y-2">
          <Label>What is your preferred design direction?</Label>
          <Textarea name="designDirection" placeholder="Minimalist, bold, corporate, playful..." />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-b border-border/50 pb-2">3. Technical Requirements</h3>
        
        <div className="space-y-2">
          <Label>List any specific features required (e.g. Contact Form, Booking System, E-Commerce)</Label>
          <Textarea name="servicesRequired" required placeholder="Describe specific functionality you need..." />
        </div>

        <div className="space-y-2">
          <Label>Are there any third-party integrations needed?</Label>
          <Textarea name="importantIntegrations" placeholder="Mailchimp, HubSpot, Salesforce, etc..." />
        </div>

        <div className="space-y-2">
          <Label>Additional Technical Notes</Label>
          <Textarea name="technicalRequirements" placeholder="Any specific hosting, performance, or security requirements..." />
        </div>
      </div>

      <div className="pt-6 border-t border-border/50">
        <Button type="submit" size="lg" className="w-full text-lg h-12" disabled={loading}>
          {loading ? "Submitting..." : "Submit Project Requirements"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          By submitting, you confirm that the provided information is accurate and ready for development.
        </p>
      </div>
    </form>
  );
}