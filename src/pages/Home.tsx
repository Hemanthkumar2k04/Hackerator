import { Button } from "../components/ui/button"
import ThemeSquares from "../components/ThemeSquares"
import { Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { ProfileModal } from "../components/ProfileModal"

export function Home() {
  const { user } = useAuth()
  const suggestions = [
    "Generate a business idea for sustainable tech.",
    "Suggest a plot for a sci-fi novel about time travel.",
    "Develop a marketing campaign for a new health app.",
    "Brainstorm a product name for an AI-powered writing assistant.",
  ]

  const [textAreaValue, setTextAreaValue] = useState("")
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Check if user has a profile when component mounts
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user?.id) return

      try {
        const { error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single()

        // If no profile exists, show the modal
        if (error && error.code === "PGRST116") {
          setShowProfileModal(true)
        }
      } catch (err) {
        console.error("Error checking user profile:", err)
      }
    }

    checkUserProfile()
  }, [user])

  const handleProfileModalClose = () => {
    setShowProfileModal(false)
  }

  const isGenerateDisabled = textAreaValue.trim().split(" ").filter(Boolean).length < 6

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Squares Background - lowest z-index so content is above */}
      <div className="fixed inset-0 z-0">
        <ThemeSquares />
      </div>    

      {/* Main Content - wrapper has pointer-events-none so hover reaches canvas below */}
      <div className="relative z-10 flex min-h-screen flex-col pt-16 pointer-events-none">
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Hero Section */}
          <div className="mb-8 max-w-4xl text-center">
            <h1 className="mb-3 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Unleash Your Next Big Idea with <span className="text-emerald-500">H</span>ackerator.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Spark creativity, generate concepts, and bring your visions to life.
            </p>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-2xl pointer-events-auto ">
            <div className="rounded-2xl bg-black p-5 backdrop-blur-sm border border-emerald-800">
              <textarea
                placeholder='Describe your idea or question here... (e.g., "A mobile app that connects local artisans with customers.")'
                value={textAreaValue}
                onChange={(e) => setTextAreaValue(e.target.value)}
                className="mb-3 h-24 w-full resize-none rounded-lg border border-emerald-800 bg-gray-800 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline">
                  <Upload className=" h-4 w-4" />
                  Upload Image
                </Button>
                <Button
                  className={`${
                    isGenerateDisabled
                      ? "bg-black border-emerald-400 text-emerald-400 transition-colors duration-300"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300"
                  }`}
                  disabled={isGenerateDisabled}
                >
                  Generate Idea 
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="mt-6 w-full max-w-2xl pointer-events-auto">
            <p className="mb-3 text-center text-foreground text-sm">
              Or try one of these suggestions:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="bg-emerald-600/85 hover:bg-emerald-600/70 border border-emerald-500/40 cursor-pointer text-white transition-colors duration-300"
                  onClick={() => setTextAreaValue(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
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