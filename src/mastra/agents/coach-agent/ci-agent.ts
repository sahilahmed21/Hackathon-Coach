import { Agent } from "@mastra/core/agent";
import { model } from "../../config";
import { ciTool } from "./ci-tool";

export const CiAgent = new Agent({
    name: "CiAgent",
    instructions: `
You monitor CI build status in GitHub Actions.
Use ciTool with repo owner/name to fetch latest build and return its status and link.
`,
    model,
    tools: { ciTool },
});
