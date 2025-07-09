import { createTool } from "@mastra/core/tools";
import { z } from "zod";
// The path to your helper would need to be updated after moving this file.
import { createRepoAndPush } from "../../agents/octokit-helper";

export const repositoryTool = createTool({
    id: "repository-tool",
    description: "Creates a GitHub repository and seeds it with a dynamically generated README file.",

    // The input schema is now more powerful. It requires the README content.
    inputSchema: z.object({
        name: z.string().describe("The repository name, which must be in kebab-case."),
        readmeContent: z.string().describe("The full markdown content for the initial README.md file."),
    }),

    outputSchema: z.object({
        url: z.string(),
        readmeUrl: z.string(),
    }),

    execute: async ({ context }) => {
        const { name, readmeContent } = context;

        // The tool now uses the readmeContent provided by the agent.
        // It defaults to creating a public repository.
        return await createRepoAndPush(name, false, readmeContent);
    },
});