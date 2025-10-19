import { useEffect, useState } from "react"
import { getAvailableModels } from "../lib/gemini"
import type { GeminiModel } from "../lib/gemini"

interface ModelSelectorProps {
  onModelSelect: (model: string) => void
  selectedModel: string
}

/**
 * Dropdown component to select between available Gemini models
 * Fetches available models from Gemini API on mount
 */
export function ModelSelector({ onModelSelect, selectedModel }: ModelSelectorProps) {
  const [models, setModels] = useState<GeminiModel[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true)
        const availableModels = await getAvailableModels()
        setModels(availableModels)
        
        // Set first model as default if not already selected
        if (availableModels.length > 0 && !selectedModel) {
          onModelSelect(availableModels[0].name)
        }
      } catch (error) {
        console.error("Failed to fetch models:", error)
        // Fallback models
        const fallback: GeminiModel[] = [
          { name: "gemini-2.5-pro", displayName: "Gemini 2.5 Pro" },
          { name: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash" },
        ]
        setModels(fallback)
        if (fallback.length > 0) {
          onModelSelect(fallback[0].name)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [onModelSelect, selectedModel])

  const currentModel = models.find((m) => m.name === selectedModel)

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading || models.length === 0}
        className="w-full px-4 py-2 rounded-lg border border-emerald-800 bg-gray-800 text-foreground hover:border-emerald-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
      >
        <span className="text-sm font-medium">
          {loading ? "Loading models..." : currentModel?.displayName || "Select Model"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !loading && models.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-emerald-800 rounded-lg shadow-lg z-50">
          {models.map((model) => (
            <button
              key={model.name}
              onClick={() => {
                onModelSelect(model.name)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                selectedModel === model.name
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-gray-100 hover:bg-gray-700"
              }`}
            >
              {model.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
