import { Octokit } from "@octokit/rest";
import { generateReview } from "./generateReview";

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
    state: "open",
  });

  return files;
}

export async function reviewPullRequest(
  owner: string,
  repo: string,
  pull_number: number
) {
  const files = await fetchPullRequestFiles(owner, repo, pull_number);

  const reviewList = [];
  for (const file of files) {
    const { patch } = file;
    const review = await generateReview(patch!);
    reviewList.push(review);
  }

  return reviewList;
}

export async function reviewBot(
  owner: string,
  repo: string,
  pull_number: number
) {
  const reviewList = await reviewPullRequest(owner, repo, pull_number);

  for (const review of reviewList) {
    if (review && review !== "no content found") {
      await octokit.pulls.createReview({
        owner,
        repo,
        pull_number,
        body: review,
        event: "COMMENT",
      });
    }
  }
}
