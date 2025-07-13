import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { analyzeDependencies } from "../../services/securityService";

export const securityScanTool = createTool({
    id: "scan-npm-dependencies",
    description: "Fetches package.json from a repo and performs a basic security and dependency analysis.",
    inputSchema: z.object({
        owner: z.string().describe("The repository owner's username."),
        repo: z.string().describe("The repository name."),
    }),
    outputSchema: z.object({
        summary: z.string(),
    }),
    execute: async ({ context }) => {
        return await analyzeDependencies(context.owner, context.repo);
    },
});