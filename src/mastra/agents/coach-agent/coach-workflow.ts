// src/mastra/agents/coach-agent/coach-workflow.ts
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { CoachAgent } from "./coach-agent";
import { PlannerAgent } from "./planner-agent";
import { CodeAgent } from "./code-agent";
import readline from "readline";

const askCLI = (question: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
};


// Step 1 – Ideation
const ideateStep = createStep({
    id: "ideate",
    inputSchema: z.object({ topic: z.string() }),
    outputSchema: z.object({ ideas: z.array(z.string()) }),
    execute: async ({ inputData, mastra }) => {
        const result = await mastra.getAgent("CoachAgent").generate(
            [{ role: "user", content: inputData.topic }],
            { output: z.object({ text: z.string() }) } // expecting 'text', not 'ideas'
        );

        const rawText = result.object.text;
        const ideas = rawText
            .split("\n")
            .map(line => line.trim().replace(/^\d+\.\s*/, "")) // Remove leading numbers like "1. "
            .filter(Boolean);

        return { ideas };
    },
});

// Step 2 – Planning
const planAndRateStep = createStep({
    id: "planAndRate",
    inputSchema: z.object({ ideas: z.array(z.string()) }),
    outputSchema: z.object({
        plan: z.array(z.string()),
        ideas: z.array(z.string())
    }),
    execute: async ({ inputData, mastra }) => {
        let approved = false;
        let plan: string[] = [];
        const idea = inputData.ideas[0];

        while (!approved) {
            const result = await mastra.getAgent("PlannerAgent").generate(
                [{ role: "user", content: idea }],
                { output: z.object({ plan: z.array(z.string()) }) }
            );

            plan = result.object.plan;

            console.log("🧠 Proposed Plan:");
            plan.forEach((p, i) => console.log(`${i + 1}. ${p}`));
            const feedback = await askCLI("Do you approve this plan? (yes/no): ");
            approved = feedback.toLowerCase() === "yes";

            if (!approved) {
                console.log("🔁 Regenerating new plan...");
            }
        }

        return { plan, ideas: inputData.ideas };
    },
});

// Wrapper step to inject `idea` into the original codeStep
const scaffoldStep = createStep({
    id: "scaffold",
    inputSchema: z.object({
        plan: z.array(z.string()),
        ideas: z.array(z.string())
    }),
    outputSchema: z.object({
        ideas: z.array(z.string()),
        plan: z.array(z.string()),
        url: z.string(),
        readmeUrl: z.string()
    }),
    execute: async ({ inputData, mastra }) => {
        const idea = inputData.plan[0];
        const res = await mastra.getAgent("CodeAgent").generate(
            [{ role: "user", content: idea }],
            { output: z.object({ url: z.string(), readmeUrl: z.string() }) }
        );
        return {
            ideas: inputData.ideas,
            plan: inputData.plan,
            url: res.object.url,
            readmeUrl: res.object.readmeUrl
        };
    }
});

export const coachWorkflow = createWorkflow({
    id: "coachWorkflow",
    description: "Ideate → plan → scaffold code",
    inputSchema: z.object({ topic: z.string() }),
    outputSchema: z.object({
        ideas: z.array(z.string()),
        plan: z.array(z.string()),
        url: z.string(),
        readmeUrl: z.string(),
    }),
})
    .then(ideateStep)
    .then(planAndRateStep)
    .then(scaffoldStep)
    .commit();