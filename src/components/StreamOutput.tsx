import { useEffect, useRef } from 'react'

interface StreamOutputProps {
  chunks: string[]
  isGenerating: boolean
  error: string | null
  outputRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Renders streamed LLM output with proper formatting and auto-scroll.
 * Displays text incrementally as chunks arrive, with loading and error states.
 */
export function StreamOutput({ chunks, isGenerating, error, outputRef }: StreamOutputProps) {
  const textRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [chunks, isGenerating])

  const fullText = chunks.join('')
  const hasContent = fullText.length > 0

  return (
    <div
      ref={outputRef}
      className="rounded-xl bg-gradient-to-b from-gray-900 to-black p-6 border border-emerald-800/50 min-h-[120px] max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-800"
    >
      {error ? (
        <div className="text-red-400 text-sm">
          <p className="font-semibold">Error: {error}</p>
        </div>
      ) : hasContent || isGenerating ? (
        <div
          ref={textRef}
          className="text-gray-100 leading-7 whitespace-pre-wrap break-words text-sm font-light"
        >
          {fullText}
          {isGenerating && <span className="ml-1 inline-block w-2 h-5 bg-emerald-500 animate-pulse rounded-sm" />}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm text-gray-400">
          LLM output will appear here...
        </p>
      )}
    </div>
  )
}
