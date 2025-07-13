import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { findResources } from "../../services/searchService";

export const resourceFinderTool = createTool({
    id: "find-developer-resources",
    description: "Searches for documentation, tutorials, and articles to help a developer who is stuck.",
    inputSchema: z.object({
        query: z.string().describe("The error message, concept, or question to search for."),
    }),
    outputSchema: z.object({
        results: z.array(z.object({
            title: z.string(),
            link: z.string(),
            snippet: z.string(),
        })),
    }),
    execute: async ({ context }) => {
        const results = await findResources(context.query);
        return { results };
    },
}); 