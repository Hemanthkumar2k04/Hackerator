"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const undici_1 = require("undici");
const app = (0, express_1.default)();
// Allow CORS from your frontend (adjust the origin as needed)
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Replace with your frontend URL/port
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-key';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Generate idea list endpoint
app.post("/generate-idea-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topics, notes, userIdea } = req.body;
    console.log(`Topics: ${topics}\nNote: ${notes}\nUser Prompt: ${userIdea}`);
    if ((!topics || !Array.isArray(topics) || topics.length === 0) &&
        (!userIdea || userIdea.trim() === "")) {
        res.status(400).json({ error: "Please provide topics or userIdea." });
        return;
    }
    let prompt = `You are an AI that helps generate hackathon project ideas.

Respond ONLY in the following JSON format:
{
  "success": true,
  "ideas": [
    { "topic": "<string>", "idea": "<string>" },
    ...
  ]
}

Rules:
- Generate exactly 4 ideas.
- Each idea should be short (1 line).
- Use the provided information to generate relevant topics and ideas.
- If no topic is given, infer a suitable topic from the user input.
`;
    if (topics && Array.isArray(topics) && topics.length > 0) {
        prompt += `\nTopics: ${topics.join(", ")}`;
    }
    if (userIdea && userIdea.trim() !== "") {
        prompt += `\nUser idea: "${userIdea}"`;
    }
    if (notes && notes.trim() !== "") {
        prompt += `\nAdditional notes: "${notes}"`;
    }
    try {
        console.log(prompt);
        const ollamaResponse = yield (0, undici_1.fetch)("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gemma3:4b",
                messages: [
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });
        if (!ollamaResponse.ok) {
            const errorText = yield ollamaResponse.text();
            throw new Error(`Ollama API error: ${ollamaResponse.status} - ${errorText}`);
        }
        const responseText = yield ollamaResponse.text();
        try {
            const data = JSON.parse(responseText);
            console.log(data);
            res.json({ data, prompt });
        }
        catch (parseError) {
            res.json({
                success: false,
                message: "Ollama did not return valid JSON",
                raw: responseText
            });
        }
    }
    catch (err) {
        console.error("Ollama API error:", err);
        if (err.message && err.message.includes("ECONNREFUSED")) {
            res.status(503).json({
                error: "Cannot connect to Ollama server. Is it running on port 11434?"
            });
            return;
        }
        res.status(500).json({ error: err.message });
    }
}));
// Generate single idea endpoint
app.post("/generate-idea", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idea, finalPrompt } = req.body;
    const prompt = `
You are an AI assistant that generates detailed hackathon project blueprints.

Based on the user's idea and constraints, respond ONLY in the following JSON format:

{
  "success": true,
  "name": "<Project Name>",
  "summary": "<One-line project summary>",
  "description": "<2-3 sentence description explaining what the project does, its purpose, and the technology involved>",
  "tech_stack": ["<List of tech/tools used>"],
  "roadmap": [
    "<Step 1: Task or milestone>",
    "<Step 2: Task or milestone>",
    "<Step 3: Task or milestone>"
  ],
  "extras": {
    "challenges": ["<List of potential technical or strategic blockers>"],
    "stretch_goals": ["<Extra features to improve or expand the project>"],
    "time_estimate": "<Estimated time to complete MVP (e.g., '12–16 hours')>"
  }
}

Rules:
- Always include all fields in the JSON, even if you infer or estimate them.
- Do not add any explanation or commentary — return only the JSON.
- Adapt the content to match any constraints or notes provided by the user (e.g., “Only use Python”, “No Firebase”, etc.).

User Input:
Project Idea: "${idea}"
Notes / Constraints: "${finalPrompt}"

`;
    try {
        const ollamaResponse = yield (0, undici_1.fetch)("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gemma3:4b",
                messages: [
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });
        if (!ollamaResponse.ok) {
            res.status(500).json({ error: "Couldnt generate content" });
            return;
        }
        const responseText = yield ollamaResponse.text();
        try {
            const data = JSON.parse(responseText);
            console.log(data);
            res.json({ data });
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
