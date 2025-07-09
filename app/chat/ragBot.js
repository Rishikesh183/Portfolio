import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { generateText, embed } from 'ai';
import { google } from '@ai-sdk/google';

const DATA_DIR = path.join(process.cwd(), 'app', 'data');
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = google('models/embedding-001');
const LLM_MODEL = google('models/gemini-2.0-flash-exp');

let knowledgeBase = null;

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
}

async function loadAndEmbedKnowledgeBase() {
  const pdfFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
  let allChunks = [];
  for (const file of pdfFiles) {
    const filePath = path.join(DATA_DIR, file);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const chunks = chunkText(data.text);
    allChunks = allChunks.concat(chunks.map(chunk => ({ chunk, source: file })));
  }
  // Embed all chunks
  const embeddings = [];
  for (const { chunk, source } of allChunks) {
    const { embedding } = await embed({
      model: EMBEDDING_MODEL,
      value: chunk,
      apiKey: process.env.GOOGLE_API_KEY,
    });
    embeddings.push({ embedding, chunk, source });
  }
  return embeddings;
}

function cosineSimilarity(a, b) {
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getKnowledgeBase() {
  if (!knowledgeBase) {
    knowledgeBase = await loadAndEmbedKnowledgeBase();
  }
  return knowledgeBase;
}

export async function getPdfQa() {
  // RAG chain
  return {
    queryChain() {
      return {
        async invoke({ input }) {
          const kb = await getKnowledgeBase();
          // Embed the query
          const { embedding: queryEmbedding } = await embed({
            model: EMBEDDING_MODEL,
            value: input,
            apiKey: process.env.GOOGLE_API_KEY,
          });
          // Find top 2 most similar chunks
          const scored = kb.map(({ embedding, chunk, source }) => ({
            score: cosineSimilarity(queryEmbedding, embedding),
            chunk,
            source,
          }));
          scored.sort((a, b) => b.score - a.score);
          const topChunks = scored.slice(0, 2).map(s => s.chunk).join('\n---\n');
          // Compose prompt
          const prompt = `You are an AI assistant answering questions about Rishikesh. Use the following context from his resume and data.\n\nContext:\n${topChunks}\n\nQuestion: ${input}\n\nAnswer:`;
          // Get answer from Gemini
          const { text } = await generateText({
            model: LLM_MODEL,
            prompt,
            apiKey: process.env.GOOGLE_API_KEY,
          });
          return { answer: text };
        },
      };
    },
  };
}
