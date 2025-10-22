import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ProfileModal } from "../components/ProfileModal"
import { useProfileCheck } from "../hooks/useProfileCheck"
import ThemeSquares from "../components/ThemeSquares"
import { LoadingAnimation } from "../components/LoadingAnimation"
import { streamFromGemini, INTERMEDIATE_PROMPT } from "../lib/gemini"

interface LocationState {
  prompt: string
  imageUrl?: string
  model: string
}

interface JudgeResponse {
  short_summary: string
  detailed_description: string
}

export function Intermediate() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [parsedData, setParsedData] = useState<JudgeResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>("")

  const state = location.state as LocationState | undefined
  const prompt = state?.prompt || ""
  const imageUrl = state?.imageUrl
  const model = state?.model || "gemini-2.5-flash"

  // Hook for profile check and modal
  const { showProfileModal, handleClose: handleProfileModalClose } =
    useProfileCheck(user?.id)

  // Generate on mount
  useEffect(() => {
    if (prompt) {
      generateIdeas()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateIdeas = async () => {
    setIsGenerating(true)
    setError("")
    setParsedData(null)

    try {
      const result = await streamFromGemini({
        prompt,
        imageUrl,
        model,
        systemPrompt: INTERMEDIATE_PROMPT,
      })

      // Parse JSON from response
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed: JudgeResponse = JSON.parse(jsonMatch[0])
        setParsedData(parsed)
      } else {
        setError("Failed to parse AI response. Please try again.")
      }
    } catch (err) {
      console.error("Generation error:", err)
      setError(
        err instanceof Error ? err.message : "Failed to generate ideas"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartHacking = () => {
    navigate("/final", {
      state: {
        ...state,
        evaluation: parsedData,
      },
    })
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Squares Background */}
      <div className="fixed inset-0 z-0">
        <ThemeSquares />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col pt-16 pointer-events-none">
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Header */}
            <div className="w-full max-w-3xl mb-8 pointer-events-auto">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Hackathon Idea Evaluation
              </h1>
              <p className="text-muted-foreground">
                Your idea analyzed by an AI
              </p>
            </div>

            {/* Loading or Output Section */}
            <div className="w-full max-w-3xl pointer-events-auto">
              {isGenerating && !parsedData ? (
                <LoadingAnimation fullScreen={false} size="lg" />
              ) : error ? (
                <div className="rounded-2xl bg-red-900/20 border border-red-500 p-6 mb-6">
                  <p className="text-red-200">{error}</p>
                  <button
                    onClick={generateIdeas}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : parsedData ? (
                <div className="space-y-6">
                  {/* Short Summary Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-700 p-8 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                      Your Idea
                    </h2>
                    <h3 className="text-3xl font-bold text-emerald-50">
                      {parsedData.short_summary}
                    </h3>
                  </div>

                  {/* Detailed Description Card */}
                  <div className="rounded-2xl bg-black p-8 backdrop-blur-sm border border-emerald-800">
                    <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                      Judge's Evaluation
                    </h2>
                    <div className="text-base leading-relaxed text-gray-200 space-y-4">
                      {parsedData.detailed_description
                        .split("\n")
                        .filter((para) => para.trim())
                        .map((para, idx) => (
                          <p key={idx} className="text-gray-300">
                            {para}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={generateIdeas}
                      disabled={isGenerating}
                      className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                    >
                      {isGenerating ? "Regenerating..." : "Regenerate"}
                    </button>
                    <button
                      onClick={handleStartHacking}
                      disabled={!parsedData}
                      className="flex-1 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                    >
                      Start Hacking →
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Hackerator. All rights reserved.
        </footer>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={handleProfileModalClose} />
    </div>
  )
}
