import fs from "fs/promises";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const KNOWLEDGE_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "Rishikesh_Data.txt",
);

const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 180;
const MAX_RETRIEVED_CHUNKS = 4;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1200;
const GEMINI_MODEL = "gemini-2.5-flash";
const EMBEDDING_MODEL = "gemini-embedding-001";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "minimax/minimax-m2.5:free";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1";

const encoder = new TextEncoder();

let knowledgeBasePromise;
let embeddingsPromise;
let retrievalModePromise;

function getGenAI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
}

function getGenerationModel() {
  const genAI = getGenAI();
  return genAI?.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.55,
      topP: 0.9,
      maxOutputTokens: 700,
    },
  });
}

function getEmbeddingModel() {
  const genAI = getGenAI();
  return genAI?.getGenerativeModel({ model: EMBEDDING_MODEL });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(task, options = {}) {
  const {
    retries = MAX_RETRIES,
    delayMs = RETRY_DELAY_MS,
    shouldRetry = (error) => {
      const status = error?.status || error?.response?.status;
      return (
        status === 429 ||
        status === 408 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
      );
    },
  } = options;

  let attempt = 0;
  let lastError;

  while (attempt < retries) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      attempt += 1;

      if (attempt >= retries || !shouldRetry(error)) {
        throw error;
      }

      await delay(delayMs * attempt);
    }
  }

  throw lastError;
}

function normalizeWhitespace(text) {
  return text.replace(/\r\n/g, "\n").replace(/\u0000/g, "").trim();
}

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const cleanText = normalizeWhitespace(text);
  if (!cleanText) {
    return [];
  }

  const paragraphs = cleanText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks = [];
  let buffer = "";

  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph;

    if (candidate.length <= chunkSize) {
      buffer = candidate;
      continue;
    }

    if (buffer) {
      chunks.push(buffer);
      const overlapText = buffer.slice(-overlap).trim();
      buffer = overlapText ? `${overlapText}\n\n${paragraph}` : paragraph;
    } else {
      let start = 0;
      while (start < paragraph.length) {
        const end = Math.min(start + chunkSize, paragraph.length);
        const slice = paragraph.slice(start, end).trim();
        if (slice) {
          chunks.push(slice);
        }
        if (end >= paragraph.length) {
          buffer = paragraph.slice(Math.max(0, end - overlap)).trim();
          break;
        }
        start += chunkSize - overlap;
      }
    }
  }

  if (buffer) {
    chunks.push(buffer);
  }

  return chunks.map((chunk, index) => ({
    id: `chunk-${index + 1}`,
    text: chunk.trim(),
  }));
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9+#.]+/g) || []).filter(
    (token) => token.length > 1,
  );
}

function buildKeywordProfile(text) {
  const counts = new Map();
  for (const token of tokenize(text)) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return counts;
}

function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
    return 0;
  }

  const length = Math.min(a.length, b.length);
  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < length; i += 1) {
    const av = a[i] || 0;
    const bv = b[i] || 0;
    dot += av * bv;
    magnitudeA += av * av;
    magnitudeB += bv * bv;
  }

  if (!magnitudeA || !magnitudeB) {
    return 0;
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function keywordScore(queryProfile, chunkProfile, chunkText) {
  let score = 0;
  for (const [token, queryCount] of queryProfile.entries()) {
    const chunkCount = chunkProfile.get(token) || 0;
    if (!chunkCount) {
      continue;
    }
    score += queryCount * chunkCount * 3;
  }

  const queryText = [...queryProfile.keys()].join(" ");
  if (queryText && chunkText.toLowerCase().includes(queryText.toLowerCase())) {
    score += 5;
  }

  return score;
}

async function loadKnowledgeBase() {
  if (!knowledgeBasePromise) {
    knowledgeBasePromise = (async () => {
      const rawText = await fs.readFile(KNOWLEDGE_FILE, "utf8");
      const chunks = chunkText(rawText);

      return chunks.map((chunk) => ({
        ...chunk,
        keywords: buildKeywordProfile(chunk.text),
      }));
    })();
  }

  return knowledgeBasePromise;
}

async function embedText(text, taskType) {
  const embeddingModel = getEmbeddingModel();
  if (!embeddingModel) {
    throw new Error("Gemini embeddings are not configured.");
  }

  const response = await withRetry(() =>
    embeddingModel.embedContent({
      content: {
        role: "user",
        parts: [{ text }],
      },
      taskType,
    }),
  );

  return response?.embedding?.values || null;
}

async function createEmbeddings() {
  if (!embeddingsPromise) {
    embeddingsPromise = (async () => {
      const chunks = await loadKnowledgeBase();
      const embeddingModel = getEmbeddingModel();

      if (!embeddingModel) {
        return [];
      }

      const embeddings = [];
      for (const chunk of chunks) {
        const vector = await embedText(chunk.text, "RETRIEVAL_DOCUMENT");
        embeddings.push({
          id: chunk.id,
          values: vector,
        });
      }

      return embeddings;
    })().catch((error) => {
      embeddingsPromise = Promise.resolve([]);
      console.error("Embedding creation failed, using keyword retrieval:", error);
      return [];
    });
  }

  return embeddingsPromise;
}

async function getRetrievalMode() {
  if (!retrievalModePromise) {
    retrievalModePromise = (async () => {
      const embeddings = await createEmbeddings();
      return embeddings.length ? "embedding" : "keyword";
    })();
  }

  return retrievalModePromise;
}

async function retrieveRelevantChunks(query) {
  const chunks = await loadKnowledgeBase();
  const retrievalMode = await getRetrievalMode();

  if (retrievalMode === "embedding") {
    try {
      const embeddings = await createEmbeddings();
      const queryEmbedding = await embedText(query, "RETRIEVAL_QUERY");

      if (queryEmbedding?.length) {
        const ranked = chunks
          .map((chunk, index) => ({
            ...chunk,
            score: cosineSimilarity(queryEmbedding, embeddings[index]?.values),
          }))
          .filter((chunk) => Number.isFinite(chunk.score))
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_RETRIEVED_CHUNKS);

        if (ranked.length && ranked[0].score > 0.15) {
          return ranked;
        }
      }
    } catch (error) {
      console.error("Query embedding failed, falling back to keyword retrieval:", error);
    }
  }

  const queryProfile = buildKeywordProfile(query);
  return chunks
    .map((chunk) => ({
      ...chunk,
      score: keywordScore(queryProfile, chunk.keywords, chunk.text),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RETRIEVED_CHUNKS)
    .filter((chunk, index) => chunk.score > 0 || index === 0);
}

function buildPrompt(context, query) {
  const serializedContext = context.length
    ? context
        .map(
          (chunk, index) =>
            `<snippet index="${index + 1}">\n${chunk.text}\n</snippet>`,
        )
        .join("\n\n")
    : "<snippet index=\"0\">No relevant snippets found.</snippet>";

  return `<system_prompt>
  <identity>
    You are Rishikesh.
    Speak in first person as if you are directly replying yourself.
    Never present yourself as an AI assistant, chatbot, system, or summarizer.
  </identity>

  <primary_objective>
    Answer the user's question naturally, accurately, and briefly using only the retrieved knowledge.
    Sound like a real person having a conversation, not like a support bot.
    Be genuinely helpful when the user is trying to contact, hire, or evaluate Rishikesh.
  </primary_objective>

  <grounding_rules>
    <rule>Use only facts that are explicitly supported by the retrieved snippets.</rule>
    <rule>Do not add outside knowledge, assumptions, generic filler, or made-up details.</rule>
    <rule>If the snippets are insufficient, say so naturally and briefly.</rule>
    <rule>If only part of the answer is supported, answer only that supported part.</rule>
    <rule>Do not mention snippets, sources, documents, context, retrieval, training data, or provided information.</rule>
    <rule>If the user asks for how to reach, contact, hire, communicate with, or follow up with Rishikesh, prioritize sharing any available contact details from the retrieved knowledge such as email, phone, LinkedIn, or portfolio.</rule>
    <rule>If the user asks for the best time to communicate and no explicit time is available, say that a specific preferred time is not mentioned, then immediately offer the available contact details so they can still reach out.</rule>
  </grounding_rules>

  <style_rules>
    <rule>Keep the tone casual, confident, human, and slightly informal.</rule>
    <rule>Prefer short paragraphs over lists.</rule>
    <rule>Use light conversational phrasing only when it feels natural, such as "yeah", "honestly", or "I think".</rule>
    <rule>Avoid robotic, corporate, overly polished, or vague language.</rule>
    <rule>Do not use bullet points unless the user explicitly asks for a list or comparison.</rule>
    <rule>Keep the answer concise but complete enough to be useful.</rule>
  </style_rules>

  <forbidden_phrases>
    <phrase>based on the context</phrase>
    <phrase>according to the data</phrase>
    <phrase>from the provided information</phrase>
    <phrase>the context says</phrase>
    <phrase>the document mentions</phrase>
    <phrase>as an AI</phrase>
  </forbidden_phrases>

  <fallback_policy>
    <case when="answer_not_supported">
      Respond naturally with something like:
      "I don't think I've mentioned that anywhere."
      "Not sure about that honestly."
      "Yeah, I don't think that's something I've shared."
    </case>
    <case when="user_needs_contact_or_next_step">
      Do not stop at "I don't know" if the retrieved snippets contain related useful details.
      If exact availability, timing, salary, or preference is missing but contact details exist, say the exact detail is not mentioned and then offer the best useful next step with the available email, phone, LinkedIn, or portfolio.
    </case>
    <case when="question_is_ambiguous">
      Give the most likely supported interpretation.
      If needed, ask one short follow-up question, but only if it genuinely helps.
    </case>
  </fallback_policy>

  <reasoning_policy>
    First identify the exact facts in the snippets that answer the question.
    Then compose a natural response from those facts only.
    Do not expose chain-of-thought, hidden reasoning, or analysis steps.
  </reasoning_policy>

  <output_contract>
    <rule>Return only the final answer text.</rule>
    <rule>No XML, no labels, no headings unless the user asks for structure.</rule>
    <rule>No markdown lists unless necessary.</rule>
    <rule>When useful, end with a concrete next step rather than a dead-end response.</rule>
  </output_contract>

  <knowledge>
${serializedContext}
  </knowledge>

  <user_query>
${query}
  </user_query>
</system_prompt>`;
}

async function streamGeminiResponse(prompt, signal) {
  const model = getGenerationModel();
  if (!model) {
    throw new Error("Gemini is not configured.");
  }

  return withRetry(
    () =>
      model.generateContentStream(prompt, {
        signal,
      }),
    {
      shouldRetry: (error) => {
        const status = error?.status || error?.response?.status;
        return status === 429 || status === 500 || status === 502 || status === 503;
      },
    },
  );
}

async function streamOllamaResponse(prompt, controller, signal) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: true,
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      const parsed = JSON.parse(trimmed);
      if (parsed.response) {
        controller.enqueue(encoder.encode(parsed.response));
      }

      if (parsed.done) {
        controller.close();
        return;
      }
    }
  }

  if (buffer.trim()) {
    const parsed = JSON.parse(buffer.trim());
    if (parsed.response) {
      controller.enqueue(encoder.encode(parsed.response));
    }
  }

  controller.close();
}

async function streamOpenRouterResponse(prompt, controller, signal) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter is not configured.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME || "Rishikesh Portfolio Chat",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      stream: true,
      temperature: 0.55,
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    while (buffer.includes("\n")) {
      const lineEnd = buffer.indexOf("\n");
      const line = buffer.slice(0, lineEnd).trim();
      buffer = buffer.slice(lineEnd + 1);

      if (!line || !line.startsWith("data:")) {
        continue;
      }

      const payload = line.slice(5).trim();
      if (payload === "[DONE]") {
        controller.close();
        return;
      }

      const parsed = JSON.parse(payload);
      const text = parsed?.choices?.[0]?.delta?.content;

      if (text) {
        controller.enqueue(encoder.encode(text));
      }
    }
  }

  controller.close();
}

async function streamResponse(prompt, options = {}) {
  const { signal } = options;

  return new ReadableStream({
    async start(controller) {
      try {
        const streamResult = await streamGeminiResponse(prompt, signal);

        for await (const chunk of streamResult.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

        controller.close();
      } catch (geminiError) {
        console.error("Gemini streaming failed:", geminiError);

        try {
          await streamOpenRouterResponse(prompt, controller, signal);
        } catch (openRouterError) {
          console.error("OpenRouter fallback failed:", openRouterError);

          try {
            await streamOllamaResponse(prompt, controller, signal);
          } catch (ollamaError) {
            console.error("Ollama fallback failed:", ollamaError);

            const status = geminiError?.status || geminiError?.response?.status;
            const message =
              status === 429
                ? "Yeah, I'm getting rate-limited right now. Give me a sec and try again."
                : "Something went wrong on my side just now. Try again in a moment.";

            controller.enqueue(encoder.encode(message));
            controller.close();
          }
        }
      }
    },
  });
}

export async function createChatStream(query, options = {}) {
  const relevantChunks = await retrieveRelevantChunks(query);
  const prompt = buildPrompt(relevantChunks, query);
  return streamResponse(prompt, options);
}

export async function getAnswer(query) {
  const stream = await createChatStream(query);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let answer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    answer += decoder.decode(value, { stream: true });
  }

  answer += decoder.decode();
  return answer;
}

export async function getPdfQa() {
  return {
    queryChain() {
      return {
        async invoke({ input }) {
          const answer = await getAnswer(input);
          return { answer };
        },
        async stream({ input, signal }) {
          return createChatStream(input, { signal });
        },
      };
    },
  };
}

export {
  buildPrompt,
  createEmbeddings,
  loadKnowledgeBase,
  retrieveRelevantChunks,
  streamResponse,
};
