import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ProfileModal } from "../components/ProfileModal"
import { useProfileCheck } from "../hooks/useProfileCheck"
import { useImageUpload } from "../hooks/useImageUpload"
import { ModelSelector } from "../components/ModelSelector"
import ThemeSquares from "../components/ThemeSquares"
import { PromptInput } from "../components/PromptInput"
import { ImageUpload } from "../components/ImageUpload"
import { Suggestions } from "../components/Suggestions"
import { CyclingTypewriter } from "../components/CyclingTypewriter"
import HackeratorLogo from "@/assets/Hackerator.svg"
export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [textAreaValue, setTextAreaValue] = useState("")
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash")
  const [isGenerating, setIsGenerating] = useState(false)

  // Hook for image upload
  const {
    selectedFile,
    previewUrl,
    uploadedUrl,
    uploading,
    uploadProgress,
    setFile: setSelectedFile,
    setError: setUploadError,
    uploadFile,
  } = useImageUpload(user?.id)

  const suggestions = [
    "Generate a business idea for sustainable tech.",
    "Suggest a plot for a sci-fi novel about time travel.",
    "Develop a marketing campaign for a new health app.",
    "Brainstorm a product name for an AI-powered writing assistant.",
  ]

  const isGenerateDisabled =
    textAreaValue.trim().split(" ").filter(Boolean).length < 6

  // Hook for profile check and modal
  const { showProfileModal, handleClose: handleProfileModalClose } =
    useProfileCheck(user?.id)

  const handleGenerateClick = async () => {
    setUploadError("")
    
    // If a file is selected, upload it before generating
    if (selectedFile) {
      if (!user?.id) {
        setUploadError("You must be signed in to upload images.")
        return
      }
      setIsGenerating(true)
      await uploadFile()
      setIsGenerating(false)
    }

    // Navigate to Intermediate page with prompt and model
    navigate("/intermediate", {
      state: {
        prompt: textAreaValue,
        imageUrl: uploadedUrl || undefined,
        model: selectedModel,
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
      <div className="relative z-10 grid grid-cols-7 min-h-screen">
        {/* Left Column */}
        <div className="col-span-3 bg-gray-800 flex items-center h-full">
          <div className="flex flex-col items-start justify-center h-full w-[22rem] ml-10">
            <CyclingTypewriter
              phrases={[
                "Win Hackathons ⭐",
                "Build Projects !",
                "Be Productive 🔥",
              ]}
              className="text-emerald-500"
              cursorClassName="bg-emerald-500"
            />
            <span className="mt-6 text-2xl text-white font-medium">with</span>
            <span className="-mt-6 flex items-center text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
              Hackerator
              <img src={HackeratorLogo} alt="Hackerator Logo" className="h-30 w-auto -ml-6 mt-4" />
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl pointer-events-auto">
            <div className="rounded-2xl bg-black p-5 backdrop-blur-sm border border-emerald-800">
              {/* Prompt Input */}
              <PromptInput
                value={textAreaValue}
                onChange={setTextAreaValue}
              />

              {/* Image Upload, Model Selector & Generate Button */}
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1">
                  <ImageUpload
                    previewUrl={previewUrl}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    uploadedUrl={uploadedUrl}
                    onFileSelect={setSelectedFile}
                    onError={setUploadError}
                  />
                </div>
                <div className="w-40">
                  <ModelSelector
                    onModelSelect={setSelectedModel}
                    selectedModel={selectedModel}
                  />
                </div>

                <button
                  onClick={handleGenerateClick}
                  disabled={isGenerateDisabled || uploading || isGenerating}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    isGenerateDisabled
                      ? "bg-black border border-emerald-400 text-emerald-400"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isGenerating || uploading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Idea"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="mt-6 w-full max-w-2xl pointer-events-auto">
            <Suggestions
              suggestions={suggestions}
              onSuggestionClick={(suggestion: string) =>
                setTextAreaValue(suggestion)
              }
            />
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={handleProfileModalClose} />
    </div>
  )
}