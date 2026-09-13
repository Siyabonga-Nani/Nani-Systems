"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { submitQuote } from "@/app/actions";

interface ServiceData {
  slug: string;
  title: string;
  price: string;
}

export default function ServiceConfigurator({ service }: { service: ServiceData }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Generic form state
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "", company: "" });
  
  const handleToggleMultiple = (key: string, value: string) => {
    setSelections(prev => {
      const current = (prev[key] as string[]) || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleSelectOne = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  // Configuration options based on service
  const renderConfiguration = () => {
    if (service.slug === "website-development" || service.slug === "web-applications" || service.slug === "e-commerce" || service.slug === "business-software") {
      return (
        <div className="space-y-8">
          <div>
            <Label className="text-base mb-3 block">What type of project is this?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Business website", "Landing page", "E-commerce", "SaaS Application", "Internal Tool", "Not sure"].map(opt => (
                <div 
                  key={opt}
                  onClick={() => handleSelectOne("type", opt)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selections.type === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-base mb-3 block">Required Functionality (Select all that apply)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {["Contact forms", "User accounts", "Payments", "Database", "Admin dashboard", "API integrations", "File uploads", "Other"].map(opt => {
                const isSelected = (selections.features as string[] || []).includes(opt);
                return (
                  <div 
                    key={opt}
                    onClick={() => handleToggleMultiple("features", opt)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <Label className="text-base mb-2 block">Technical Preferences</Label>
            <p className="text-sm text-muted-foreground mb-3">If you have specific technology requirements, let us know.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["I don't know — recommend the best solution", "React / Next.js", "Node.js / Express", "Custom Requirements"].map(opt => (
                <div 
                  key={opt}
                  onClick={() => handleSelectOne("tech", opt)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selections.tech === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (service.slug === "mobile-applications") {
      return (
        <div className="space-y-8">
          <div>
            <Label className="text-base mb-3 block">Target Platforms</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Cross-platform (iOS & Android)", "iOS only", "Android only", "Not sure"].map(opt => (
                <div 
                  key={opt}
                  onClick={() => handleSelectOne("platform", opt)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selections.platform === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-base mb-3 block">App Features (Select all that apply)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {["User Authentication", "Push Notifications", "In-App Payments", "Camera / Media", "Location / GPS", "Backend API needed", "Offline support", "Other"].map(opt => {
                const isSelected = (selections.features as string[] || []).includes(opt);
                return (
                  <div 
                    key={opt}
                    onClick={() => handleToggleMultiple("features", opt)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (service.slug === "bug-fixing" || service.slug === "migration") {
      return (
        <div className="space-y-8">
          <div>
            <Label className="text-base mb-3 block">What is the current state?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Existing application failing", "Need new feature on existing app", "Migrating from old system", "Building from scratch", "Performance issues", "Other"].map(opt => (
                <div 
                  key={opt}
                  onClick={() => handleSelectOne("state", opt)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selections.state === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-base block mb-2">Describe the current system or problem</Label>
            <Textarea 
              placeholder="What do you currently have and what is wrong?"
              className="min-h-[120px]"
              value={(selections.problem as string) || ""}
              onChange={e => handleSelectOne("problem", e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (service.slug === "managed-hosting" || service.slug === "maintenance-support") {
      return (
        <div className="space-y-8">
          <div>
            <Label className="text-base mb-3 block">What requires management/maintenance?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Website hosting", "Web application", "API hosting", "Database hosting", "Security & Updates", "Ongoing technical support"].map(opt => {
                const isSelected = (selections.needs as string[] || []).includes(opt);
                return (
                  <div 
                    key={opt}
                    onClick={() => handleToggleMultiple("needs", opt)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Default generic configuration
    return (
      <div className="space-y-8">
        <div>
          <Label className="text-base mb-3 block">What is your primary goal?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Build something new", "Improve existing system", "Manage infrastructure", "Consultation", "Not sure"].map(opt => (
              <div 
                key={opt}
                onClick={() => handleSelectOne("goal", opt)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selections.goal === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(1, s - 1));
  };

  const compileRequirements = () => {
    let reqs = "";
    Object.entries(selections).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        reqs += `\n**${key.toUpperCase()}**:\n- ${value.join("\n- ")}\n`;
      } else {
        reqs += `\n**${key.toUpperCase()}**: ${value}\n`;
      }
    });
    return reqs.trim() || "No specific configuration provided.";
  };

  const onSubmit = async () => {
    setLoading(true);
    setError("");

    if (!contact.name || !contact.email) {
      setError("Please provide at least your name and email.");
      setLoading(false);
      return;
    }

    const compiledRequirements = compileRequirements();

    const formData = new FormData();
    formData.append("serviceId", service.title);
    formData.append("projectType", "Service Request");
    formData.append("requirements", compiledRequirements);
    formData.append("name", contact.name);
    formData.append("email", contact.email);
    formData.append("phone", contact.phone);
    formData.append("company", contact.company);

    const result = await submitQuote(null, formData);

    if (result?.success) {
      setSuccess(true);
    } else {
      setError(result?.message || "Failed to submit. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-card border border-primary/30 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Request Submitted Successfully</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for configuring your {service.title} request. We have received your requirements and will be in touch shortly with next steps and a formal quotation.
        </p>
        <Button onClick={() => window.location.href = "/services"} variant="outline">
          Return to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto shadow-sm">
      
      {/* Progress */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>1</div>
          <span className={`font-medium hidden sm:inline ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Configure</span>
        </div>
        <div className="flex-1 h-1 mx-4 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: step >= 2 ? '100%' : '50%' }} />
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>2</div>
          <span className={`font-medium hidden sm:inline ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Details</span>
        </div>
        <div className="flex-1 h-1 mx-4 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: step >= 3 ? '100%' : '0%' }} />
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>3</div>
          <span className={`font-medium hidden sm:inline ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Review</span>
        </div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold mb-6">Configure your requirements</h2>
          {renderConfiguration()}
          
          <div className="mt-8 pt-8 border-t border-border/50">
            <Label className="text-base block mb-2">Additional Context (Optional)</Label>
            <Textarea 
              placeholder="Any other specific details, links, or requirements we should know about?"
              value={(selections.additional as string) || ""}
              onChange={e => handleSelectOne("additional", e.target.value)}
            />
          </div>

          <div className="mt-10 flex justify-end">
            <Button size="lg" onClick={handleNext} className="gap-2">
              Continue to Details <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold mb-6">Your Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input 
                value={contact.name}
                onChange={e => setContact({...contact, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address *</Label>
              <Input 
                type="email"
                value={contact.email}
                onChange={e => setContact({...contact, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                value={contact.phone}
                onChange={e => setContact({...contact, phone: e.target.value})}
                placeholder="+27..."
              />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input 
                value={contact.company}
                onChange={e => setContact({...contact, company: e.target.value})}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <Button variant="outline" size="lg" onClick={handleBack} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button size="lg" onClick={handleNext} disabled={!contact.name || !contact.email} className="gap-2">
              Review Request <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold mb-6">Review Your Request</h2>
          
          <div className="bg-secondary/10 rounded-xl p-6 border border-border/50 mb-8 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Service</p>
              <p className="text-lg font-medium">{service.title}</p>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Selected Requirements</p>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-background/50 p-4 rounded-lg border border-border/30">
                {compileRequirements()}
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-right flex flex-col justify-center">
                <p className="text-xs text-primary uppercase tracking-wider font-bold mb-1">Starting Price</p>
                <p className="text-lg font-bold">{service.price}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mt-10 flex justify-between">
            <Button variant="outline" size="lg" onClick={handleBack} disabled={loading} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button size="lg" onClick={onSubmit} disabled={loading} className="gap-2 px-8">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Submit Request
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
