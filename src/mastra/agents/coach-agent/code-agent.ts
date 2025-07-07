// src/mastra/agents/coach-agent/code-agent.ts
import { Agent } from "@mastra/core/agent";
import { model } from "../../config";
import { githubTool } from "./github-tool";

export const CodeAgent = new Agent({
    name: "CodeAgent",
    instructions: `
    You are a code scaffold agent.
    When user provides a project name, decide repo name and privacy.
    Use github-tool to create the repo and README.
    Respond with the repo URL and README link.
    `,
    model,
    tools: { githubTool },
});
