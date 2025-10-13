import type { Session } from '@supabase/supabase-js'

/**
 * Check if a JWT token is expired or about to expire
 * @param session - The Supabase session object
 * @param bufferSeconds - Number of seconds before expiry to consider token expired (default: 60)
 * @returns true if token is expired or will expire within buffer time
 */
export function isTokenExpired(session: Session | null, bufferSeconds = 60): boolean {
  if (!session || !session.expires_at) {
    return true
  }

  const expiresAt = session.expires_at
  const now = Math.floor(Date.now() / 1000)
  
  // Token is expired if it expires within the buffer period
  return expiresAt <= now + bufferSeconds
}

/**
 * Get the remaining time in seconds until token expiration
 * @param session - The Supabase session object
 * @returns Number of seconds until expiration, or 0 if expired/invalid
 */
export function getTokenTimeRemaining(session: Session | null): number {
  if (!session || !session.expires_at) {
    return 0
  }

  const expiresAt = session.expires_at
  const now = Math.floor(Date.now() / 1000)
  const remaining = expiresAt - now

  return Math.max(0, remaining)
}

/**
 * Format token expiration time in a human-readable format
 * @param session - The Supabase session object
 * @returns Human-readable string like "2 hours" or "30 minutes"
 */
export function formatTokenExpiry(session: Session | null): string {
  const seconds = getTokenTimeRemaining(session)
  
  if (seconds === 0) {
    return 'Expired'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
  
  return `${minutes} minute${minutes > 1 ? 's' : ''}`
}
