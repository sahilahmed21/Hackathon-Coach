import fs from "fs";
import { mastra } from "../mastra";

async function main() {
    const run = await mastra.getWorkflow("coachWorkflow").createRunAsync();

    const res = await run.start({
        inputData: { topic: "portfolio optimizer" },
    });

    if (res.status === "success") {
        const { ideas, plan, url, readmeUrl } = res.result;

        console.log({ ideas, plan, url, readmeUrl });

        const memoryPath = "./project-memory.json";
        const oldHistory = fs.existsSync(memoryPath)
            ? JSON.parse(fs.readFileSync(memoryPath, "utf-8"))
            : [];
        const updatedHistory = [...oldHistory, res.result];
        fs.writeFileSync(memoryPath, JSON.stringify(updatedHistory, null, 2));

        console.log("💾 Project saved to memory.");
    } else if (res.status === "failed") {
        console.error("❌ Run failed:", res.error);
    } else {
        console.error("❌ Run suspended:", res);
    }
}

main();
