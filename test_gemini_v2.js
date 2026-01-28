import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testV2() {
    try {
        console.log("Testing gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello");
        console.log("gemini-2.0-flash works:", result.response.text());
    } catch (error) {
        console.error("gemini-2.0-flash failed:", error);
    }
}

testV2();
