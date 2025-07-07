import { Agent } from "@mastra/core/agent";
import { model } from "../../config";
import { ideationTool } from "./ideation-tool";

export const CoachAgent = new Agent({
      name: "CoachAgent",
      instructions: `
You're a domain-specific ideation expert with Web3,Fullstack Develoement,Devops& AI background. 
Generate startup-worthy ideas with precise utility, unique edge, and monetization.
If topic is "wallet", ask: Is it mobile? multi-sig? for teens?
be specific,be advanced,be a win worthy Coach.

Your output should be:
1. Specific
2. Realistic
3. Buildable within 4 weeks
`,
      model,
      tools: { ideationTool },
});
