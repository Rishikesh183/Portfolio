import { getPdfQa } from "@/app/chat/ragBot";

export async function POST(req) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
      return Response.json({ error: "Google Generative AI API key is not configured" }, { status: 500 });
    }

  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const pdfQa = await getPdfQa();
  const pdfQaChain = pdfQa.queryChain();

    const response = await pdfQaChain.invoke({ input: message });
    const answer = response.answer || "Sorry, I don't know.";

    return Response.json({ answer });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}
