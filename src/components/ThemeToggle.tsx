import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "../contexts/theme-context"
import { Button } from "./ui/button"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      size="icon"
      variant="ghost"
      className="relative size-8 rounded-full text-muted-foreground shadow-none"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <MoonIcon size={16} aria-hidden="true" />
      ) : (
        <SunIcon size={16} aria-hidden="true" />
      )}
    </Button>
  )
}
