import axios from 'axios';
import { config } from '../config.ts';
import {
  IntermediateIdeaSchema,
  TaskDistributionSchema,
  type IntermediateIdea,
  type TaskDistribution,
  type TeamInfo,
  type TeamMember,
} from '../schemas.ts';

/**
 * Get available Gemini models
 */
export async function getAvailableModels(): Promise<string[]> {
  const models: string[] = [];

  // Get Gemini models if API key is available
  if (config.GEMINI_API_KEY) {
    try {
      const geminiResponse = await axios.get('https://generativelanguage.googleapis.com/v1beta/models', {
        params: { key: config.GEMINI_API_KEY },
      });
      
      const geminiModels = geminiResponse.data.models
        .filter((m: { displayName: string }) => m.displayName.includes('Gemini'))
        .map((m: { name: string }) => m.name.replace('models/', ''));
      
      models.push(...geminiModels);
      console.log(`[Models] Loaded ${geminiModels.length} Gemini models`);
    } catch (error) {
      console.warn('[Models] Failed to fetch Gemini models:', error);
    }
  }

  return models.length > 0 ? models : ['gemini-1.5-pro'];
}

async function callLLM(prompt: string, model?: string, maxTokens?: number): Promise<string> {
  const selectedModel = model || 'gemini-1.5-pro';
  const tokens = maxTokens || 12000;

  if (!config.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  return callGemini(prompt, selectedModel, tokens);
}

/**
 * Call Gemini API
 */
async function callGemini(prompt: string, model: string, maxTokens: number): Promise<string> {
  try {
    console.log(`[Gemini] Calling ${model} with ${maxTokens} max tokens...`);
    const startTime = Date.now();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        },
        systemInstruction: {
          parts: [
            {
              text: 'You are a creative hackathon ideation assistant. Respond with valid JSON only, no markdown.',
            },
          ],
        },
      },
      {
        params: { key: config.GEMINI_API_KEY },
        timeout: 30000,
      }
    );

    const duration = Date.now() - startTime;
    console.log(`[Gemini] Response received in ${duration}ms`);

    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log(`[Gemini] Content length: ${content.length} characters`);
    return content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[Gemini] Axios error: ${error.code} - ${error.message}`);
      if (error.response) {
        console.error(`[Gemini] Response status: ${error.response.status}`);
      }
      throw new Error(`Gemini call failed: ${error.message}`);
    }
    console.error(`[Gemini] Error:`, error);
    throw error;
  }
}

/**
 * Generate an intermediate idea from user input and optional file summary
 */
export async function generateIdea(
  inputText: string,
  uploadedFileSummary?: string,
  model?: string
): Promise<IntermediateIdea> {
  const fileContext = uploadedFileSummary
    ? `\n\nFile context:\n${uploadedFileSummary}`
    : '';

  const prompt = `You are a creative hackathon ideation assistant. Use the user's text input and optional image/pdf context (if provided) to generate a short, editable idea suitable for a hackathon (24–72h). Respond ONLY in valid JSON with no markdown backticks or additional text:

${fileContext}

User input:
${inputText}

Respond with ONLY this JSON structure:
{
  "idea_title": "max 6 words",
  "idea_summary": "1–2 lines describing core idea",
  "unique_selling_point": "one line USP"
}`;

  const response = await callLLM(prompt, model);

  try {
    const jsonStr = extractJSON(response);
    const parsed = JSON.parse(jsonStr);
    return IntermediateIdeaSchema.parse(parsed);
  } catch (error) {
    console.error('Failed to parse LLM response:', response);
    console.error('Parse error:', error);
    throw new Error(`Invalid response format from LLM: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper: Extract and clean JSON from LLM response
 */
function extractJSON(response: string): string {
  let jsonStr = response.trim();

  // Remove markdown code blocks
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  }
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  // Try to find JSON object boundaries if response has extra text
  const jsonStart = jsonStr.indexOf('{');
  const jsonEnd = jsonStr.lastIndexOf('}');

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
    jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
  }

  // If JSON appears incomplete, try to repair it
  // Count opening and closing brackets
  const openBraces = (jsonStr.match(/{/g) || []).length;
  const closeBraces = (jsonStr.match(/}/g) || []).length;
  const openBrackets = (jsonStr.match(/\[/g) || []).length;
  const closeBrackets = (jsonStr.match(/\]/g) || []).length;

  // Try to close incomplete structures
  if (openBraces > closeBraces || openBrackets > closeBrackets) {
    console.warn('Attempting to repair incomplete JSON...');
    // Add missing closing brackets
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      jsonStr += ']';
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      jsonStr += '}';
    }
  }

  return jsonStr;
}

/**
 * Helper: Fix missing required fields in task distribution
 */
function fixTaskDistribution(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;

  const obj = data as Record<string, unknown>;

  if (Array.isArray(obj.phases)) {
    obj.phases = obj.phases.map((phase: unknown) => {
      if (typeof phase !== 'object' || !phase) return phase;
      const p = phase as Record<string, unknown>;

      if (Array.isArray(p.tasks)) {
        p.tasks = p.tasks.map((task: unknown) => {
          if (typeof task !== 'object' || !task) return task;
          const t = task as Record<string, unknown>;

          // Ensure estimate_minutes is present
          if (
            t.estimate_minutes === undefined ||
            t.estimate_minutes === null ||
            typeof t.estimate_minutes !== 'number'
          ) {
            t.estimate_minutes = 30; // Default to 30 minutes
          }

          // Ensure task_id is present
          if (!t.task_id) {
            t.task_id = `task_${Math.random().toString(36).substr(2, 9)}`;
          }

          return t;
        });
      }

      return p;
    });
  }

  return obj;
}

/**
 * Split tasks among team members based on idea and team info
 */
export async function splitTasks(
  idea: IntermediateIdea,
  teamInfo: TeamInfo,
  model?: string
): Promise<TaskDistribution> {
  console.log('[splitTasks] Function called with model:', model);
  const memberList = teamInfo.members
    .map((m: TeamMember) => `- ${m.name} (${m.role})`)
    .join('\n');

  const prompt = `You are an AI assistant that creates an execution plan for hackathon projects. Given the idea, team members and their roles, produce a phase-wise list: Ideation, Design, Development, Testing, Deployment. For each phase, list specific, actionable tasks with estimated time, and assign tasks to team members.

**CRITICAL REQUIREMENTS:**
1. Return ONLY valid JSON with no markdown backticks, no commentary, no extra text
2. EVERY TASK MUST have an estimate_minutes value (integer, positive number like 30, 60, 90, etc.)
3. The JSON must be completely valid and parseable
4. Do not abbreviate or omit any required fields

**Idea:**
Title: ${idea.idea_title}
Summary: ${idea.idea_summary}
USP: ${idea.unique_selling_point}

**Team (${teamInfo.team_size} members):**
${memberList}

**Timeline:** 24-72 hour hackathon

Respond with ONLY this exact JSON structure (remember: every task MUST have estimate_minutes):
{
  "phases": [
    {
      "phase_name": "phase name",
      "tasks": [
        {
          "task_id": "unique id",
          "title": "short task name",
          "description": "brief description",
          "estimate_minutes": 60,
          "assigned_to": "member name or null"
        }
      ]
    }
  ]
}`;

  console.log(`[splitTasks] Requesting task distribution for idea: "${idea.idea_title}"`);
  const response = await callLLM(prompt, model, 12000);

  try {
    console.log(`[splitTasks] Raw response length: ${response.length} characters`);
    const jsonStr = extractJSON(response);
    console.log(`[splitTasks] Extracted JSON length: ${jsonStr.length} characters`);
    const parsed = JSON.parse(jsonStr);
    console.log(`[splitTasks] JSON parsed successfully`);
    const fixed = fixTaskDistribution(parsed);
    console.log(`[splitTasks] Task distribution fixed, validating schema...`);
    const result = TaskDistributionSchema.parse(fixed);
    console.log(`[splitTasks] ✓ Task distribution validated successfully`);
    return result;
  } catch (error) {
    console.error('Failed to parse LLM response:', response.substring(0, 500));
    console.error('Parse error:', error);
    throw new Error(`Invalid response format from LLM: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
