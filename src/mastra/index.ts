import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { sharedMemory } from "./sharedMemory"; // Assuming you have this for storage

// Import all agents
import { ProjectCoachAgent } from "./agents/ProjectCoachAgent";
import { gitStatagent } from "./agents/gitstat-agent";
import { ReviewAgent } from "./agents/review-agent";
import { CiAgent } from "./agents/ci-agent";
import { GuardianAgent } from "./agents/GuardianAgent";
import { DeploymentGuruAgent } from "./agents/DeploymentGuruAgent";
import { HelpAgent } from "./agents/HelpAgent";

export const mastra = new Mastra({
	agents: {
		// Core Agents
		ProjectCoachAgent,
		ReviewAgent,
		CiAgent,
		gitStatagent,

		// New, Advanced Agents
		GuardianAgent,
		DeploymentGuruAgent,
		HelpAgent
	},

	workflows: {}, // You can build complex workflows combining these agents

	storage: sharedMemory.storage,

	logger: new PinoLogger({
		name: "HackathonCoach-Advanced",
		level: "info",
	}),
});

console.log("🚀 Hackathon Coach (Advanced Edition) is ready and loaded with extraordinary agents!");