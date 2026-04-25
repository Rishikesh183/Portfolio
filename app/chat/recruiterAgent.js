import {
  extractContactDetails,
  mergeContactDetails,
} from "@/app/chat/contactExtractor";
import {
  createRecruiterLead,
  storeConversationSummary,
} from "@/app/chat/tools";
import { getLead } from "@/app/chat/ticketStore";

function normalizeText(text) {
  return (text || "").toLowerCase();
}

function extractRecentMessages(history = [], latestMessage = "") {
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

  if (latestMessage) {
    flattened.push({ role: "Recruiter", content: latestMessage });
  }

  return flattened.slice(-8);
}

function findLatestRecruiterMessage(history = []) {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index]?.user) {
      return history[index].user;
    }
  }
  return "";
}

function detectIntent(message, history, lead) {
  const text = normalizeText(message);
  const priorRecruiterText = normalizeText(findLatestRecruiterMessage(history));
  const isRecruiterContext =
    /\brecruit|hiring|talent|hr|micron|google|company|job|role|interview\b/.test(text) ||
    /\brecruit|hiring|talent|hr|company|job|role|interview\b/.test(priorRecruiterText) ||
    Boolean(lead?.company || lead?.recruiterName || lead?.email || lead?.phone);

  if (/(call me|make me a call|reach out to me|contact me|call when you are free|get back to me|follow up with me|raise a ticket)/.test(text)) {
    return "callback_request";
  }

  if (/(salary|compensation|ctc|package|how much do you expect|expected pay)/.test(text)) {
    return "salary_discussion";
  }

  if (/(best time|when are you free|when can we connect|availability|available to talk)/.test(text)) {
    return "availability_request";
  }

  if (/(how can i contact|how to contact|reach you|connect with you|email you|phone number|linkedin)/.test(text)) {
    return "contact_request";
  }

  if (/(i am from|i'm from|we are from|recruitment team|hiring team|talent acquisition)/.test(text) && isRecruiterContext) {
    return "recruiter_intro";
  }

  if (/(let him know|tell him|convey|share this|pass this on)/.test(text)) {
    return "share_message";
  }

  return "general";
}

function needsContactInfo(intent, contact) {
  if (!["callback_request", "share_message"].includes(intent)) {
    return false;
  }

  return !contact.email && !contact.phone;
}

function buildSummary(intent, message, contact) {
  const prefixMap = {
    callback_request: "Recruiter requested a callback or ticket.",
    share_message: "Recruiter asked to pass along a message.",
    salary_discussion: "Recruiter asked about salary expectations.",
    availability_request: "Recruiter asked about a good time to connect.",
    contact_request: "Recruiter asked for contact details.",
    recruiter_intro: "Recruiter introduced themselves.",
  };

  const details = [
    contact.company ? `Company: ${contact.company}.` : "",
    contact.email ? `Email: ${contact.email}.` : "",
    contact.phone ? `Phone: ${contact.phone}.` : "",
    `Latest message: ${message}`,
  ]
    .filter(Boolean)
    .join(" ");

  return `${prefixMap[intent] || "Conversation update."} ${details}`.trim();
}

function buildMissingContactResponse() {
  return "Happy to. What's the best email or phone number to reach you on? Once that's there, you can use the recruiter form below and hit Finish so I can raise it properly.";
}

function buildHelpfulRecruiterReply(intent, contact, actionResult) {
  const recruiterReference =
    contact.recruiterName || contact.company
      ? `${contact.recruiterName || "there"}${contact.company ? ` from ${contact.company}` : ""}`
      : "there";

  if (intent === "salary_discussion") {
    return "I haven't shared a fixed salary expectation here, honestly. It would depend on the role, scope, and overall package, but I'd be happy to discuss it. You can reach me at rishikeshdevarashetty@gmail.com, call me at +91-7013848045, or connect with me on LinkedIn at https://linkedin.com/in/rishikesh24.";
  }

  if (intent === "availability_request") {
    return "I haven't mentioned a specific preferred time slot here, but feel free to reach me at rishikeshdevarashetty@gmail.com or +91-7013848045, and we can line it up. I'm also on LinkedIn at https://linkedin.com/in/rishikesh24.";
  }

  if (intent === "contact_request" || intent === "recruiter_intro") {
    return "Sure, you can reach me at rishikeshdevarashetty@gmail.com, call me at +91-7013848045, or connect with me on LinkedIn at https://linkedin.com/in/rishikesh24. If you want me to log a recruiter follow-up properly, you can also fill the recruiter form below and hit Finish.";
  }

  if (["callback_request", "share_message"].includes(intent)) {
    const parts = [
      `Thanks ${recruiterReference !== "there" ? recruiterReference : "for reaching out"}.`,
      contact.email || contact.phone
        ? `I've noted your ${contact.email ? `email as ${contact.email}` : `number as ${contact.phone}`}.`
        : "",
      actionResult.lead?.ok
        ? "I've logged this on my side so it doesn't get missed."
        : "",
      "To raise the actual ticket and send the final mail only once, please fill the recruiter form below and press Finish.",
    ];

    return parts.filter(Boolean).join(" ");
  }

  return null;
}

export async function planRecruiterResponse({
  sessionId,
  message,
  history = [],
}) {
  const lead = (await getLead(sessionId)) || {};
  const currentContact = extractContactDetails(message);
  const historyContact = history.reduce(
    (merged, entry) => mergeContactDetails(merged, extractContactDetails(entry.user || "")),
    {
      email: null,
      phone: null,
      company: null,
      recruiterName: null,
    },
  );

  const contact = mergeContactDetails(lead, historyContact, currentContact);
  const intent = detectIntent(message, history, lead);
  const missingContactInfo = needsContactInfo(intent, contact);
  const recentMessages = extractRecentMessages(history, message);
  const summary = buildSummary(intent, message, contact);

  const result = {
    handled: false,
    directReply: null,
    contextNote: "",
  };

  if (intent === "general") {
    return result;
  }

  if (missingContactInfo) {
    return {
      handled: true,
      directReply: buildMissingContactResponse(),
      contextNote: "Recruiter wants follow-up but has not shared email or phone yet.",
    };
  }

  const leadPayload = {
    sessionId,
    ...contact,
    intent,
    latestMessage: message,
    summary,
    recentMessages,
  };

  const toolResults = {
    lead: await createRecruiterLead(leadPayload),
  };

  await storeConversationSummary({
    sessionId,
    intent,
    summary,
    recruiterEmail: contact.email,
    recruiterPhone: contact.phone,
    company: contact.company,
  });

  return {
    handled: true,
    directReply: buildHelpfulRecruiterReply(intent, contact, toolResults),
    contextNote: summary,
  };
}
