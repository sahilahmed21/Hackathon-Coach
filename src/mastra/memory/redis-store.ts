import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { fastembed } from "@mastra/fastembed"; // optional for semantic recall



export const memory = new Memory({
    // For simple persistent message memory:
    storage: new LibSQLStore({
        url: process.env.DATABASE_URL || "file:mastra-memory.db",
    }),

    // Optional semantic vector recall support:
    vector: new LibSQLVector({
        connectionUrl: process.env.DATABASE_URL || "file:mastra-memory.db",
    }),
    embedder: fastembed,

    options: {
        threads: { generateTitle: true },           // auto-generate thread titles
        lastMessages: 10,                           // retain recent messages
        semanticRecall: { topK: 3, messageRange: 2 } // retrieve similar past messages
    },
});
