import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch";

export const ciTool = createTool({
    id: "ci-tool",
    description: "Checks GitHub Actions status for a repo",
    inputSchema: z.object({ owner: z.string(), repo: z.string() }),
    outputSchema: z.object({ status: z.string(), url: z.string() }),
    execute: async ({ context }) => {
        const res = await fetch(
            `https://api.github.com/repos/${context.owner}/${context.repo}/actions/runs?per_page=1`,
            { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
        );
        const data = await res.json() as { workflow_runs?: { conclusion?: string; html_url?: string }[] };
        const latest = data.workflow_runs?.[0];
        return {
            status: latest?.conclusion ?? "unknown",
            url: latest?.html_url ?? "",
        };
    },
});
