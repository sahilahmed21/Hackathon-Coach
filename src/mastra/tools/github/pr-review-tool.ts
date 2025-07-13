import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getPullRequestDiff } from "../../services/githubService";

export const prReviewTool = createTool({
    id: "get-pr-diff",
    description: "Fetches the .diff content from a GitHub pull request to be reviewed.",
    inputSchema: z.object({
        owner: z.string().describe("The repository owner's username."),
        repo: z.string().describe("The repository name."),
        pull_number: z.number().describe("The pull request number."),
    }),
    outputSchema: z.object({
        diff: z.string(),
    }),
    execute: async ({ context }) => {
        const diff = await getPullRequestDiff(context.owner, context.repo, context.pull_number);
        return { diff };
    },
});