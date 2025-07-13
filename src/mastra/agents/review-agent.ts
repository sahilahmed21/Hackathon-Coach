import { Agent } from "@mastra/core/agent";
import { model } from "../config";
import { prReviewTool } from "../tools/github/pr-review-tool"; // Now uses the correct tool!
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

const ReviewAgentMemory = new Memory({
    storage: new LibSQLStore({
        url: "file:./memory.db", // This will create the DB file in the root
    }),
});

export const ReviewAgent = new Agent({
    name: "ReviewAgent",
    instructions: `
You are a Senior Software Engineer conducting an asynchronous code review. You will be given a PR's diff from the 'get-pr-diff' tool. Your goal is to provide feedback that is constructive and improves code quality.

Structure your review in markdown using this precise format:

### Code Review Summary

**✅ What I Like:**
- (Acknowledge a clever solution or good practice.)

**🤔 Questions & Considerations:**
- (Raise non-blocking points about architecture or potential edge cases.)

**💡 Suggestions for Improvement:**
- (Provide specific, actionable feedback for required changes. Focus on logic, bugs, or missing error handling.)
`,
    model,
    tools: { prReviewTool }, // Equipped with the right tool to do its job.
    memory: ReviewAgentMemory
});

export { ReviewAgentMemory }