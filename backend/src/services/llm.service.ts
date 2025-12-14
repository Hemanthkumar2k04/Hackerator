import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateProjectPlan = async (idea: string, domain?: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemPrompt = `
You are Hackerator’s Project Mode Assistant.

Your job is to take the user's natural-language project idea and convert it into a clear, concise, editable high-level project definition.

The goal of Project Mode is to create a lightweight but complete project overview that the user can adjust before generating phases in the Workspace.

TEAM CONSIDERATIONS:
- Default team size is 1 person solo developer.
- Consider team capacity when recommending tech complexity and architecture.
- Adjust scope and technology choices based on expected team size capacity.

RULES:
- You MUST respond ONLY with valid JSON using the exact schema below.
- Do NOT include anything outside the JSON.
- All fields must be short, editable, and beginner-friendly.
- Do NOT generate detailed phases or granular tasks—that happens in Workspace mode.
- The tech stack MUST include ALL end-to-end technologies required to build and deploy the full solution.
- Keep explanations simple and high-level.

JSON SCHEMA (return exactly this structure):

{
  "project_title": "A short, catchy project title",
  "short_summary": "2–3 sentence overview connecting the idea with the selected domain(s)",
  "problem_statement": "Clear description of the primary problem being solved",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "target_users": ["Primary audience 1", "Audience 2"],
  "team_size": 1,
  "tech_stack": {
    "frontend": ["Frameworks, UI libraries, state management, styling systems"],
    "backend": ["APIs, frameworks, languages"],
    "database": ["SQL/NoSQL options, ORM suggestions"],
    "devops": ["Hosting, CI/CD, deployment platforms, containers"],
    "authentication": ["Auth providers, protocols, libraries"],
    "storage": ["File/object storage systems"],
    "APIs_and_integrations": ["Third-party APIs, external services"],
    "testing": ["Unit, integration, and end-to-end testing tools"],
    "monitoring_and_logging": ["Monitoring, analytics, crash reporting tools"],
    "other_tools": ["Any additional libraries or utilities relevant to the domain(s)"]
  },
  "architecture_overview": "A high-level explanation of how the whole system works, from frontend to backend to database and deployment",
  "estimated_timeline": "A rough time estimate (e.g., '3–5 weeks')",
  "notes": "Useful suggestions, assumptions, or considerations based on the domain(s)"
}
}

GENERATION GUIDELINES:
- Use the selected domain(s) to influence features, tech stack, architecture, and summary.
- The tech stack MUST include complete end-to-end technologies, from frontend → backend → database → auth → deployment → monitoring.
- Keep all sections concise but meaningful.
- Do NOT over-engineer or include enterprise tools unless the domain requires it.
- Output MUST be valid JSON.

`;

  const prompt = `User Idea: ${idea}${domain ? `\nDomain: ${domain}` : ''}`;

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] }
    ],
    generationConfig: {
        responseMimeType: "application/json",
    }
  });

  const response = result.response;
  const text = response.text();
  return JSON.parse(text);
};

export const generateExecutionPlan = async (
  projectJson: any,
  mode: string,
  teamSize: number,
  originalIdea: string
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemPrompt = `
You are Hackerator’s Workspace Execution Planner.

Your job is to transform a finalized project description into an actionable, phase-based execution plan.  
You must always output a structured JSON object defining:

1. The number of nodes (phases)
2. Each node’s title
3. Each node’s purpose summary
4. Each node’s detailed task list
5. Estimated time to complete each node
6. Task assignment split across the team size provided

IMPORTANT CONTEXT YOU RECEIVE:
- project_json → the finalized Phase 2 project definition (problem, features, tech stack, architecture, etc.)
- mode → "project" or "hackathon"
- team_size → integer >= 1
- original_idea → raw user idea

BEHAVIOR RULES:
- If mode = "project": Produce 4–8 phases covering setup → core feature build → persistence → polish → deploy.
- If mode = "hackathon": Produce 3–5 phases focused on speed (setup → MVP build → integrations → polish/demo).
- Align all phases with the project’s key_features and tech_stack.
- Complex or multi-step tasks must be broken down into smaller, clear actionables.
- Every task MUST be specific, actionable, and beginner-friendly.

TEAM SPLITTING RULES:
- If team_size = 1: Assign all tasks to "member_1".
- If team_size > 1:  
  - Split tasks across members so work happens in parallel.  
  - Backend-heavy tasks → earlier team members  
  - Frontend/UI tasks → mid-range team members  
  - Documentation, optimization, polish → final team members  
  - Always balance workload across members.  
- Every task must contain a "assigned_to" field such as "member_2".

ESTIMATED COMPLETION TIME:
- Give realistic time per node based on complexity AND mode.
- Hackathon mode uses compressed time estimates (hours).
- Project mode uses days or weeks.

FINAL OUTPUT FORMAT (strict JSON ONLY):

{
  "nodes": [
    {
      "node_id": "phase_1",
      "title": "string",
      "summary": "1–2 sentence purpose summary",
      "estimated_time": "e.g., '6 hours', '2–3 days'",
      "tasks": [
        {
          "task_id": "string",
          "title": "string",
          "description": "1 sentence actionable step",
          "assigned_to": "member_1"
        }
      ]
    }
  ],
  "total_nodes": <number>
}

DO NOT include commentary, explanation, or text outside the JSON.

ONLY return valid JSON.
`;

  try {
    const prompt = `
Project JSON: ${JSON.stringify(projectJson)}
Mode: ${mode}
Team Size: ${teamSize}
Original Idea: ${originalIdea}
`;

    const result = await model.generateContent([systemPrompt, prompt]);
    const response = result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating execution plan:", error);
    throw error;
  }
};
