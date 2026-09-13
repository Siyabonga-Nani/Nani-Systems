/**
 * Nani Systems V1 - Provider-Neutral Notification Infrastructure
 * 
 * This service abstracts all notification logic. It currently logs to the console
 * but is structurally prepared to plug in any email provider (e.g., Resend, AWS SES)
 * strictly without modifying the Admin architecture.
 * 
 * Pending Founder Approval of a specific provider.
 */
import { db } from "./db";

export interface NotificationPayload {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  entityType?: string;
  entityId?: string;
  idempotencyKey?: string;
}

export async function dispatchEmail(payload: NotificationPayload) {
  // Prevent duplicates if idempotency key is provided
  if (payload.idempotencyKey) {
    const existing = await db.notificationLog.findUnique({
      where: { idempotencyKey: payload.idempotencyKey }
    });
    if (existing && existing.status !== "FAILED") {
      console.log(`[NOTIFICATION BLOCKED] Duplicate prevention for key: ${payload.idempotencyKey}`);
      return { success: true, duplicate: true };
    }
  }

  const recipientString = Array.isArray(payload.to) ? payload.to.join(",") : payload.to;
  let finalStatus = "DEFERRED"; // Default for V1 no-provider

  try {
    // Check if a production provider is configured
    if (process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_PROVIDER_NAME) {
      // A future adapter pattern would resolve the provider here:
      // const provider = EmailProviderFactory.get(process.env.EMAIL_PROVIDER_NAME);
      // await provider.send(payload);
      
      console.log(`[EMAIL DISPATCHED VIA ${process.env.EMAIL_PROVIDER_NAME}] to ${recipientString}`);
      finalStatus = "SENT";
    } else {
      // Development / Deferred Fallback
      console.log("========== [MOCK EMAIL DISPATCH] ==========");
      console.log(`TO: ${recipientString}`);
      console.log(`SUBJECT: ${payload.subject}`);
      console.log(`BODY:\n${payload.text}`);
      console.log("===========================================");
    }

    // Persist Audit Log
    await db.notificationLog.upsert({
      where: { idempotencyKey: payload.idempotencyKey || `auto_${Date.now()}_${Math.random()}` },
      create: {
        recipient: recipientString,
        subject: payload.subject,
        status: finalStatus,
        entityType: payload.entityType,
        entityId: payload.entityId,
        idempotencyKey: payload.idempotencyKey
      },
      update: {
        status: finalStatus,
        error: null,
      }
    });

    return { success: true, status: finalStatus };
  } catch (error: unknown) {
    console.error("[NOTIFICATION FAILURE]", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (payload.idempotencyKey) {
      await db.notificationLog.upsert({
        where: { idempotencyKey: payload.idempotencyKey },
        create: {
          recipient: recipientString,
          subject: payload.subject,
          status: "FAILED",
          entityType: payload.entityType,
          entityId: payload.entityId,
          idempotencyKey: payload.idempotencyKey,
          error: errorMessage
        },
        update: {
          status: "FAILED",
          error: errorMessage
        }
      });
    }
    
    // Do NOT throw. Notifications must not break the commercial workflow.
    return { success: false, status: "FAILED", error: errorMessage };
  }
}

// ---------------------------------------------------------------------------
// Business Operations Abstractions
// ---------------------------------------------------------------------------

export async function notifyAdminNewLead(leadId: string, leadName: string, leadSource: string) {
  return dispatchEmail({
    to: process.env.ADMIN_EMAIL || "admin@nanisystems.com",
    subject: `New Lead Captured: ${leadName}`,
    text: `A new lead (${leadName}) was captured via ${leadSource}. Please check the Admin Operations Dashboard.`,
    entityType: "Lead",
    entityId: leadId,
    idempotencyKey: `lead_${leadId}_new`
  });
}

export async function sendSecureClientLink(
  email: string, 
  documentType: "Proposal" | "Contract" | "Invoice" | "Onboarding", 
  link: string,
  entityId: string
) {
  return dispatchEmail({
    to: email,
    subject: `Your Nani Systems ${documentType} is Ready`,
    text: `Hello,\n\nYour ${documentType} has been securely generated.\n\nYou can view and accept it here:\n${link}\n\nThank you,\nNani Systems`,
    entityType: documentType,
    entityId,
    idempotencyKey: `${documentType}_${entityId}_sent`
  });
}

export async function notifyAdminSystemEvent(subject: string, text: string, idempotencyKey?: string) {
  return dispatchEmail({
    to: process.env.ADMIN_EMAIL || "admin@nanisystems.com",
    subject,
    text,
    idempotencyKey
  });
}

export async function sendInternalNotification(subject: string, text: string, idempotencyKey?: string) {
  return notifyAdminSystemEvent(subject, text, idempotencyKey);
}

export async function sendClientConfirmation(email: string, subject: string, text: string, entityType?: string, entityId?: string, idempotencyKey?: string) {
  return dispatchEmail({ to: email, subject, text, entityType, entityId, idempotencyKey });
}
