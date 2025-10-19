/**
 * Gemini API integration using official Google GenAI library
 * No backend required, no provider routing
 */

import { GoogleGenAI } from "@google/genai"

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  throw new Error("Gemini API key not configured in environment")
}

const ai = new GoogleGenAI({
  apiKey,
})

export interface GeminiModel {
  name: string
  displayName: string
}

export interface GeminiStreamOptions {
  prompt: string
  imageUrl?: string
  onChunk?: (text: string) => void
  model?: string
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
      data.models.forEach((model: any) => {
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
}: GeminiStreamOptions): Promise<string> {
  try {
    const contents: any = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
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
