// src/sharedMemory.ts
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const sharedMemory = new Memory({
    storage: new LibSQLStore({ url: "file:./memory.db" }),
    options: {
        workingMemory: { enabled: true },
        threads: { generateTitle: true },
        lastMessages: 10,
    },
});
