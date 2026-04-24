import { createChatStream } from "@/app/chat/ragBot";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const stream = await createChatStream(message, { signal: req.signal });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
