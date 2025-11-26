/**
 * Fix email NOT NULL constraint in existing database
 * Run with: node scripts/fix-email-constraint.js
 */

const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'test_1_database.db')

try {
  console.log('\n🔧 Fixing email NOT NULL constraint...\n')
  
  const db = new Database(dbPath)
  
  // Check if email column is NOT NULL
  const tableInfo = db.prepare("PRAGMA table_info(submissions)").all()
  const emailColumn = tableInfo.find(col => col.name === 'email')
  
  if (emailColumn && emailColumn.notnull === 1) {
    console.log('📝 Email column is NOT NULL. Migrating...')
    
    // Create new table with nullable email
    db.exec(`
      CREATE TABLE submissions_new (
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
    
    // Copy all data
    db.exec(`
      INSERT INTO submissions_new 
      (id, session_id, email, name, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at, is_lead, drop_off_page, created_timestamp)
      SELECT 
        id, session_id, email, name, quiz_answers, privacy_consent, marketing_consent, created_at, submitted_at, 
        COALESCE(is_lead, 'N'), COALESCE(drop_off_page, 'quiz_start'), created_timestamp
      FROM submissions
    `)
    
    // Drop old table and rename new one
    db.exec(`DROP TABLE submissions`)
    db.exec(`ALTER TABLE submissions_new RENAME TO submissions`)
    
    // Recreate indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_session_id ON submissions(session_id);
      CREATE INDEX IF NOT EXISTS idx_email ON submissions(email);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_session_id_unique ON submissions(session_id);
    `)
    
    console.log('✅ Migration complete! Email column is now nullable.\n')
  } else {
    console.log('✅ Email column is already nullable. No migration needed.\n')
  }
  
  db.close()
  
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}

