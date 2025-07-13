import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createRepo } from "../../services/githubService"; // Import from service

export const repositoryTool = createTool({
    id: "create-github-repository",
    description: "Creates a GitHub repository and seeds it with a README file.",
    inputSchema: z.object({
        name: z.string().describe("The repository name in kebab-case."),
        readmeContent: z.string().describe("The full markdown content for the README.md."),
    }),
    outputSchema: z.object({
        url: z.string(),
        readmeUrl: z.string(),
    }),
    execute: async ({ context }) => {
        return await createRepo(context.name, context.readmeContent);
    },
});