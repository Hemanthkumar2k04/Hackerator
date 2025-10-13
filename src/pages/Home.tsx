import { Button } from "../components/ui/button"
import ThemeSquares from "../components/ThemeSquares"

export function Home() {
  const suggestions = [
    "Generate a business idea for sustainable tech.",
    "Suggest a plot for a sci-fi novel about time travel.",
    "Develop a marketing campaign for a new health app.",
    "Brainstorm a product name for an AI-powered writing assistant.",
  ]

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
              Unleash Your Next Big Idea with <span className="text-emerald-500">I</span>dea<span className="text-emerald-500">F</span>orge.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Spark creativity, generate concepts, and bring your visions to life.
            </p>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-2xl pointer-events-auto ">
            <div className="rounded-2xl bg-card/90 p-5 backdrop-blur-sm border border-border">
              <textarea
                placeholder='Describe your idea or question here... (e.g., "A mobile app that connects local artisans with customers.")'
                className="mb-3 h-24 w-full resize-none rounded-lg border border-border bg-card/95 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline">
                  Upload Image
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
                  className="bg-emerald-600/85 hover:bg-emerald-600/70 border border-emerald-500/40"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} IdeaForge. All rights reserved.
        </footer>
      </div>
    </div>
  )
}