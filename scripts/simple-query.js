/**
 * Simple SQLite query examples
 * Run with: node scripts/simple-query.js
 * 
 * This shows different ways to query the database
 */

const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'test_1_database.db')
const db = new Database(dbPath)

console.log('\n📊 SQLite Database Queries\n')
console.log('='.repeat(80))

// Query 1: Get all submissions
console.log('\n1️⃣ All Submissions:')
const all = db.prepare('SELECT * FROM submissions ORDER BY created_timestamp DESC').all()
console.log(`   Found ${all.length} submissions`)

// Query 2: Get only leads (clicked "Get My Plan")
console.log('\n2️⃣ Leads Only (is_lead = "Y"):')
const leads = db.prepare(`
  SELECT id, session_id, email, name, is_lead, created_timestamp 
  FROM submissions 
  WHERE is_lead = 'Y' 
  ORDER BY created_timestamp DESC
`).all()
console.log(`   Found ${leads.length} leads`)
leads.forEach(lead => {
  console.log(`   - ${lead.email} (${lead.name || 'No name'})`)
})

// Query 3: Get non-leads
console.log('\n3️⃣ Non-Leads (is_lead = "N" or NULL):')
const nonLeads = db.prepare(`
  SELECT id, session_id, email, name, is_lead, created_timestamp 
  FROM submissions 
  WHERE is_lead = 'N' OR is_lead IS NULL
  ORDER BY created_timestamp DESC
`).all()
console.log(`   Found ${nonLeads.length} non-leads`)

// Query 4: Get count by lead status
console.log('\n4️⃣ Count by Lead Status:')
const counts = db.prepare(`
  SELECT 
    is_lead,
    COUNT(*) as count
  FROM submissions
  GROUP BY is_lead
`).all()
counts.forEach(row => {
  const status = row.is_lead || 'NULL'
  console.log(`   ${status}: ${row.count}`)
})

// Query 5: Get specific submission by email
console.log('\n5️⃣ Example: Get submission by email:')
const example = db.prepare(`
  SELECT * FROM submissions 
  WHERE email LIKE '%@%' 
  LIMIT 1
`).get()
if (example) {
  console.log(`   Email: ${example.email}`)
  console.log(`   Name: ${example.name || 'N/A'}`)
  console.log(`   Is Lead: ${example.is_lead || 'N'}`)
}

// Query 6: Get recent submissions (last 5)
console.log('\n6️⃣ Recent Submissions (Last 5):')
const recent = db.prepare(`
  SELECT id, email, name, is_lead, created_timestamp
  FROM submissions 
  ORDER BY created_timestamp DESC 
  LIMIT 5
`).all()
recent.forEach((sub, i) => {
  console.log(`   ${i + 1}. ${sub.email} - Lead: ${sub.is_lead || 'N'}`)
})

console.log('\n' + '='.repeat(80))
console.log('\n✅ Queries completed!\n')

db.close()

