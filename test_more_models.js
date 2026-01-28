import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const models = ["gemini-2.0-flash-lite-001", "gemini-2.5-flash"];

    for (const modelName of models) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`${modelName} works:`, result.response.text());
        } catch (error) {
            console.error(`${modelName} failed:`, error.message);
        }
    }
}

testModels();
