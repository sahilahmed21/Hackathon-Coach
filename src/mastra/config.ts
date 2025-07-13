// src/mastra/config.ts

import dotenv from "dotenv";
import { google } from "@ai-sdk/google";       // ✅ correct import
// import { generateText } from "ai";            // for example usage

dotenv.config();

// 1. Use correct environment variable for key & model
const MODEL_NAME = process.env.GEMINI_MODEL_NAME ?? "gemini-1.5-flash-latest";

// 2. Initialize the Google provider with default API key handling
// You can optionally pass fetch or custom options via createGoogleGenerativeAI()
// but default `google()` uses GOOGLE_GENERATIVE_AI_API_KEY environment variable :contentReference[oaicite:1]{index=1}
export const model = google(MODEL_NAME);

// // 3. Log to confirm setup
// console.log("✅ Model Provider: Google Gemini");
// console.log("✅ Model Name:", MODEL_NAME);

// // 4. (Optional) Example usage with ai-sdk generateText
// async function test() {
//   const { text } = await generateText({
//     model,
//     prompt: "Hello from Gemini! How are you today?",
//     // Optional provider-specific settings:
//     // providerOptions: { google: { thinkingConfig: { thinkingBudget: 512 } } }
//   });
//   console.log("🚀 AI says:", text);
// }

// test();
