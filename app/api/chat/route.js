import { getPdfQa } from "@/app/chat/ragBot";

export async function POST(req) {
  const { message } = await req.json();   

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const pdfQa = await getPdfQa();
  const pdfQaChain = pdfQa.queryChain();

  const response = await pdfQaChain.invoke({ input: message });  
  const answer = response.answer || "Sorry, I don't know.";

  return Response.json({ answer });  
}


