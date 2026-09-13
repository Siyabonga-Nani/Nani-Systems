"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialState = { success: false, message: "" };

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  // We intercept the submission to format complex fields into the "message" field 
  // so we don't have to alter the Prisma database schema unnecessarily.
  const handleSubmit = (formData: FormData) => {
    const projectType = formData.get("projectType") as string;
    const budget = formData.get("budget") as string;
    const timeline = formData.get("timeline") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;

    const formattedMessage = `Project Type: ${projectType}\nBudget Range: ${budget || "Not provided"}\nTimeline: ${timeline || "Not provided"}\nExisting URL/Repo: ${url || "None"}\n\nDescription:\n${description}`;


    formData.set("message", formattedMessage);
    
    // Pass to server action
    formAction(formData);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-24 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Start a Project</h1>
      <p className="text-xl text-muted-foreground mb-10">
        Tell us where you want your business to go, and we'll help architect the solution.
      </p>

      {state.success ? (
        <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-center">
          <p className="text-xl font-semibold mb-2">Thank you.</p>
          <p className="text-green-500/80">{state.message}</p>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-8 bg-card p-8 border border-border/50 rounded-3xl">
          {state.message && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {state.message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required placeholder="Jane Doe" className="bg-secondary/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" className="bg-secondary/20" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+27..." className="bg-secondary/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company / Business</Label>
              <Input id="company" name="company" placeholder="Acme Inc" className="bg-secondary/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reason">Enquiry Type *</Label>
              <Select name="reason" required defaultValue="New Project">
                <SelectTrigger className="bg-secondary/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Project">New Project</SelectItem>
                  <SelectItem value="Existing Project / Takeover">Existing Project / Takeover</SelectItem>
                  <SelectItem value="Maintenance / Hosting">Maintenance & Hosting</SelectItem>
                  <SelectItem value="General Enquiry">General Enquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Required Services *</Label>
              <Select name="projectType" required defaultValue="Website Development">
                <SelectTrigger className="bg-secondary/20">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website Development">Website Development</SelectItem>
                  <SelectItem value="Web Application">Web Application</SelectItem>
                  <SelectItem value="Mobile App">Mobile Application</SelectItem>
                  <SelectItem value="Business Software">Business Software / API</SelectItem>
                  <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                  <SelectItem value="Other">Other / Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select name="budget" defaultValue="TBD">
                <SelectTrigger className="bg-secondary/20">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="< R25,000">Under R25,000 (MVP / Foundation)</SelectItem>
                  <SelectItem value="R25,000 - R50,000">R25,000 - R50,000</SelectItem>
                  <SelectItem value="R50,000 - R150,000">R50,000 - R150,000</SelectItem>
                  <SelectItem value="R150,000+">R150,000+</SelectItem>
                  <SelectItem value="TBD">To Be Determined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Select name="timeline" defaultValue="Flexible">
                <SelectTrigger className="bg-secondary/20">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASAP">ASAP</SelectItem>
                  <SelectItem value="1-3 Months">1-3 Months</SelectItem>
                  <SelectItem value="3-6 Months">3-6 Months</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Existing URL or Repository (Optional)</Label>
            <Input id="url" name="url" placeholder="https://..." className="bg-secondary/20" />
            <p className="text-xs text-muted-foreground mt-1">
              * Never submit passwords, private keys, or sensitive credentials.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea id="description" name="description" required placeholder="Tell us what you want to achieve..." className="min-h-[150px] bg-secondary/20" />
          </div>

          <Button type="submit" size="lg" className="w-full font-semibold" disabled={pending}>
            {pending ? "Submitting..." : "Submit Project Request"}
          </Button>
        </form>
      )}
    </div>
  );
}
