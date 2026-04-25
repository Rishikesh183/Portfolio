import nodemailer from "nodemailer";
import {
  appendTranscriptSummary,
  createTicket,
  saveLead,
} from "@/app/chat/ticketStore";

const DEFAULT_RISHI_EMAIL = "rishikeshdevarashetty@gmail.com";

export function buildRecruiterEmailSubject(payload) {
  return `[Recruiter Lead] ${payload.company || "New lead"} - ${payload.intent}`;
}

function buildEmailHtml(payload) {
  const transcriptHtml = payload.recentMessages
    .map(
      (message) =>
        `<li><strong>${message.role}:</strong> ${String(message.content)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</li>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2>Recruiter follow-up requested</h2>
      <p><strong>Ticket:</strong> ${payload.ticketId}</p>
      <p><strong>Intent:</strong> ${payload.intent}</p>
      <p><strong>Recruiter:</strong> ${payload.recruiterName || "Not provided"}</p>
      <p><strong>Company:</strong> ${payload.company || "Not provided"}</p>
      <p><strong>Email:</strong> ${payload.email || "Not provided"}</p>
      <p><strong>Phone:</strong> ${payload.phone || "Not provided"}</p>
      <p><strong>Summary:</strong> ${payload.summary}</p>
      <p><strong>Latest message:</strong> ${payload.latestMessage}</p>
      <h3>Recent conversation</h3>
      <ul>${transcriptHtml}</ul>
    </div>
  `;
}

export async function sendRecruiterNotificationEmail(payload) {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const from = DEFAULT_RISHI_EMAIL;
  const to = process.env.RECRUITER_ALERT_EMAIL || DEFAULT_RISHI_EMAIL;

  if (!appPassword) {
    return {
      ok: false,
      reason: "email_not_configured",
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: appPassword,
    },
  });

  try {
    const subject = buildRecruiterEmailSubject(payload);
    const result = await transporter.sendMail({
      from: `"Rishikesh Portfolio Chat" <${from}>`,
      to,
      subject,
      html: buildEmailHtml(payload),
    });

    return {
      ok: true,
      subject,
      result,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "email_send_failed",
      error: error.message,
    };
  }
}

export async function createRecruiterLead(payload) {
  return saveLead(payload.sessionId, payload);
}

export async function storeConversationSummary(payload) {
  return appendTranscriptSummary(payload.sessionId, payload);
}

export async function createFollowupTicket(payload) {
  return createTicket(payload.sessionId, payload);
}
