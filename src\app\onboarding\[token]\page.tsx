import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export const metadata = {
  title: "Project Onboarding | Nani Systems",
  robots: "noindex, nofollow"
};

export default async function ClientOnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  const ob = await db.projectOnboarding.findUnique({
    where: { token },
    include: { client: { include: { lead: true } } }
  });

  if (!ob) notFound();

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Project Onboarding</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Welcome to Nani Systems, {ob.client.lead.name}. Please complete this project questionnaire so we can accurately begin engineering and designing your solution.
          </p>
        </div>

        {ob.status === "SUBMITTED" ? (
          <div className="bg-card p-12 text-center rounded-2xl border border-border/50 shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-green-500">Requirements Received!</h2>
            <p className="text-muted-foreground">Thank you for submitting your project onboarding details. Our team will review the information and contact you shortly with the next steps.</p>
          </div>
        ) : (
          <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-lg">
            <OnboardingForm token={ob.token} />
          </div>
        )}

      </div>
    </div>
  );
}