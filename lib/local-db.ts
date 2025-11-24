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
      created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
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
      (session_id, email, name, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    // Convert quiz answers to JSON string
    const quizAnswersJson = JSON.stringify(data.quizAnswers)
    
    // Insert the data
    stmt.run(
      data.sessionId,
      data.email,
      data.name || null,
      quizAnswersJson,
      data.privacyConsent ? 1 : 0,
      data.marketingConsent ? 1 : 0,
      data.createdAt,
      data.submittedAt
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
      submittedAt: row.submitted_at
    }))
  } catch (error) {
    console.error('Error reading from SQLite DB:', error)
    throw error
  } finally {
    db.close()
  }
}
