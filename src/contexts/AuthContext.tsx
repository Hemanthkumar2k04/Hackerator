import { createContext, useContext, useEffect, useState } from 'react'
import type { User, AuthError, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to check if session is expired
  const isSessionExpired = (session: Session | null): boolean => {
    if (!session) return true
    
    const expiresAt = session.expires_at
    if (!expiresAt) return true
    
    // Check if token expires within the next 60 seconds
    const now = Math.floor(Date.now() / 1000)
    return expiresAt <= now + 60
  }

  // Function to refresh session if needed
  const refreshSessionIfNeeded = async (currentSession: Session | null) => {
    if (!currentSession) return null

    if (isSessionExpired(currentSession)) {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Failed to refresh session:', error)
        await supabase.auth.signOut()
        return null
      }
      
      return newSession
    }
    
    return currentSession
  }

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      // Try to refresh if expired
      const validSession = await refreshSessionIfNeeded(initialSession)
      
      setSession(validSession)
      setUser(validSession?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Validate session before setting
      const validSession = await refreshSessionIfNeeded(session)
      
      setSession(validSession)
      setUser(validSession?.user ?? null)
      setLoading(false)
    })

    // Set up periodic token refresh check (every 5 minutes)
    const intervalId = setInterval(async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession && isSessionExpired(currentSession)) {
        const validSession = await refreshSessionIfNeeded(currentSession)
        
        if (!validSession) {
          // Session couldn't be refreshed, sign out
          setSession(null)
          setUser(null)
        }
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => {
      subscription.unsubscribe()
      clearInterval(intervalId)
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Supabase will automatically handle the redirect to this URL after OAuth
        redirectTo: `${window.location.origin}/home`,
        // You can also add scopes if needed
        // scopes: 'email profile',
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
