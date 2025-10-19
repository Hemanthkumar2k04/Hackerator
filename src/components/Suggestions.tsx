import { Button } from "./ui/button"

interface SuggestionsProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
}

export function Suggestions({ suggestions, onSuggestionClick }: SuggestionsProps) {
  return (
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
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
