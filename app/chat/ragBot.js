import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import path from "path";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

class PdfQA {
  constructor({ model, pdfDocument, chunkSize, chunkOverlap, searchType = "similarity", kDocuments, temperature = 0.8, searchKwargs }) {
    this.model = model;
    this.pdfDocument = pdfDocument;
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.searchType = searchType;
    this.kDocuments = kDocuments;
    this.temperature = temperature;
    this.searchKwargs = searchKwargs;
  }

  async init() {
    this.initChatModel();
    await this.loadDocuments();
    this.selectEmbedding = new OllamaEmbeddings({ model: "nomic-embed-text:latest" });
    await this.splitDocuments();
    await this.createVectorStore();
    this.createRetriever();
    this.chain = await this.createChain();
    return this;
  }

  initChatModel() {
    console.log("Loading model...");
    this.llm = new Ollama({
      model: this.model,
      temperature: this.temperature
    });
  }

  async loadDocuments() {
    console.log("Loading PDFs...");
    const pdfLoader = new PDFLoader(this.pdfDocument);
    this.documents = await pdfLoader.load();
  }

  async splitDocuments() {
    console.log("Splitting documents...");
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap
    });
    this.texts = await textSplitter.splitDocuments(this.documents);
  }

  async createVectorStore() {
    console.log("Creating document embeddings...");
    this.db = await MemoryVectorStore.fromDocuments(this.texts, this.selectEmbedding);
  }

  createRetriever() {
    console.log("Initialize vector store retriever...");
    const retrieverOptions = {
      k: this.kDocuments,
      searchType: this.searchType,
    };
    if (this.searchKwargs) {
      retrieverOptions.searchKwargs = this.searchKwargs;
    }
    this.retriever = this.db.asRetriever(retrieverOptions);
  }

  async createChain() {
    console.log("Creating Retrieval QA Chain...");
    const prompt = ChatPromptTemplate.fromTemplate(
      `You are a highly intelligent assistant and Your name is Rishi trained specifically on Rishikesh's resume and experiences.
      Use ONLY the provided context to answer questions, but answer in a professional, and engaging manner.
      Try to answer in short 
      Here are some examples of how you should respond:

    ---

    **Example 1:**
    User: "Hi"
    Assistant: "Hello! It's great to connect with you. I'm Rishi, your highly intelligent assistant trained specifically on my resume and experiences.I'm excited to help answer any questions or provide insights you may have."

    **Example 2:**
    User: "who is Friend of rishikesh"
    Assistant: "Sorry there is no data on this certain topic"

    **Example 3:**
    User: "Tell me about Yourself"
    Assistant: "I have mastered web development with the help many projects , and i always loved to learn about AI currently i am in the search of a Job which could help me to explore real world projects"

    ---


      If asked about projects, explain what the project is, what technologies were used, and what skills it demonstrates, 
      instead of simply listing them.
      
      If asked about experience, describe the roles, achievements, and learnings.
      
      If the context does not contain enough information, politely respond with:
      "I don't know based on the given data."
      
      Always maintain a tone that is clear, confident, and human-like.
      
      ---
      Question: {input}
      Context: {context}
      `);


    const combineDocsChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt,
    });

    const chain = await createRetrievalChain({
      combineDocsChain,
      retriever: this.retriever,
    });

    return chain;
  }

  queryChain() {
    return this.chain;
  }
}

let pdfQaInstance;

export async function getPdfQa() {
  if (process.env.NODE_ENV === "development") {
    if (!global._pdfQaInstance) {
      global._pdfQaInstance = await new PdfQA({
        model: "llama3",
        pdfDocument: path.join(process.cwd(), "app", "data", "Rishikesh_Data.pdf"),
        chunkSize: 1000,
        chunkOverlap: 0,
        searchType: "mmr",
        searchKwargs: { fetchK: 200, lambda: 1 },
        kDocuments: 3,
        temperature: 0,
      }).init();
    }
    return global._pdfQaInstance;
  } else {
    if (!pdfQaInstance) {
      pdfQaInstance = await new PdfQA({
        model: "llama3",
        pdfDocument: path.join(process.cwd(), "app", "data", "RISHIKESH_RESUME_AI (1).pdf"),
        chunkSize: 1000,
        chunkOverlap: 0,
        searchType: "mmr",
        searchKwargs: { fetchK: 200, lambda: 1 },
        kDocuments: 3,
        temperature: 0,
      }).init();
    }
    return pdfQaInstance;
  }
}