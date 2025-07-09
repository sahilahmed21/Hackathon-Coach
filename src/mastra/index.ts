import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { sharedMemory } from "./sharedMemory";

import { ProjectCoachAgent } from "./agents/ProjectCoachAgent";
import { ReviewAgent } from "./agents/review-agent";
import { CiAgent } from "./agents/ci-agent";

export const mastra = new Mastra({
	agents: {
		ProjectCoachAgent,
		ReviewAgent,
		CiAgent
	},

	workflows: {},

	storage: sharedMemory.storage,

	logger: new PinoLogger({
		name: "HackathonCoach",
		level: "info",
	}),

	server: {
		port: 8080,
		timeout: 15000,
	},
});