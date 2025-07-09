import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch"; // Assuming node-fetch is correctly installed and used in your environment

// Define the schema for a single check run detail
const CheckRunSchema = z.object({
    name: z.string(),
    status: z.string(),
    conclusion: z.string().nullable(),
    started_at: z.string().nullable(),
    completed_at: z.string().nullable(),
    url: z.string().nullable(),
});

export const ciStatusTool = createTool({
    id: "ci-tool",
    description: "Fetches detailed CI status for a GitHub commit or pull request",
    inputSchema: z.object({
        owner: z.string(),
        repo: z.string(),
        pull_number: z.number().optional(), // pull_number or commit_sha must be provided
        commit_sha: z.string().optional(), // pull_number or commit_sha must be provided
    }).refine((data) => data.pull_number !== undefined || data.commit_sha !== undefined, {
        message: "You must provide either a pull_number or commit_sha",
        path: ["pull_number", "commit_sha"], // This highlights both fields in the error
    }),
    outputSchema: z.object({
        status: z.string(), // e.g., "Found CI checks", "No CI checks found", "Error"
        details: z.array(CheckRunSchema), // Array of individual check run details
        error: z.string().optional(), // Optional error message for execution failures
    }),
    execute: async ({ context }) => {
        const { owner, repo, pull_number, commit_sha } = context;

        const headers = {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
        };

        let sha: string | undefined = commit_sha;

        // If pull_number is given and commit_sha is not, fetch commit SHA from PR
        if (!sha && pull_number !== undefined) {
            try {
                const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, { headers });

                if (!prRes.ok) {
                    const errorText = await prRes.text();
                    throw new Error(`GitHub API error fetching PR: ${prRes.status} - ${errorText}`);
                }

                const prData = (await prRes.json()) as { head?: { sha?: string } };
                if (!prData.head?.sha) {
                    throw new Error(`Unable to find commit SHA from PR #${pull_number}. PR data: ${JSON.stringify(prData)}`);
                }
                sha = prData.head.sha;
            } catch (error) {
                return {
                    status: "Error fetching PR details",
                    details: [],
                    error: `Failed to retrieve commit SHA from PR #${pull_number}: ${(error as Error).message}`,
                };
            }
        }

        // If after the above logic, sha is still undefined, it means neither was provided or PR lookup failed
        if (!sha) {
            return {
                status: "Error",
                details: [],
                error: "No commit_sha provided and failed to retrieve from pull_number.",
            };
        }

        // Fetch check runs for the determined commit SHA
        try {
            const checksRes = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/check-runs`,
                { headers }
            );

            if (!checksRes.ok) {
                const errorText = await checksRes.text();
                throw new Error(`GitHub API error fetching check runs: ${checksRes.status} - ${errorText}`);
            }

            type GitHubCheckRunsResponse = {
                total_count: number;
                check_runs: Array<{
                    name: string;
                    status: string; // 'queued', 'in_progress', 'completed'
                    conclusion: string | null; // 'success', 'failure', 'neutral', 'cancelled', 'timed_out', 'action_required', 'stale'
                    started_at: string; // ISO 8601 format
                    completed_at: string | null; // ISO 8601 format
                    html_url: string; // URL to the check run
                }>;
            };

            const checks = (await checksRes.json()) as GitHubCheckRunsResponse;

            if (!checks.check_runs || checks.check_runs.length === 0) {
                return {
                    status: "No CI checks found",
                    details: [],
                };
            }

            const result = checks.check_runs.map((run) => ({
                name: run.name,
                status: run.status,
                conclusion: run.conclusion,
                started_at: run.started_at,
                completed_at: run.completed_at,
                url: run.html_url,
            }));

            return {
                status: "Found CI checks",
                details: result,
            };
        } catch (error) {
            return {
                status: "Error fetching CI checks",
                details: [],
                error: `Failed to fetch check runs for commit ${sha}: ${(error as Error).message}`,
            };
        }
    },
});