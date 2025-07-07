// src/index.ts
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";

import { CoachAgent } from "./agents/coach-agent/coach-agent";
import { PlannerAgent } from "./agents/coach-agent/planner-agent";
import { CodeAgent } from "./agents/coach-agent/code-agent";
import { CiAgent } from "./agents/coach-agent/ci-agent";
import { coachWorkflow } from "./agents/coach-agent/coach-workflow";

export const mastra = new Mastra({
	agents: { CoachAgent, PlannerAgent, CodeAgent, CiAgent },
	workflows: { coachWorkflow },
	storage: new LibSQLStore({ url: "file:./memory.db" }), // ✅ Use storage adapter
});
