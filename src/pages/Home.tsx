import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { ProfileModal } from "../components/ProfileModal"
import { useStream } from "../hooks/useStream"
import { useProfileCheck } from "../hooks/useProfileCheck"
import { useImageUpload } from "../hooks/useImageUpload"
import { ModelSelector } from "../components/ModelSelector"
import ThemeSquares from "../components/ThemeSquares"
import { Hero } from "../components/Hero"
import { PromptInput } from "../components/PromptInput"
import { ImageUpload } from "../components/ImageUpload"
import { StreamOutput } from "../components/StreamOutput"
import { Suggestions } from "../components/Suggestions"
import HackeratorImg from "../assets/Hackerator.svg"

export function Home() {
  const { user } = useAuth()
  const [textAreaValue, setTextAreaValue] = useState("")
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash")

  // Hook for profile check and modal
  const { showProfileModal, handleClose: handleProfileModalClose } =
    useProfileCheck(user?.id)

  // Hook for streaming generation
  const {
    chunks: generatedChunks,
    isGenerating,
    error: generatingError,
    outputRef,
    generate: generateStream,
  } = useStream()

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

  const handleGenerateClick = async () => {
    setUploadError("")
    // If a file is selected, upload it before generating
    if (selectedFile) {
      if (!user?.id) {
        setUploadError("You must be signed in to upload images.")
        return
      }
      await uploadFile()
    }
    // Generate stream with optional image URL and selected model
    await generateStream(textAreaValue, uploadedUrl || undefined, selectedModel)
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
            {/* Hero Section */}
            <Hero
              title={
                <>
                  Unleash Your Next Big Idea with 
                  <span className="text-emerald-500"> H</span>ackerator.
                  <img 
                    src={HackeratorImg} 
                    alt="Hackerator" 
                    className="inline-block -ml-4 h-32 w-32 object-contain"
                  />
                </>
              }
              subtitle="Spark creativity, generate concepts, and bring your visions to life."
            />

            {/* Hackerator Image */}

            {/* Input Section */}
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

              {/* Output Section */}
              <div className="mt-6 w-full max-w-2xl pointer-events-auto">
                <StreamOutput
                  chunks={generatedChunks}
                  isGenerating={isGenerating}
                  error={generatingError}
                  outputRef={outputRef}
                />
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