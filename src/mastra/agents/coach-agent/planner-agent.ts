import { Agent } from "@mastra/core/agent";
import { model } from "../../config";

export const PlannerAgent = new Agent({
    name: "PlannerAgent",
    instructions: `
You are a planning assistant.
- Given one project idea, return 3–5 milestones as bullet points.
`,
    model,
});
