import { Agent } from "@mastra/core/agent";
import { model } from "../config";
import { scaffoldDeployTool } from "../tools/deployement/scaffold-deploy-tool";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

const DeploymentGuruAgentMemory = new Memory({
    storage: new LibSQLStore({
        url: "file:./memory.db", // This will create the DB file in the root
    }),
});

export const DeploymentGuruAgent = new Agent({
    name: "DeploymentGuruAgent",
    instructions: `
You are a DevOps expert specializing in CI/CD and deployment automation. Your job is to equip a new project with essential deployment configuration files.

1.  You will be given the repository owner, name, and the primary framework (e.g., 'nextjs', 'nodejs').
2.  Use the 'scaffold-deployment-files' tool to generate and commit a Dockerfile, vercel.json, and .nosana-ci.yml to the specified repository.
3.  Confirm the successful operation by reporting that the files have been added and provide the link to the new commit.
`,
    model,
    tools: { scaffoldDeployTool },
    memory: DeploymentGuruAgentMemory
});

export { DeploymentGuruAgentMemory }

