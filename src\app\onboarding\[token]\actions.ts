"use server";

import { db } from "@/lib/db";
import { notifyAdminSystemEvent } from "@/lib/notifications";
import { z } from "zod";

const OnboardingSchema = z.object({
  businessContext: z.string().min(5, "Business context must be at least 5 characters").max(5000),
  projectObjectives: z.string().min(5, "Project objectives are required").max(5000),
  servicesRequired: z.string().min(5, "Services required must be specified").max(5000),
  targetAudience: z.string().max(2000).optional(),
  brandGuidelines: z.string().max(1000).optional(),
  existingDomain: z.string().max(500).optional(),
  competitors: z.string().max(2000).optional(),
  designDirection: z.string().max(2000).optional(),
  contentReadiness: z.string().max(2000).optional(),
  importantIntegrations: z.string().max(2000).optional(),
  technicalRequirements: z.string().max(2000).optional(),
  additionalNotes: z.string().max(5000).optional(),
  resourceLinks: z.string().max(2000).optional(),
});

export async function submitOnboardingAction(token: string, formData: FormData) {
  try {
    const ob = await db.projectOnboarding.findUnique({
      where: { token },
      include: { client: { include: { lead: true } } }
    });

    if (!ob) {
      return { success: false, message: "Invalid or expired onboarding session." };
    }

    if (ob.status === "SUBMITTED") {
      return { success: false, message: "This onboarding form has already been submitted." };
    }

    const rawData = {
      businessContext: formData.get("businessContext") as string,
      projectObjectives: formData.get("projectObjectives") as string,
      servicesRequired: formData.get("servicesRequired") as string,
      targetAudience: formData.get("targetAudience") as string,
      brandGuidelines: formData.get("brandGuidelines") as string,
      existingDomain: formData.get("existingDomain") as string,
      competitors: formData.get("competitors") as string,
      designDirection: formData.get("designDirection") as string,
      contentReadiness: formData.get("contentReadiness") as string,
      importantIntegrations: formData.get("importantIntegrations") as string,
      technicalRequirements: formData.get("technicalRequirements") as string,
      additionalNotes: formData.get("additionalNotes") as string,
      resourceLinks: formData.get("resourceLinks") as string,
    };

    const validatedData = OnboardingSchema.parse(rawData);

    await db.projectOnboarding.update({
      where: { token },
      data: {
        ...validatedData,
        status: "SUBMITTED"
      }
    });

    await notifyAdminSystemEvent(
      "Project Onboarding Submitted", 
      `Client ${ob.client.lead.name} has submitted their onboarding requirements.`
    );

    return { success: true };
  } catch (error) {
    console.error("Onboarding Submission Error:", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).errors) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { success: false, message: (error as any).errors[0].message };
    }
    return { success: false, message: "An error occurred while saving your onboarding details." };
  }
}