import { openaiClient } from "../../openaiClient";

export async function fetch(req: Request) {
  if (process.env.NODE_ENV === "development") {
    try {
      const response = await openaiClient.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-4",
      });

      return new Response(JSON.stringify({ response }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error handling request:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  } else {
    return new Response("Not Found", { status: 404 });
  }
}
