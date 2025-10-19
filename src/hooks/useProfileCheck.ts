import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Custom hook to check if the user has a profile.
 * Shows profile modal if profile doesn't exist.
 */
export function useProfileCheck(userId: string | undefined) {
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!userId) return

      try {
        const { error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single()

        // If no profile exists, show the modal
        if (error && error.code === 'PGRST116') {
          setShowProfileModal(true)
        }
      } catch (err) {
        console.error('Error checking user profile:', err)
      }
    }

    checkUserProfile()
  }, [userId])

  const handleClose = () => {
    setShowProfileModal(false)
  }

  return { showProfileModal, handleClose }
}
