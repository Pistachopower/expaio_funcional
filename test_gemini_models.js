import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Manually load env vars if dotenv isn't enough or for Vite envs
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API key found. Please set VITE_GEMINI_API_KEY.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Note: The SDK doesn't have a direct 'listModels' helper exposed easily in all versions without admin usage,
        // but usually we can try to query or just test specific ones.
        // Actually, newer SDKs usually don't have listModels on the client instance easily effectively without valid setup.
        // A better check is to try a simple generation with a fallback.

        // Let's try 'gemini-1.5-flash-001' which is more specific.
        console.log("Testing gemini-1.5-flash-001...");
        const model001 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result001 = await model001.generateContent("Hello");
        console.log("gemini-1.5-flash-001 works:", result001.response.text());

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
