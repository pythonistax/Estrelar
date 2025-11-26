import * as path from 'path'
import Database from 'better-sqlite3'

const DB_FILE_PATH = path.join(process.cwd(), 'test_1_database.db')

interface SessionData {
  sessionId: string
  email?: string
  name?: string
  quizAnswers?: Record<string, any>
  privacyConsent?: boolean
  marketingConsent?: boolean
  createdAt: string
  submittedAt?: string
  isLead?: 'Y' | 'N' // Lead status: 'Y' if they clicked "Get My Plan", 'N' otherwise
  dropOffPage?: string // Last page/step where user was active
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
      session_id TEXT NOT NULL UNIQUE,
      email TEXT,
      name TEXT,
      quiz_answers TEXT,
      privacy_consent INTEGER DEFAULT 0,
      marketing_consent INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      submitted_at TEXT,
      is_lead TEXT DEFAULT 'N',
      drop_off_page TEXT DEFAULT 'quiz_start',
      created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Add is_lead column to existing tables if it doesn't exist (migration)
  try {
    db.exec(`ALTER TABLE submissions ADD COLUMN is_lead TEXT DEFAULT 'N'`)
  } catch (error) {
    // Column already exists, ignore error
  }
  
  // Add drop_off_page column to existing tables if it doesn't exist (migration)
  try {
    db.exec(`ALTER TABLE submissions ADD COLUMN drop_off_page TEXT DEFAULT 'quiz_start'`)
    // Update existing records to have default drop_off_page
    db.exec(`UPDATE submissions SET drop_off_page = 'completed' WHERE email IS NOT NULL AND email != ''`)
  } catch (error) {
    // Column already exists, ignore error
  }
  
  // Make session_id unique if not already
  try {
    db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_session_id_unique ON submissions(session_id)`)
  } catch (error) {
    // Index might already exist, ignore
  }
  
  // Migration: Check if email column is NOT NULL and make it nullable
  // SQLite doesn't support ALTER COLUMN, so we need to recreate the table
  try {
    const tableInfo = db.prepare("PRAGMA table_info(submissions)").all() as any[]
    const emailColumn = tableInfo.find(col => col.name === 'email')
    
    // If email is NOT NULL, we need to recreate the table
    if (emailColumn && emailColumn.notnull === 1) {
      console.log('🔄 Migrating database: Making email column nullable...')
      
      // Create new table with nullable email
      db.exec(`
        CREATE TABLE submissions_migration (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL UNIQUE,
          email TEXT,
          name TEXT,
          quiz_answers TEXT,
          privacy_consent INTEGER DEFAULT 0,
          marketing_consent INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          submitted_at TEXT,
          is_lead TEXT DEFAULT 'N',
          drop_off_page TEXT DEFAULT 'quiz_start',
          created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      // Copy all data (email can be null now)
      db.exec(`
        INSERT INTO submissions_migration 
        (id, session_id, email, name, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at, is_lead, drop_off_page, created_timestamp)
        SELECT 
          id, session_id, email, name, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at, 
          COALESCE(is_lead, 'N'), COALESCE(drop_off_page, 'quiz_start'), created_timestamp
        FROM submissions
      `)
      
      // Drop old table and rename new one
      db.exec(`DROP TABLE submissions`)
      db.exec(`ALTER TABLE submissions_migration RENAME TO submissions`)
      
      // Recreate indexes
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_session_id ON submissions(session_id);
        CREATE INDEX IF NOT EXISTS idx_email ON submissions(email);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_session_id_unique ON submissions(session_id);
      `)
      
      console.log('✅ Migration complete: email column is now nullable')
    }
  } catch (error: any) {
    // Migration might fail if table structure is already correct
    if (!error.message.includes('no such table') && !error.message.includes('already exists')) {
      console.error('Migration warning:', error.message)
    }
  }
  
  // Create index for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_session_id ON submissions(session_id);
    CREATE INDEX IF NOT EXISTS idx_email ON submissions(email);
  `)
  
  return db
}

/**
 * Create initial session record when quiz starts
 */
export function createInitialSession(sessionId: string, createdAt: string): void {
  const db = initDatabase()
  
  try {
    // Check if session already exists
    const existing = db.prepare('SELECT id FROM submissions WHERE session_id = ?').get(sessionId)
    
    if (existing) {
      // Session already exists, don't create duplicate
      return
    }
    
    // Create initial record with just session_id, created_at, and drop_off_page
    const stmt = db.prepare(`
      INSERT INTO submissions 
      (session_id, created_at, drop_off_page)
      VALUES (?, ?, 'quiz_start')
    `)
    
    stmt.run(sessionId, createdAt)
    
    console.log(`✅ Initial session created: ${sessionId}`)
  } catch (error) {
    console.error('Error creating initial session:', error)
    throw error
  } finally {
    db.close()
  }
}

/**
 * Update drop-off page for a session
 */
export function updateDropOffPage(sessionId: string, dropOffPage: string): void {
  const db = initDatabase()
  
  try {
    // First, ensure session exists (create if it doesn't)
    const existing = db.prepare('SELECT id FROM submissions WHERE session_id = ?').get(sessionId)
    
    if (!existing) {
      // Create initial record directly (don't call createInitialSession to avoid double connection)
      const createdAt = new Date().toISOString()
      const insertStmt = db.prepare(`
        INSERT INTO submissions 
        (session_id, created_at, drop_off_page)
        VALUES (?, ?, ?)
      `)
      insertStmt.run(sessionId, createdAt, dropOffPage)
      console.log(`✅ Initial session created for drop-off tracking: ${sessionId} at ${dropOffPage}`)
    } else {
      // Update drop_off_page for existing session
      const stmt = db.prepare(`
        UPDATE submissions 
        SET drop_off_page = ? 
        WHERE session_id = ?
      `)
      stmt.run(dropOffPage, sessionId)
      console.log(`✅ Drop-off page updated for session ${sessionId}: ${dropOffPage}`)
    }
  } catch (error) {
    console.error('Error updating drop-off page:', error)
    throw error
  } finally {
    db.close()
  }
}

/**
 * Save or update session data to SQLite database
 * If session exists, updates it. If not, creates new record.
 */
export function saveSessionToLocalDB(data: SessionData): void {
  const db = initDatabase()
  
  try {
    // Check if session already exists
    const existing = db.prepare('SELECT id FROM submissions WHERE session_id = ?').get(data.sessionId)
    
    if (existing) {
      // Update existing record
      const quizAnswersJson = data.quizAnswers ? JSON.stringify(data.quizAnswers) : null
      const isLead = data.isLead || 'N'
      const dropOffPage = data.dropOffPage || 'completed'
      
      const stmt = db.prepare(`
        UPDATE submissions 
        SET email = ?,
            name = ?,
            quiz_answers = ?,
            privacy_consent = ?,
            marketing_consent = ?,
            submitted_at = ?,
            is_lead = ?,
            drop_off_page = ?
        WHERE session_id = ?
      `)
      
      stmt.run(
        data.email || null,
        data.name || null,
        quizAnswersJson,
        data.privacyConsent ? 1 : 0,
        data.marketingConsent ? 1 : 0,
        data.submittedAt || new Date().toISOString(),
        isLead,
        dropOffPage,
        data.sessionId
      )
      
      console.log(`✅ Session updated in SQLite DB: ${data.sessionId}`)
    } else {
      // Create new record (shouldn't happen if tracking works, but fallback)
      const quizAnswersJson = data.quizAnswers ? JSON.stringify(data.quizAnswers) : '{}'
      const isLead = data.isLead || 'N'
      const dropOffPage = data.dropOffPage || 'completed'
      
      const stmt = db.prepare(`
        INSERT INTO submissions 
        (session_id, email, name, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at, is_lead, drop_off_page)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run(
        data.sessionId,
        data.email || null,
        data.name || null,
        quizAnswersJson,
        data.privacyConsent ? 1 : 0,
        data.marketingConsent ? 1 : 0,
        data.createdAt,
        data.submittedAt || new Date().toISOString(),
        isLead,
        dropOffPage
      )
      
      console.log(`✅ Session saved to SQLite DB: ${data.sessionId}`)
    }
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
      email: row.email || undefined,
      name: row.name || undefined,
      quizAnswers: row.quiz_answers ? JSON.parse(row.quiz_answers) : {},
      privacyConsent: row.privacy_consent === 1,
      marketingConsent: row.marketing_consent === 1,
      createdAt: row.created_at,
      submittedAt: row.submitted_at || undefined,
      isLead: (row.is_lead as 'Y' | 'N') || 'N',
      dropOffPage: row.drop_off_page || 'quiz_start'
    }))
  } catch (error) {
    console.error('Error reading from SQLite DB:', error)
    throw error
  } finally {
    db.close()
  }
}
