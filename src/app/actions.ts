/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { notifyAdminNewLead } from "@/lib/notifications";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
  message: z.string().min(10, "Please provide more details"),
});

export async function submitContact(prevState: { success: boolean; message: string } | null, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      reason: formData.get("reason") as string,
      message: formData.get("message") as string,
    };

    const validatedData = ContactSchema.parse(rawData);

    const lead = await db.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        source: "Contact Form",
      }
    });

    await db.contactMessage.create({
      data: {
        leadId: lead.id,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        reason: validatedData.reason,
        message: validatedData.message,
      }
    });

    await notifyAdminNewLead(validatedData.name, "Contact Form");

    return { success: true, message: "Thank you. Your message has been received. Nani Systems will get back to you." };
  } catch (error) {
    console.error("Contact Submission Error:", error);
    if ((error as any).errors) {
      return { success: false, message: (error as any).errors[0].message };
    }
    return { success: false, message: "Something went wrong while submitting your request. Please try again." };
  }
}

const QuoteSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  projectType: z.string().min(1, "Project type is required"),
  requirements: z.string().min(10, "Please describe your requirements"),
  desiredTimeline: z.string().optional(),
  budgetRange: z.string().optional(),
  additionalInformation: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export async function submitQuote(prevState: { success: boolean; message: string } | null, formData: FormData) {
  try {
    const rawData = {
      serviceId: formData.get("serviceId") as string,
      projectType: formData.get("projectType") as string,
      requirements: formData.get("requirements") as string,
      desiredTimeline: formData.get("desiredTimeline") as string,
      budgetRange: formData.get("budgetRange") as string,
      additionalInformation: formData.get("additionalInformation") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
    };

    const validatedData = QuoteSchema.parse(rawData);

    const lead = await db.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        source: "Quote Form",
      }
    });

    await db.quoteRequest.create({
      data: {
        leadId: lead.id,
        serviceId: validatedData.serviceId,
        projectType: validatedData.projectType,
        requirements: validatedData.requirements,
        desiredTimeline: validatedData.desiredTimeline,
        budgetRange: validatedData.budgetRange,
        additionalInformation: validatedData.additionalInformation,
      }
    });

    await notifyAdminNewLead(validatedData.name, "Quote Form");
    
    return { success: true, message: "Your quote request has been successfully submitted. We will review your requirements and respond shortly." };
  } catch (error) {
    console.error("Quote Submission Error:", error);
    if ((error as any).errors) {
      return { success: false, message: (error as any).errors[0].message };
    }
    return { success: false, message: "Something went wrong while submitting your request. Please try again." };
  }
}



const ConsultSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  meetingType: z.string().min(1, "Meeting type is required"),
  requestedDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function submitConsultation(prevState: { success: boolean; message: string } | null, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      meetingType: formData.get("meetingType") as string,
      requestedDate: formData.get("requestedDate") as string,
      notes: formData.get("notes") as string,
    };

    const validatedData = ConsultSchema.parse(rawData);

    const lead = await db.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        source: "Consultation Form",
      }
    });

    await db.consultation.create({
      data: {
        leadId: lead.id,
        meetingType: validatedData.meetingType,
        requestedDate: validatedData.requestedDate,
        notes: validatedData.notes,
      }
    });

    await notifyAdminNewLead(validatedData.name, "Consultation Form");
    
    return { success: true, message: "Your consultation request has been received. We will contact you shortly to confirm the time." };
  } catch (error) {
    if ((error as any).errors) {
      return { success: false, message: (error as any).errors[0].message };
    }
    return { success: false, message: "Something went wrong while submitting your request." };
  }
}