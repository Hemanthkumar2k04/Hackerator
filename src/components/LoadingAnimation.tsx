import Player from "lottie-react"
import HackeratorLoading from "@/assets/Hackerator_loading.json"

interface LoadingAnimationProps {
  fullScreen?: boolean
  size?: "sm" | "md" | "lg"
}

export function LoadingAnimation({
  fullScreen = false,
  size = "md",
}: LoadingAnimationProps) {
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 200,
  }

  const containerClass = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex items-center justify-center"

  return (
    <div className={containerClass}>
      <Player
        autoplay
        loop
        animationData={HackeratorLoading}
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      />
    </div>
  )
}
