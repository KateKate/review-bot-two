import { reviewPullRequest } from "../reviewBot";

// Define the fetch function to handle incoming requests
export async function fetch(req: Request) {
  if (req.method === "GET") {
    return new Response("Hello");
  }
  if (req.method === "POST") {
    try {
      const payload = await req.json();

      if (payload.action === "opened" || payload.action === "synchronize") {
        const { repository, pull_request } = payload;
        const owner = repository.owner.login;
        const repo = repository.name;
        const pull_number = pull_request.number;

        await reviewPullRequest(owner, repo, pull_number);
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error handling webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
}
