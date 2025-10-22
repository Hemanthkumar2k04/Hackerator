import { useAuth } from "../contexts/AuthContext"
import { ProfileModal } from "../components/ProfileModal"
import { useProfileCheck } from "../hooks/useProfileCheck"
import ThemeSquares from "../components/ThemeSquares"


export function Workspace() {
  const { user } = useAuth()

  // Hook for profile check and modal
  const { showProfileModal, handleClose: handleProfileModalClose } =
    useProfileCheck(user?.id)


  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Squares Background */}
      <div className="fixed inset-0 z-0">
        <ThemeSquares />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col pt-16 pointer-events-none">

        <footer className="mt-auto border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Hackerator. All rights reserved.
        </footer>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={handleProfileModalClose} />
    </div>
  )
}
