import express, {Request, Response} from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
import cors from "cors";
import { fetch } from 'undici';
const app = express();
import jwt from 'jsonwebtoken';

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate idea list endpoint
app.post("/generate-idea-list", async (req, res) => {
  const { topics, notes, userIdea } = req.body;
  console.log(`Topics: ${topics}\nNote: ${notes}\nUser Prompt: ${userIdea}`);

  if (
    (!topics || !Array.isArray(topics) || topics.length === 0) &&
    (!userIdea || userIdea.trim() === "")
  ) {
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
    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
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
      const errorText = await ollamaResponse.text();
      throw new Error(`Ollama API error: ${ollamaResponse.status} - ${errorText}`);
    }

    const responseText = await ollamaResponse.text();
    try {
      const data = JSON.parse(responseText);
      console.log(data);
      res.json({data, prompt});
    } catch (parseError) {
      res.json({
        success: false,
        message: "Ollama did not return valid JSON",
        raw: responseText
      });
    }
  } catch (err: any) {
    console.error("Ollama API error:", err);

    if (err.message && err.message.includes("ECONNREFUSED")) {
       res.status(503).json({
        error: "Cannot connect to Ollama server. Is it running on port 11434?"
      });
       return;
    }

    res.status(500).json({ error: err.message });
  }
});

// Generate single idea endpoint
app.post("/generate-idea", async (req, res) => {
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

  try{
    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
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
    if(!ollamaResponse.ok){
      res.status(500).json({error: "Couldnt generate content"});
      return;
    }
    const responseText = await ollamaResponse.text();
    try{
      const data = JSON.parse(responseText);
      console.log(data);
      res.json({data});
      return;
    }catch(error){
      res.status(500).json({error: error});
      return;
    }
  } catch (error){
    console.log(error);
    res.status(500).json({error: "Internal server error"});
    return;
  }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


app.post("/api/save-idea", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) { res.status(401).json({ error: "Missing auth header" }); return;}

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.decode(token); // or use jwt.verify if you want to validate

    const clerkUserId = decoded?.sub;
    const email = decoded?.email;

    if (!clerkUserId || !email) {
       res.status(400).json({ error: "Invalid token structure" }); return;
    }

    const { idea_name, idea } = req.body;
    console.log({
        user_id: clerkUserId,
        user_name: email,
        idea_name: idea_name,
        idea: idea
      })
    const { data, error } = await supabase.from("saved_ideas").insert([
      {user_id: clerkUserId.toString(),
      user_name: email,
      idea_name: idea_name,
      idea: idea}
    ]).select();

    if (error) {
      console.error("Supabase insert error:", error);
      { res.status(500).json({ error: error.message }); return;}
    }

    res.json({ success: true, data });
    return;
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});