import { reviewPullRequest } from "../../reviewBot";

// review-pull-request?owner=KateKate&repo=nextjs-for-review&pull_number=1
export async function fetch(req: Request) {
  if (req.method === "GET" && process.env.NODE_ENV === "development") {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const pull_number = searchParams.get("pull_number");

    if (!owner || !repo || !pull_number) {
      return new Response("Missing required parameters", { status: 400 });
    }

    try {
      const response = await reviewPullRequest(
        owner!,
        repo!,
        parseInt(pull_number!)
      );
      return new Response(response.join("\n"));
    } catch (error) {
      console.error("Error handling request:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
}
