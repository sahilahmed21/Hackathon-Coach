import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import readline from "readline";

// Helper function to get user input from the command line
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

// Ensure GITHUB_USERNAME is defined
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
if (!GITHUB_USERNAME) {
    throw new Error("GITHUB_USERNAME environment variable is not set.");
}

// --- STEP 1: Ideate, Plan, and Scaffold the Repo ---
const initialScaffoldStep = createStep({
    id: "initial-scaffold",
    inputSchema: z.object({
        topic: z.string().describe("The initial project theme, e.g., 'AI note-taking app'"),
    }),
    outputSchema: z.object({
        githubUrl: z.string().url(),
        owner: z.string(),
        repo: z.string(),
        framework: z.string(),
        description: z.string(),
    }),
    execute: async ({ inputData, mastra }) => {
        console.log(`🤖 CoachAgent: Generating idea and scaffolding project for topic: "${inputData.topic}"...`);

        const result = await mastra.getAgent("ProjectCoachAgent").generate(
            [{ role: "user", content: inputData.topic }],
            {
                output: z.object({
                    url: z.string().url(),
                    name: z.string(),
                    description: z.string(),
                }),
            }
        );

        // Extract repo name from the URL, but use GITHUB_USERNAME for owner
        const urlParts = new URL(result.object.url).pathname.split('/').filter(Boolean);
        const repo = urlParts[1]; // Repo name is second part of the path
        const framework = "nextjs";

        console.log(`✅ Repo created: ${result.object.url}`);

        return {
            githubUrl: result.object.url,
            owner: GITHUB_USERNAME, // Use environment variable
            repo,
            framework,
            description: result.object.description,
        };
    },
});

// --- STEP 2: Interactive User Choice ---
const userChoiceStep = createStep({
    id: "interactive-choice",
    inputSchema: z.object({
        githubUrl: z.string().url(),
        owner: z.string(),
        repo: z.string(),
        framework: z.string(),
        description: z.string(),
    }),
    outputSchema: z.object({
        choice: z.enum(["security", "deployment"]),
        projectData: z.object({
            owner: z.string(),
            repo: z.string(),
            framework: z.string(),
        }),
    }),
    execute: async ({ inputData }) => {
        console.log("\n🤔 What would you like to do next?");
        const choice = await askCLI("1. Scan for security issues\n2. Set up deployment files\nEnter choice (1 or 2): ");

        if (choice !== '1' && choice !== '2') {
            throw new Error("Invalid choice. Please run the workflow again.");
        }

        return {
            choice: (choice === '1' ? 'security' : 'deployment') as "security" | "deployment",
            projectData: {
                owner: inputData.owner, // This will be GITHUB_USERNAME from previous step
                repo: inputData.repo,
                framework: inputData.framework,
            },
        };
    },
});

// --- STEP 3: Execute the Chosen Follow-Up Task (Final Step) ---
const executeChoiceStep = createStep({
    id: "execute-follow-up",
    inputSchema: z.object({
        choice: z.enum(["security", "deployment"]),
        projectData: z.object({
            owner: z.string(),
            repo: z.string(),
            framework: z.string(),
        }),
    }),
    outputSchema: z.object({
        message: z.string(),
    }),
    execute: async ({ inputData, mastra }) => {
        const { choice, projectData } = inputData;

        switch (choice) {
            case 'security':
                console.log(`🛡️ GuardianAgent: Scanning repository for security issues...`);
                await mastra.getAgent("GuardianAgent").generate(
                    [{ role: "user", content: `Scan the repo with owner '${projectData.owner}' and name '${projectData.repo}'.` }]
                );
                break;
            case 'deployment':
                console.log(`🚀 DeploymentGuru: Scaffolding deployment files...`);
                await mastra.getAgent("DeploymentGuruAgent").generate(
                    [{ role: "user", content: `Add deployment files for a '${projectData.framework}' project to the repo '${projectData.repo}' owned by '${projectData.owner}'.` }]
                );
                break;
        }

        const finalMessage = `🎉 All done! Your project "${projectData.repo}" has been scaffolded and the "${choice}" task is complete.`;
        console.log(finalMessage);
        return { message: finalMessage };
    },
});

// --- Assemble the Workflow ---
export const hackathonCoachWorkflow = createWorkflow({
    id: "hackathon-coach-workflow",
    description: "A full, interactive workflow from ideation to a ready-to-code, analyzed, and deployed project.",
    inputSchema: z.object({
        topic: z.string(),
    }),
    outputSchema: z.object({
        message: z.string(),
    }),
})
    .then(initialScaffoldStep)
    .then(userChoiceStep)
    .then(executeChoiceStep)
    .commit();