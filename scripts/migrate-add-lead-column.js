/**
 * Migration script to add is_lead column to existing database
 * Run with: node scripts/migrate-add-lead-column.js
 */

const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'test_1_database.db')

try {
  console.log('\n🔄 Migrating database to add is_lead column...\n')
  
  const db = new Database(dbPath)
  
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(submissions)").all()
  const hasLeadColumn = tableInfo.some(col => col.name === 'is_lead')
  
  if (hasLeadColumn) {
    console.log('✅ Column is_lead already exists. No migration needed.\n')
    db.close()
    process.exit(0)
  }
  
  console.log('📝 Adding is_lead column to submissions table...')
  
  // Add the column with default value 'N'
  db.exec(`
    ALTER TABLE submissions 
    ADD COLUMN is_lead TEXT DEFAULT 'N'
  `)
  
  // Update all existing records to have 'N' as default
  db.exec(`
    UPDATE submissions 
    SET is_lead = 'N' 
    WHERE is_lead IS NULL
  `)
  
  console.log('✅ Migration complete! Column is_lead added successfully.\n')
  
  // Show count of records updated
  const count = db.prepare('SELECT COUNT(*) as count FROM submissions').get()
  console.log(`📊 Updated ${count.count} existing records with is_lead = 'N'\n`)
  
  db.close()
  
} catch (error) {
  console.error('❌ Error during migration:', error.message)
  if (error.message.includes('duplicate column name')) {
    console.log('\n💡 Column already exists. Migration not needed.\n')
  }
  process.exit(1)
}

