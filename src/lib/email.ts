import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@yourdomain.com";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });
}
