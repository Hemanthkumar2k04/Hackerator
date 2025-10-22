/**
 * Gemini API integration using official Google GenAI library
 * No backend required, no provider routing
 */

import { GoogleGenAI } from "@google/genai"
import type { Model } from "@google/genai"

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  throw new Error("Gemini API key not configured in environment")
}

const ai = new GoogleGenAI({
  apiKey,
})

export const INTERMEDIATE_PROMPT = `You are a creative hackathon ideation assistant. Your goal is to generate innovative, practical, and technically feasible project ideas based on the user's input. 
The idea should feel unique, inspiring, and buildable within a hackathon timeframe (24–72 hours).

Respond ONLY in the following strict JSON format — do not add any text before or after the JSON.

{
  "idea_title": "Catchy and concise project title (max 8 words)",
  "concept_summary": "One-liner that captures the core idea (max 20 words)",
  "detailed_description": "1–2 paragraphs explaining what the project does, why it’s useful, and how it can be built. Highlight creativity, real-world applicability, and a brief tech stack suggestion.",
  "key_features": ["3-5 short bullet points describing unique or impactful features"],
  "feasibility_score": "A short word like 'High', 'Medium', or 'Low' based on how realistic the implementation is within a hackathon."
}

IMPORTANT:
- Respond ONLY with valid JSON, nothing else.
- Keep ideas creative yet achievable.
- Avoid overly generic solutions.
- Do NOT include markdown or formatting in JSON strings.
- Keep tone inspiring and forward-looking.
`

export interface GeminiModel {
  name: string
  displayName: string
}

export interface GeminiStreamOptions {
  prompt: string
  imageUrl?: string
  onChunk?: (text: string) => void
  model?: string
  systemPrompt?: string
}

/**
 * Fetch available Gemini models from API
 * Filters for specific models like gemini-2.5-pro and gemini-2.5-flash
 */
export async function getAvailableModels(): Promise<GeminiModel[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Filter for the models we want to support
    const targetModels = ["gemini-2.5-pro", "gemini-2.5-flash"]
    const availableModels: GeminiModel[] = []

    if (data.models && Array.isArray(data.models)) {
      data.models.forEach((model: Model) => {
        const modelName = model.name?.split("/").pop() || ""
        if (targetModels.includes(modelName)) {
          availableModels.push({
            name: modelName,
            displayName: modelName === "gemini-2.5-pro" 
              ? "Gemini 2.5 Pro" 
              : "Gemini 2.5 Flash",
          })
        }
      })
    }

    return availableModels
  } catch (error) {
    console.error("Error fetching models:", error)
    // Return default models if API call fails
    return [
      { name: "gemini-2.5-pro", displayName: "Gemini 2.5 Pro" },
      { name: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash" },
    ]
  }
}

export async function streamFromGemini({
  prompt,
  imageUrl,
  onChunk,
  model = "gemini-2.5-flash",
  systemPrompt,
}: GeminiStreamOptions): Promise<string> {
  try {
    const contents: Array<{
      role: string
      parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
    }> = [
      {
        role: "user",
        parts: [
          {
            text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
          },
        ],
      },
    ]

    // Add image if provided
    if (imageUrl) {
      try {
        const imageData = await fetchImageAsBase64(imageUrl)
        contents[0].parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData,
          },
        })
      } catch (error) {
        console.warn("Failed to load image:", error)
      }
    }

    const response = await ai.models.generateContent({
      model,
      contents,
    })

    let fullText = ""

    if (response.text) {
      fullText = response.text
      onChunk?.(fullText)
    }

    return fullText
  } catch (error) {
    console.error("Gemini streaming error:", error)
    throw error
  }
}

/**
 * Convert image URL to base64
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      const base64Data = base64.split(",")[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
