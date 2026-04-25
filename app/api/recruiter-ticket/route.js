import {
  createFollowupTicket,
  createRecruiterLead,
  sendRecruiterNotificationEmail,
  storeConversationSummary,
  buildRecruiterEmailSubject,
} from "@/app/chat/tools";
import { getLead } from "@/app/chat/ticketStore";

function buildRecentMessages(history = [], form) {
  const flattened = history.flatMap((entry) => {
    const messages = [];
    if (entry?.user) {
      messages.push({ role: "Recruiter", content: entry.user });
    }
    if (entry?.bot) {
      messages.push({ role: "Rishikesh", content: entry.bot });
    }
    return messages;
  });

  if (form?.message) {
    flattened.push({ role: "Recruiter", content: form.message });
  }

  return flattened.slice(-10);
}

function buildSummary(form) {
  const parts = [
    form.company ? `Company: ${form.company}.` : "",
    form.recruiterName ? `Recruiter: ${form.recruiterName}.` : "",
    form.email ? `Email: ${form.email}.` : "",
    form.phone ? `Phone: ${form.phone}.` : "",
    form.message ? `Request: ${form.message}` : "",
  ];

  return parts.filter(Boolean).join(" ").trim();
}

export async function POST(req) {
  try {
    const {
      sessionId,
      history = [],
      recruiterName = "",
      company = "",
      email = "",
      phone = "",
      message = "",
    } = await req.json();

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    if (!email && !phone) {
      return Response.json(
        { error: "Email or phone is required" },
        { status: 400 },
      );
    }

    const existingLead = await getLead(sessionId);
    if (existingLead?.submittedTicketId && existingLead?.submittedEmailSubject) {
      return Response.json({
        ok: true,
        alreadySubmitted: true,
        ticketId: existingLead.submittedTicketId,
        emailSubject: existingLead.submittedEmailSubject,
      });
    }

    const form = {
      recruiterName: recruiterName.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    };

    const recentMessages = buildRecentMessages(history, form);
    const summary = buildSummary(form);
    const intent = "recruiter_form_submission";

    await createRecruiterLead({
      sessionId,
      ...form,
      intent,
      summary,
      latestMessage: form.message,
      recentMessages,
    });

    await storeConversationSummary({
      sessionId,
      intent,
      summary,
      recruiterEmail: form.email,
      recruiterPhone: form.phone,
      company: form.company,
    });

    const ticketResult = await createFollowupTicket({
      sessionId,
      intent,
      ...form,
      latestMessage: form.message,
      summary,
      recentMessages,
    });

    if (!ticketResult.ok) {
      return Response.json(
        { error: "Failed to create ticket" },
        { status: 500 },
      );
    }

    const emailSubject = buildRecruiterEmailSubject({
      company: form.company || "New lead",
      intent,
    });

    const emailResult = await sendRecruiterNotificationEmail({
      ticketId: ticketResult.ticket.ticketId,
      intent,
      ...form,
      latestMessage: form.message,
      summary,
      recentMessages,
    });

    if (!emailResult.ok) {
      return Response.json(
        { error: "Ticket created but email sending failed" },
        { status: 500 },
      );
    }

    await createRecruiterLead({
      sessionId,
      submittedTicketId: ticketResult.ticket.ticketId,
      submittedEmailSubject: emailResult.subject || emailSubject,
      submittedAt: new Date().toISOString(),
    });

    return Response.json({
      ok: true,
      ticketId: ticketResult.ticket.ticketId,
      emailSubject: emailResult.subject || emailSubject,
    });
  } catch (error) {
    console.error("Error creating recruiter ticket:", error);
    return Response.json(
      { error: "An error occurred while submitting recruiter details" },
      { status: 500 },
    );
  }
}
