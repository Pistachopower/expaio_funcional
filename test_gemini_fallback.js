import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Manually load env vars if dotenv isn't enough or for Vite envs
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API key found. Please set VITE_GEMINI_API_KEY.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testFallback() {
    try {
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro works:", result.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error);
    }
}

testFallback();
