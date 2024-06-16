import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function fetchPullRequests(owner: string, repo: string) {
  const { data: pullRequests } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
  });

  return pullRequests;
}

async function fetchPullRequestFiles(
  owner: string,
  repo: string,
  pull_number: number
) {
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number,
  });

  return files;
}

async function generateReview(content: string) {
  const response = await fetch(
    "https://api.openai.com/v1/engines/davinci/completions",
    {
      body: JSON.stringify({
        prompt: `Review the following code:\n\n${content}\n\nReview:`,
        max_tokens: 150,
      }),
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  return response.data.choices[0].text.trim();
}

export async function reviewPullRequest(
  owner: string,
  repo: string,
  pull_number: number
) {
  const files = await fetchPullRequestFiles(owner, repo, pull_number);

  for (const file of files) {
    const content = Buffer.from(file.patch, "base64").toString("utf-8");
    const review = await generateReview(content);

    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number,
      body: review,
      event: "COMMENT",
    });
  }
}
