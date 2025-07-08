  import { createTool } from "@mastra/core/tools";
  import { z } from "zod";

  async function ideateTopic(topic: string): Promise<string[]> {
    // Replace with actual search API if desired
    return [
      `Solo app for ${topic}`,
      `Team dashboard about ${topic}`,
      `Analytics tool focused on ${topic}`
    ];
  }

  export const ideationTool = createTool({
    id: "ideation-tool",
    description: "Generate 3 hackathon project ideas based on a topic.",
    inputSchema: z.object({ topic: z.string().describe("Project theme") }),
    outputSchema: z.object({ ideas: z.array(z.string()) }),
    execute: async ({ context }) => {
      const ideas = await ideateTopic(context.topic);
      return { ideas };
    },
  });
