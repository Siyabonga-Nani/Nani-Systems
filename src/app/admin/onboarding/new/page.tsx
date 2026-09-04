import { db } from "@/lib/db";
import OnboardingGeneratorForm from "./OnboardingGeneratorForm";

export default async function NewOnboardingPage() {
  const clients = await db.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true, onboardings: true }
  });

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Generate Onboarding Link</h2>
        <p className="text-muted-foreground">Create a secure link for a client to submit their project assets.</p>
      </div>
      
      <OnboardingGeneratorForm clients={clients} />
    </div>
  );
}