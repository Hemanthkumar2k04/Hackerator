interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function PromptInput({ value, onChange, placeholder }: PromptInputProps) {
  return (
    <textarea
      placeholder={placeholder || 'Describe your idea or question here...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-3 h-24 w-full resize-none rounded-lg border border-emerald-800 bg-gray-800 p-4 text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
    />
  )
}
