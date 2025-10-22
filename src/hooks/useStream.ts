import { useState, useRef, useCallback } from "react"
import { streamFromGemini } from "../lib/gemini"

interface UseStreamResult {
  chunks: string[]
  isGenerating: boolean
  error: string | null
  outputRef: React.RefObject<HTMLDivElement | null>
  generate: (prompt: string, imageUrl?: string, model?: string) => Promise<void>
}

/**
 * Simple streaming hook for Gemini API
 * No context, no routing, just direct Gemini calls
 */
export function useStream(): UseStreamResult {
  const [chunks, setChunks] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const outputRef = useRef<HTMLDivElement | null>(null)
  const textBufferRef = useRef<string>("")

  const appendChunk = useCallback((text: string) => {
    textBufferRef.current += text

    // Extract complete words
    const parts = textBufferRef.current.split(/(\s+)/)
    const lastPart = parts[parts.length - 1]
    const isIncomplete = lastPart && !/^\s+$/.test(lastPart)

    const toDisplay = isIncomplete ? parts.slice(0, -1) : parts

    if (toDisplay.length > 0) {
      const displayText = toDisplay.join("")
      if (displayText.trim()) {
        setChunks((prev) => [...prev, displayText])
      }
      textBufferRef.current = isIncomplete ? lastPart : ""
    }

    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [])

  const generate = useCallback(async (prompt: string, imageUrl?: string, model?: string) => {
    try {
      setChunks([])
      setIsGenerating(true)
      setError(null)
      textBufferRef.current = ""

      await streamFromGemini({
        prompt,
        imageUrl,
        model,
        onChunk: (text) => appendChunk(text),
      })

      // Flush remaining buffer
      let remaining = textBufferRef.current.trim()
      remaining = remaining.replace(/\(\d+\s*words?\s*\.?\s*\)/gi, "").trim()

      if (remaining) {
        setChunks((prev) => [...prev, remaining])
      }
      textBufferRef.current = ""
    } catch (err: unknown) {
      console.error("Stream generation error:", err)
      setError((err as Error)?.message || String(err))
    } finally {
      setIsGenerating(false)
    }
  }, [appendChunk])

  return { chunks, isGenerating, error, outputRef, generate }
}
