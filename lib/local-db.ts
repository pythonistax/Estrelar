import * as path from 'path'
import Database from 'better-sqlite3'

const DB_FILE_PATH = path.join(process.cwd(), 'test_1_database.db')

interface SessionData {
  sessionId: string
  email: string
  name?: string
  quizAnswers: Record<string, any>
  privacyConsent: boolean
  marketingConsent: boolean
  createdAt: string
  submittedAt: string
  isLead?: 'Y' | 'N' // Lead status: 'Y' if they clicked "Get My Plan", 'N' otherwise
}

/**
 * Initialize the SQLite database and create table if it doesn't exist
 */
function initDatabase(): Database.Database {
  const db = new Database(DB_FILE_PATH)
  
  // Create table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      quiz_answers TEXT NOT NULL,
      privacy_consent INTEGER NOT NULL,
      marketing_consent INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      is_lead TEXT DEFAULT 'N',
      created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Add is_lead column to existing tables if it doesn't exist (migration)
  try {
    db.exec(`ALTER TABLE submissions ADD COLUMN is_lead TEXT DEFAULT 'N'`)
  } catch (error) {
    // Column already exists, ignore error
  }
  
  // Create index for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_session_id ON submissions(session_id);
    CREATE INDEX IF NOT EXISTS idx_email ON submissions(email);
  `)
  
  return db
}

/**
 * Save session data to SQLite database using OS file operations
 * Simple, effective, and reliable - one row per submission
 */
export function saveSessionToLocalDB(data: SessionData): void {
  const db = initDatabase()
  
  try {
    // Prepare the insert statement
    const stmt = db.prepare(`
      INSERT INTO submissions 
      (session_id, email, name, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at, is_lead)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    // Convert quiz answers to JSON string
    const quizAnswersJson = JSON.stringify(data.quizAnswers)
    
    // Default is_lead to 'N' if not provided
    const isLead = data.isLead || 'N'
    
    // Insert the data
    stmt.run(
      data.sessionId,
      data.email,
      data.name || null,
      quizAnswersJson,
      data.privacyConsent ? 1 : 0,
      data.marketingConsent ? 1 : 0,
      data.createdAt,
      data.submittedAt,
      isLead
    )
    
    console.log(`✅ Session saved to SQLite DB: ${data.sessionId}`)
  } catch (error) {
    console.error('Error saving to SQLite DB:', error)
    throw error
  } finally {
    db.close()
  }
}

/**
 * Update lead status for a session
 */
export function updateLeadStatus(sessionId: string, isLead: 'Y' | 'N'): void {
  const db = initDatabase()
  
  try {
    const stmt = db.prepare(`
      UPDATE submissions 
      SET is_lead = ? 
      WHERE session_id = ?
    `)
    
    stmt.run(isLead, sessionId)
    
    console.log(`✅ Lead status updated for session ${sessionId}: ${isLead}`)
  } catch (error) {
    console.error('Error updating lead status:', error)
    throw error
  } finally {
    db.close()
  }
}

/**
 * Get all submissions from the database
 */
export function getAllSubmissions(): SessionData[] {
  const db = initDatabase()
  
  try {
    const rows = db.prepare('SELECT * FROM submissions ORDER BY created_timestamp DESC').all() as any[]
    
    return rows.map(row => ({
      sessionId: row.session_id,
      email: row.email,
      name: row.name || undefined,
      quizAnswers: JSON.parse(row.quiz_answers),
      privacyConsent: row.privacy_consent === 1,
      marketingConsent: row.marketing_consent === 1,
      createdAt: row.created_at,
      submittedAt: row.submitted_at,
      isLead: (row.is_lead as 'Y' | 'N') || 'N'
    }))
  } catch (error) {
    console.error('Error reading from SQLite DB:', error)
    throw error
  } finally {
    db.close()
  }
}
