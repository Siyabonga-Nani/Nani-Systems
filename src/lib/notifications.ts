/**
 * Nani Systems V1 - Provider-Neutral Notification Infrastructure
 * 
 * This service abstracts all notification logic. It currently logs to the console
 * but is structurally prepared to plug in any email provider (e.g., Resend, AWS SES)
 * strictly without modifying the Admin architecture.
 * 
 * Pending Founder Approval of a specific provider.
 */

export interface NotificationPayload {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export async function dispatchEmail(payload: NotificationPayload) {
  // Check if a production provider is configured
  if (process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_PROVIDER_NAME) {
    // A future adapter pattern would resolve the provider here:
    // const provider = EmailProviderFactory.get(process.env.EMAIL_PROVIDER_NAME);
    // await provider.send(payload);
    
    console.log(`[EMAIL DISPATCHED VIA ${process.env.EMAIL_PROVIDER_NAME}] to ${payload.to}`);
    return { success: true };
  }

  // Development / Deferred Fallback
  console.log("========== [MOCK EMAIL DISPATCH] ==========");
  console.log(`TO: ${payload.to}`);
  console.log(`SUBJECT: ${payload.subject}`);
  console.log(`BODY:\n${payload.text}`);
  console.log("===========================================");
  
  return { success: true, mock: true };
}

// ---------------------------------------------------------------------------
// Business Operations Abstractions
// ---------------------------------------------------------------------------

export async function notifyAdminNewLead(leadName: string, leadSource: string) {
  return dispatchEmail({
    to: process.env.ADMIN_EMAIL || "admin@nanisystems.com",
    subject: `New Lead Captured: ${leadName}`,
    text: `A new lead (${leadName}) was captured via ${leadSource}. Please check the Admin Operations Dashboard.`,
  });
}

export async function sendSecureClientLink(email: string, documentType: "Proposal" | "Contract" | "Invoice", link: string) {
  return dispatchEmail({
    to: email,
    subject: `Your Nani Systems ${documentType} is Ready`,
    text: `Hello,\n\nYour ${documentType} has been securely generated.\n\nYou can view and accept it here:\n${link}\n\nThank you,\nNani Systems`,
  });
}

export async function notifyAdminSystemEvent(subject: string, text: string) {
  return dispatchEmail({
    to: process.env.ADMIN_EMAIL || "admin@nanisystems.com",
    subject,
    text,
  });
}

export async function sendInternalNotification(subject: string, text: string) {
  return notifyAdminSystemEvent(subject, text);
}

export async function sendClientConfirmation(email: string, subject: string, text: string) {
  return dispatchEmail({ to: email, subject, text });
}
