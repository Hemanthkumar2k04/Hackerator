import { useTheme } from "../contexts/theme-context"
import Squares from "./Squares"

export default function ThemeSquares() {
  const { theme } = useTheme()

  return (
    <Squares
      speed={0.75}
      squareSize={40}
      direction="diagonal"
      borderColor={theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.2)"}
      hoverFillColor={theme === "dark" ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.15)"}
    />
  )
}
