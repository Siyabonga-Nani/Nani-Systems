"use client";

import { useActionState, useState } from "react";
import { submitQuote } from "@/app/actions";
import { services } from "@/config/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";

const initialState = { success: false, message: "" };

export default function QuotePage() {
  const [state, formAction, pending] = useActionState(submitQuote, initialState);
  const [step, setStep] = useState(1);
  const availableServices = services.filter((s) => s.status !== "COMING_SOON");

  // Keep track of form data across steps using state so we can show a summary
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    serviceId: "",
    projectType: "new",
    requirements: "",
    desiredTimeline: "",
    budgetRange: "",
    additionalInformation: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  if (state.success) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
        <div className="p-8 bg-card border border-border/50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Request Received</h2>
          <p className="text-muted-foreground text-lg">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Request a Quotation</h1>
        <p className="text-muted-foreground">
          Step {step} of 4 &mdash; Let&apos;s map out your requirements.
        </p>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary mt-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form action={formAction} className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
        {state.message && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {state.message}
          </div>
        )}

        {/* Step 1: Service Selection */}
        <div className={step === 1 ? "block" : "hidden"}>
          <h2 className="text-2xl font-semibold mb-6">What do you need?</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="serviceId">Primary Service *</Label>
              <Select name="serviceId" required onValueChange={(v) => handleSelectChange("serviceId", v || "")} value={formData.serviceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service category" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                  ))}
                  <SelectItem value="existing_maintenance">Website Maintenance / Bug Fixing</SelectItem>
                  <SelectItem value="existing_migration">Migration / Hosting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select name="projectType" required onValueChange={(v) => handleSelectChange("projectType", v || "")} value={formData.projectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Is this a new project?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Brand New Project</SelectItem>
                  <SelectItem value="existing">Expansion of Existing Project</SelectItem>
                  <SelectItem value="fix">Fixing / Maintaining Existing Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Step 2: Project Information */}
        <div className={step === 2 ? "block" : "hidden"}>
          <h2 className="text-2xl font-semibold mb-6">Project Details</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="requirements">Core Requirements *</Label>
              <Textarea 
                name="requirements" 
                required={step === 2} 
                className="min-h-[120px]" 
                placeholder="Briefly describe what you are trying to build or solve..."
                value={formData.requirements}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desiredTimeline">Timeline</Label>
                <Select name="desiredTimeline" onValueChange={(v) => handleSelectChange("desiredTimeline", v || "")} value={formData.desiredTimeline}>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you need this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">ASAP (Urgent)</SelectItem>
                    <SelectItem value="1_month">Within 1 month</SelectItem>
                    <SelectItem value="3_months">1-3 months</SelectItem>
                    <SelectItem value="flexible">Flexible / Planning phase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget Range</Label>
                <Select name="budgetRange" onValueChange={(v) => handleSelectChange("budgetRange", v || "")} value={formData.budgetRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approximate budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_10k">Under R10,000</SelectItem>
                    <SelectItem value="10k_30k">R10,000 - R30,000</SelectItem>
                    <SelectItem value="30k_100k">R30,000 - R100,000</SelectItem>
                    <SelectItem value="over_100k">Over R100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInformation">Additional Info (Optional)</Label>
              <Input name="additionalInformation" placeholder="Links to references, current website, etc." value={formData.additionalInformation} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Step 3: Contact Information */}
        <div className={step === 3 ? "block" : "hidden"}>
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input name="name" required={step === 3} placeholder="Jane Doe" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input name="email" type="email" required={step === 3} placeholder="jane@example.com" value={formData.email} onChange={handleChange} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input name="phone" type="tel" placeholder="+27 00 000 0000" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company / Business Name</Label>
                <Input name="company" placeholder="Acme Inc." value={formData.company} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Review & Submit */}
        <div className={step === 4 ? "block" : "hidden"}>
          <h2 className="text-2xl font-semibold mb-6">Review & Submit</h2>
          
          <div className="space-y-6 bg-secondary/20 p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Service</p>
                <p className="font-medium">{availableServices.find(s => s.id === formData.serviceId)?.title || formData.serviceId || "Not selected"}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Contact</p>
                <p className="font-medium">{formData.name} ({formData.email})</p>
              </div>
              <div className="sm:col-span-2 mt-2">
                <p className="text-muted-foreground mb-1">Requirements Preview</p>
                <p className="font-medium line-clamp-3">{formData.requirements || "None provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10 pt-6 border-t border-border/50 relative">
          {formError && <p className="text-destructive text-sm font-medium absolute -top-8 left-0">{formError}</p>}
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handlePrev}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <Button type="button" onClick={() => {
              // Basic validation before moving next
              if (step === 1 && !formData.serviceId) return setFormError("Please select a service");
              if (step === 2 && formData.requirements.length < 5) return setFormError("Please provide some requirements");
              if (step === 3 && (!formData.name || !formData.email)) return setFormError("Name and Email are required");
              setFormError(""); handleNext();
            }}>
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting..." : "Request My Quote"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
