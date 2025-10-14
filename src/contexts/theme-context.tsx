import { createContext, useContext, useEffect } from "react"

type Theme = "dark"

type ThemeContextType = {
  theme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = "dark"

  useEffect(() => {
    const root = document.documentElement
    
    // Always set to dark mode
    root.classList.remove("light")
    root.classList.add("dark")
  }, [])

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
