const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,5}[\s-]?\d{4,}/g;

function normalizePhone(phone) {
  return phone.replace(/\s+/g, " ").trim();
}

function pickFirstMatch(matches) {
  return matches?.length ? matches[0] : null;
}

function extractCompany(text) {
  const patterns = [
    /\bfrom\s+([A-Za-z0-9&., -]{2,60}?)(?:\s+(?:company|corp|corporation|inc|team|recruitment team|hiring team)\b|[.!?,]|$)/i,
    /\bwith\s+([A-Za-z0-9&., -]{2,60}?)(?:\s+(?:company|corp|corporation|inc|team)\b|[.!?,]|$)/i,
    /\bat\s+([A-Za-z0-9&., -]{2,60}?)(?:\s+(?:company|corp|corporation|inc)\b|[.!?,]|$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim().replace(/\s+/g, " ");
    }
  }

  return null;
}

function extractNameFromEmail(email) {
  if (!email) {
    return null;
  }

  const localPart = email.split("@")[0];
  if (!localPart) {
    return null;
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractRecruiterName(text) {
  const patterns = [
    /\bmy name is\s+([A-Za-z][A-Za-z -]{1,40})/i,
    /\bthis is\s+([A-Za-z][A-Za-z -]{1,40})/i,
    /\bi am\s+([A-Za-z][A-Za-z -]{1,40})\s+from\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

export function extractContactDetails(text) {
  const emails = [...new Set(text.match(EMAIL_REGEX) || [])];
  const phones = [...new Set((text.match(PHONE_REGEX) || []).map(normalizePhone))];

  return {
    email: pickFirstMatch(emails),
    phone: pickFirstMatch(phones),
    emails,
    phones,
    company: extractCompany(text),
    recruiterName: extractRecruiterName(text) || extractNameFromEmail(pickFirstMatch(emails)),
  };
}

export function mergeContactDetails(...detailsList) {
  return detailsList.reduce(
    (merged, details) => ({
      email: merged.email || details?.email || null,
      phone: merged.phone || details?.phone || null,
      company: merged.company || details?.company || null,
      recruiterName: merged.recruiterName || details?.recruiterName || null,
    }),
    {
      email: null,
      phone: null,
      company: null,
      recruiterName: null,
    },
  );
}
