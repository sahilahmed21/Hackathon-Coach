import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { hackathonCoachWorkflow } from "./workflows/coach-workflow";
import { ProjectCoachAgent } from "./agents/ProjectCoachAgent";
import { gitStatagent } from "./agents/gitstat-agent";
import { ReviewAgent } from "./agents/review-agent";
import { CiAgent } from "./agents/ci-agent";
import { GuardianAgent } from "./agents/GuardianAgent";
import { DeploymentGuruAgent } from "./agents/DeploymentGuruAgent";
import { HelpAgent } from "./agents/HelpAgent";

export const mastra = new Mastra({
	agents: {
		ProjectCoachAgent,
		ReviewAgent,
		CiAgent,
		gitStatagent,
		GuardianAgent,
		DeploymentGuruAgent,
		HelpAgent

	},

	workflows: {
		hackathonCoachWorkflow, // The main workflow for the hackathon coach
	},


	logger: new PinoLogger({
		name: "HackathonCoach-Advanced",
		level: "info",
	}),
});

console.log("🚀 Hackathon Coach (Advanced Edition) is ready and loaded with extraordinary agents!");