// src/index.ts
import { Mastra } from "@mastra/core/mastra";
import { sharedMemory } from "./sharedMemory";

import { CoachAgent } from "./agents/coach-agent/coach-agent";
import { PlannerAgent } from "./agents/coach-agent/planner-agent";
import { CodeAgent } from "./agents/coach-agent/code-agent";
import { CiAgent } from "./agents/coach-agent/ci-agent"; // Assuming this is correct

// Add this import for your ReviewAgent
import { ReviewAgent } from "./agents/coach-agent/review-agent"; // <--- ADD THIS LINE

import { coachWorkflow } from "./agents/coach-agent/coach-workflow";

export const mastra = new Mastra({
	// Add ReviewAgent here
	agents: { CoachAgent, PlannerAgent, CodeAgent, CiAgent, ReviewAgent }, // <--- ADD ReviewAgent HERE
	workflows: { coachWorkflow },
	storage: sharedMemory.storage,
});