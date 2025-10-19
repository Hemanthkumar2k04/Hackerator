import type { ReactNode } from "react"

interface HeroProps {
  title: ReactNode
  subtitle: string
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <div className="mb-8 max-w-4xl text-center">
      <h1 className="mb-3 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="text-base text-muted-foreground md:text-lg">
        {subtitle}
      </p>
    </div>
  )
}
