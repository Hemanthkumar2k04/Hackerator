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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const together_ai_1 = __importDefault(require("together-ai"));
const app = (0, express_1.default)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
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
    var _a, e_1, _b, _c;
    var _d, _e, _f, _g;
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
        // console.log(prompt);
        let str = "";
        const together = new together_ai_1.default({
            apiKey: process.env.TOGETHER_API_KEY || 'your-together-api-key',
        });
        // First Together AI call (streaming)
        const resp = yield together.chat.completions.create({
            messages: [
                { role: "system", content: "You are an AI that helps generate hackathon project ideas." },
                { role: "user", content: prompt }
            ],
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            stream: true,
        });
        try {
            for (var _h = true, resp_1 = __asyncValues(resp), resp_1_1; resp_1_1 = yield resp_1.next(), _a = resp_1_1.done, !_a; _h = true) {
                _c = resp_1_1.value;
                _h = false;
                const chunk = _c;
                // use process.stdout.write instead of console.log to avoid newlines
                if ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) {
                    str += chunk.choices[0].delta.content;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_h && !_a && (_b = resp_1.return)) yield _b.call(resp_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Second Together AI call (non-streaming) - replacing Ollama
        const togetherResponse = yield together.chat.completions.create({
            messages: [
                { role: "user", content: prompt }
            ],
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", // or use a different model if needed
            stream: false,
            temperature: 0.7,
            max_tokens: 1000
        });
        // Extract the response content
        const responseContent = (_g = (_f = togetherResponse.choices[0]) === null || _f === void 0 ? void 0 : _f.message) === null || _g === void 0 ? void 0 : _g.content;
        if (!responseContent) {
            throw new Error("No response content received from Together AI");
        }
        // Try to parse as JSON (if your prompt expects JSON response)
        try {
            const data = JSON.parse(responseContent);
            console.log(data);
            res.json({ data, prompt });
        }
        catch (parseError) {
            // If it's not JSON, return the raw response
            res.json({
                success: false,
                message: "Together AI did not return valid JSON",
                raw: responseContent
            });
        }
    }
    catch (err) {
        console.error("Together AI error:", err);
        // Handle different types of errors
        if (err.message && err.message.includes("API key")) {
            res.status(401).json({
                error: "Invalid or missing Together AI API key"
            });
            return;
        }
        if (err.message && err.message.includes("rate limit")) {
            res.status(429).json({
                error: "Rate limit exceeded. Please try again later."
            });
            return;
        }
        if (err.message && err.message.includes("timeout")) {
            res.status(504).json({
                error: "Request timeout. Please try again."
            });
            return;
        }
        res.status(500).json({ error: err.message });
    }
}));
// Generate single idea endpoint
app.post("/generate-idea", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
- Adapt the content to match any constraints or notes provided by the user (e.g., "Only use Python", "No Firebase", etc.).
User Input:
Project Idea: "${idea}"
Notes / Constraints: "${finalPrompt}"
`;
    try {
        const together = new together_ai_1.default({
            apiKey: process.env.TOGETHER_API_KEY || 'your-together-api-key',
        });
        const togetherResponse = yield together.chat.completions.create({
            messages: [
                { role: "system", content: "You are an AI assistant that generates detailed hackathon project blueprints. Respond only in valid JSON format." },
                { role: "user", content: prompt }
            ],
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            stream: false,
            temperature: 0.7,
            max_tokens: 2000
        });
        // Extract the response content
        const responseContent = (_b = (_a = togetherResponse.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!responseContent) {
            res.status(500).json({ error: "No response content received from Together AI" });
            return;
        }
        try {
            // Try to parse the response as JSON
            let data;
            // Check if response is wrapped in code blocks
            const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/);
            const jsonString = jsonMatch ? jsonMatch[1] : responseContent;
            data = JSON.parse(jsonString);
            // Validate that required fields are present
            if (!data.success || !data.name || !data.summary) {
                throw new Error("Response missing required fields");
            }
            console.log("Generated project data:", data);
            res.json({ data });
            return;
        }
        catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.error("Raw response:", responseContent);
            res.status(500).json({
                error: "Failed to parse response as JSON",
                raw: responseContent
            });
            return;
        }
    }
    catch (error) {
        console.error("Together AI error:", error);
        // Handle different types of errors
        if (error.message && error.message.includes("API key")) {
            res.status(401).json({
                error: "Invalid or missing Together AI API key"
            });
            return;
        }
        if (error.message && error.message.includes("rate limit")) {
            res.status(429).json({
                error: "Rate limit exceeded. Please try again later."
            });
            return;
        }
        if (error.message && error.message.includes("timeout")) {
            res.status(504).json({
                error: "Request timeout. Please try again."
            });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
app.post("/api/save-idea", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: "Missing auth header" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.decode(token); // or use jwt.verify if you want to validate
        const clerkUserId = decoded === null || decoded === void 0 ? void 0 : decoded.sub;
        const email = decoded === null || decoded === void 0 ? void 0 : decoded.email;
        if (!clerkUserId || !email) {
            res.status(400).json({ error: "Invalid token structure" });
            return;
        }
        const { idea_name, idea } = req.body;
        console.log({
            user_id: clerkUserId,
            user_name: email,
            idea_name: idea_name,
            idea: idea
        });
        const { data, error } = yield supabase.from("saved_ideas").insert([
            { user_id: clerkUserId.toString(),
                user_name: email,
                idea_name: idea_name,
                idea: idea }
        ]).select();
        if (error) {
            console.error("Supabase insert error:", error);
            {
                res.status(500).json({ error: error.message });
                return;
            }
        }
        res.json({ success: true, data });
        return;
    }
    catch (err) {
        console.error("Backend error:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
