import express, {Request, Response} from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
import cors from "cors";
import { fetch } from 'undici';
import Together from 'together-ai';
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
  // console.log(prompt);
  let str = "";
  const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY || 'your-together-api-key',
  });

  // First Together AI call (streaming)
  const resp = await together.chat.completions.create({
    messages: [
      { role: "system", content: "You are an AI that helps generate hackathon project ideas." },
      { role: "user", content: prompt }
    ],
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    stream: true,
  });

  for await (const chunk of resp) {
    // use process.stdout.write instead of console.log to avoid newlines
    if(chunk.choices[0]?.delta?.content){
      str += chunk.choices[0].delta.content;
    }
  }

  // Second Together AI call (non-streaming) - replacing Ollama
  const togetherResponse = await together.chat.completions.create({
    messages: [
      { role: "user", content: prompt }
    ],
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", // or use a different model if needed
    stream: false,
    temperature: 0.7,
    max_tokens: 1000
  });

  // Extract the response content
  const responseContent = togetherResponse.choices[0]?.message?.content;
  
  if (!responseContent) {
    throw new Error("No response content received from Together AI");
  }

  // Try to parse as JSON (if your prompt expects JSON response)
  try {
    const data = JSON.parse(responseContent);
    console.log(data);
    res.json({ data, prompt });
  } catch (parseError) {
    // If it's not JSON, return the raw response
    res.json({
      success: false,
      message: "Together AI did not return valid JSON",
      raw: responseContent
    });
  }

} catch (err: any) {
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
- Adapt the content to match any constraints or notes provided by the user (e.g., "Only use Python", "No Firebase", etc.).
User Input:
Project Idea: "${idea}"
Notes / Constraints: "${finalPrompt}"
`;

  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY || 'your-together-api-key',
    });

    const togetherResponse = await together.chat.completions.create({
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
    const responseContent = togetherResponse.choices[0]?.message?.content;
    
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
      
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", responseContent);
      
      res.status(500).json({ 
        error: "Failed to parse response as JSON",
        raw: responseContent 
      });
      return;
    }
    
  } catch (error: any) {
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