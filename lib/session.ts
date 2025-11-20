/**
 * Session management utility
 * Generates and stores a unique session ID for each user visit
 */

/**
 * Generate a unique session ID
 * Format: session_timestamp_random (e.g., "session_1234567890_abc123")
 */
function generateSessionId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `session_${timestamp}_${random}`
}

/**
 * Get or create a session ID
 * If no session ID exists, creates a new one and stores it in sessionStorage
 * Session IDs are unique per browser tab/window
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a placeholder (won't be used)
    return 'server_session'
  }

  const STORAGE_KEY = 'quiz_session_id'
  
  // Try to get existing session ID from sessionStorage
  let sessionId = sessionStorage.getItem(STORAGE_KEY)
  
  if (!sessionId) {
    // Generate new session ID if none exists
    sessionId = generateSessionId()
    sessionStorage.setItem(STORAGE_KEY, sessionId)
    
    // Also store creation timestamp
    sessionStorage.setItem(`${STORAGE_KEY}_created`, Date.now().toString())
  }
  
  return sessionId
}

/**
 * Get session metadata (ID + creation time)
 */
export function getSessionMetadata() {
  if (typeof window === 'undefined') {
    return {
      sessionId: 'server_session',
      createdAt: Date.now()
    }
  }

  const STORAGE_KEY = 'quiz_session_id'
  const sessionId = sessionStorage.getItem(STORAGE_KEY) || generateSessionId()
  const createdAt = parseInt(
    sessionStorage.getItem(`${STORAGE_KEY}_created`) || Date.now().toString()
  )

  return {
    sessionId,
    createdAt,
    createdAtISO: new Date(createdAt).toISOString()
  }
}

/**
 * Clear session (useful for testing or logout)
 */
export function clearSession() {
  if (typeof window === 'undefined') return

  const STORAGE_KEY = 'quiz_session_id'
  sessionStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(`${STORAGE_KEY}_created`)
}

