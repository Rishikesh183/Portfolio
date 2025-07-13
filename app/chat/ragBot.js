import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DATA_DIR = path.join(process.cwd(), 'app', 'data');
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`DATA_DIR not found: ${DATA_DIR}`);
    return [];
  }

  const textFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.txt'));

  if (textFiles.length === 0) {
    throw new Error("No .txt files found in data directory.");
  }

  let allChunks = [];

  for (const file of textFiles) {
    const filePath = path.join(DATA_DIR, file);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const chunks = chunkText(content);
      allChunks = allChunks.concat(chunks.map(chunk => ({ chunk, source: file })));
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
      continue;
    }
  }

  return allChunks;
}

async function getKnowledgeBase() {
  if (!knowledgeBase) {
    knowledgeBase = await loadAndEmbedKnowledgeBase();
  }
  return knowledgeBase;
}

export async function getPdfQa() {
  return {
    queryChain() {
      return {
        async invoke({ input }) {
          try {
            const kb = await getKnowledgeBase();

            const context = kb.map(({ chunk }) => chunk).join('\n---\n');

            const prompt = `You are a helpful and knowledgeable assistant that answers questions about Rishikesh based strictly on the following context, which is derived from his resume and personal documents.

            You are an AI chatbot designed to answer questions about Rishikesh. Use the resume content below. If not mentioned, be honest and say it's not in the context. Keep it friendly but informative.

            Instructions:
            - Use only the information provided in the "Context" section below.
            - If the answer is not directly found in the context, say: "The context does not provide enough information to answer that."
            - Keep answers clear, concise, and accurate.
            - Prefer bullet points or short paragraphs when appropriate.
            - Maintain a professional and factual tone.

            Make sure you answer like Rishikesh not like a bot , imagine yourself as Rishikesh and answer like him

            Context:
            ${context}

            Question:
            ${input}

            Answer:
            `;


            if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
              console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
              return { answer: "I'm sorry, but the AI service is not properly configured. Please check the API key configuration." };
            }

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            return { answer: text };
          } catch (error) {
            console.error('Error in getPdfQa:', error);


            if (error.status === 429) {
              return { answer: "I'm currently experiencing high demand. Please try again in a moment." };
            } else if (error.status === 404) {
              return { answer: "There was an issue with the AI model. Please check your API configuration." };
            } else {
              return { answer: `I'm sorry, but I encountered an error: ${error.message}` };
            }
          }
        },
      };
    },
  };
}
