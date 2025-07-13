import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateDockerfile, generateNosanaCIConfig, generateVercelConfig } from "../../services/deploymentService";
import { pushFilesToRepo } from "../../services/githubService";

export const scaffoldDeployTool = createTool({
    id: "scaffold-deployment-files",
    description: "Generates and pushes standard deployment configuration files (Dockerfile, vercel.json, .nosana-ci.yml) to a repository.",
    inputSchema: z.object({
        owner: z.string(),
        repo: z.string(),
        framework: z.enum(["nextjs", "nodejs", "python"]),
    }),
    outputSchema: z.object({
        commitUrl: z.string(),
    }),
    execute: async ({ context }) => {
        const { owner, repo, framework } = context;
        const filesToPush = [
            { path: 'Dockerfile', content: generateDockerfile(framework) },
            { path: 'vercel.json', content: generateVercelConfig() },
            { path: '.nosana-ci.yml', content: generateNosanaCIConfig() }
        ];

        const commitUrl = await pushFilesToRepo(owner, repo, filesToPush, "feat: add deployment configuration");
        return { commitUrl };
    },
});