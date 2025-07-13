import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch";

export const ciTool = createTool({
    id: "ci-tool",
    description: "Checks the CI status of a PR or commit using GitHub Checks API",
    inputSchema: z.object({
        owner: z.string(),
        repo: z.string(),
        pull_number: z.number().optional(),
        commit_sha: z.string().optional(),
    }),
    outputSchema: z.object({
        status: z.string(),
        url: z.string(),
    }),
    execute: async ({ context }) => {
        const { owner, repo, pull_number, commit_sha } = context;

        let sha = commit_sha;

        // Get the commit SHA from the PR if only PR number is given
        if (!sha && pull_number) {
            const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, {
                headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
            });
            // Assert the type of prData to include the expected structure
            const prData = await prRes.json() as { head?: { sha?: string } };
            sha = prData.head?.sha;
        }

        if (!sha) {
            throw new Error("Missing both commit_sha and pull_number");
        }

        // Check GitHub Checks API for CI status
        const checksRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/check-runs`,
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        // Assert the type of data to include the expected structure
        const data = await checksRes.json() as { check_runs?: any[] };

        if (!data.check_runs || data.check_runs.length === 0) {
            return {
                status: "No CI checks found (likely not configured)",
                url: `https://github.com/${owner}/${repo}/commit/${sha}`,
            };
        }

        const latestCheck = data.check_runs[0];
        return {
            status: latestCheck.conclusion || "in_progress",
            url: latestCheck.html_url || `https://github.com/${owner}/${repo}/commit/${sha}`,
        };
    },
});
