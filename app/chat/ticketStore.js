const MEMORY_TTL_MS = 1000 * 60 * 60 * 24 * 30;

const leadStore = new Map();
const transcriptStore = new Map();
const ticketStore = new Map();

function now() {
  return Date.now();
}

function isExpired(entry) {
  return !entry || entry.expiresAt < now();
}

function readStore(store, key, fallback) {
  const entry = store.get(key);
  if (isExpired(entry)) {
    store.delete(key);
    return fallback;
  }
  return entry.value;
}

function writeStore(store, key, value) {
  store.set(key, {
    value,
    expiresAt: now() + MEMORY_TTL_MS,
  });
}

function generateTicketId() {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `REQ-${Date.now()}-${randomPart}`.toUpperCase();
}

export async function getLead(sessionId) {
  if (!sessionId) {
    return null;
  }

  return readStore(leadStore, sessionId, null);
}

export async function getTicket(ticketId) {
  if (!ticketId) {
    return null;
  }

  return readStore(ticketStore, ticketId, null);
}

export async function saveLead(sessionId, lead) {
  if (!sessionId) {
    return { ok: false, reason: "missing_session_id" };
  }

  const existing = (await getLead(sessionId)) || {};
  const payload = {
    ...existing,
    ...lead,
    sessionId,
    updatedAt: new Date().toISOString(),
  };

  writeStore(leadStore, sessionId, payload);

  return { ok: true, lead: payload };
}

export async function appendTranscriptSummary(sessionId, summaryEntry) {
  if (!sessionId) {
    return { ok: false, reason: "missing_session_id" };
  }

  const entries = readStore(transcriptStore, sessionId, []);
  const nextEntries = [
    ...entries,
    {
      ...summaryEntry,
      createdAt: new Date().toISOString(),
    },
  ].slice(-20);

  writeStore(transcriptStore, sessionId, nextEntries);

  return { ok: true };
}

export async function getTranscriptSummaries(sessionId, limit = 10) {
  if (!sessionId) {
    return [];
  }

  const entries = readStore(transcriptStore, sessionId, []);
  return entries.slice(-limit);
}

export async function createTicket(sessionId, payload) {
  if (!sessionId) {
    return { ok: false, reason: "missing_session_id" };
  }

  const ticketId = payload.ticketId || generateTicketId();
  const ticket = {
    ticketId,
    sessionId,
    status: "open",
    createdAt: new Date().toISOString(),
    ...payload,
  };

  writeStore(ticketStore, ticketId, ticket);

  await saveLead(sessionId, {
    ticketId,
    lastAction: payload.intent || "follow_up",
  });

  return { ok: true, ticket };
}
