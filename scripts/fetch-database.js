/**
 * Fetch and display SQLite database results
 * Run with: node scripts/fetch-database.js
 * 
 * This script fetches all submissions from the database including the new is_lead column
 */

const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'test_1_database.db')

try {
  const db = new Database(dbPath)
  
  // Check if is_lead column exists, if not, add it
  const tableInfo = db.prepare("PRAGMA table_info(submissions)").all()
  const hasLeadColumn = tableInfo.some(col => col.name === 'is_lead')
  
  if (!hasLeadColumn) {
    console.log('⚠️  Column is_lead not found. Adding it now...\n')
    try {
      db.exec(`ALTER TABLE submissions ADD COLUMN is_lead TEXT DEFAULT 'N'`)
      db.exec(`UPDATE submissions SET is_lead = 'N' WHERE is_lead IS NULL`)
      console.log('✅ Column is_lead added successfully.\n')
    } catch (e) {
      console.log('⚠️  Could not add column (may already exist):', e.message)
    }
  }
  
  console.log('\n📊 Fetching Database Results\n')
  console.log('='.repeat(100))
  
  // Fetch all submissions with is_lead column
  const query = `
    SELECT 
      id,
      session_id,
      email,
      name,
      privacy_consent,
      marketing_consent,
      COALESCE(is_lead, 'N') as is_lead,
      created_at,
      submitted_at,
      created_timestamp,
      quiz_answers
    FROM submissions 
    ORDER BY created_timestamp DESC
  `
  
  const submissions = db.prepare(query).all()
  
  if (submissions.length === 0) {
    console.log('No submissions found in database.\n')
    db.close()
    process.exit(0)
  }
  
  console.log(`\nFound ${submissions.length} submission(s)\n`)
  console.log('='.repeat(100))
  
  // Display each submission
  submissions.forEach((sub, index) => {
    console.log(`\n[${index + 1}] Submission #${sub.id}`)
    console.log(`    Session ID: ${sub.session_id}`)
    console.log(`    Email: ${sub.email}`)
    console.log(`    Name: ${sub.name || '(not provided)'}`)
    console.log(`    Privacy Consent: ${sub.privacy_consent ? 'Yes' : 'No'}`)
    console.log(`    Marketing Consent: ${sub.marketing_consent ? 'Yes' : 'No'}`)
    console.log(`    Is Lead: ${sub.is_lead || 'N'} ${sub.is_lead === 'Y' ? '✅ (Clicked "Get My Plan")' : '❌ (Did not click "Get My Plan")'}`)
    console.log(`    Created: ${sub.created_at}`)
    console.log(`    Submitted: ${sub.submitted_at}`)
    console.log(`    Timestamp: ${sub.created_timestamp}`)
    
    // Parse and display quiz answers
    try {
      const quizAnswers = JSON.parse(sub.quiz_answers)
      if (Object.keys(quizAnswers).length > 0) {
        console.log(`    Quiz Answers:`)
        Object.entries(quizAnswers).forEach(([key, value]) => {
          const displayValue = Array.isArray(value) ? value.join(', ') : value
          console.log(`      Question ${parseInt(key) + 1}: ${displayValue}`)
        })
      }
    } catch (e) {
      console.log(`    Quiz Answers: ${sub.quiz_answers}`)
    }
    
    console.log('-'.repeat(100))
  })
  
  // Summary statistics
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT email) as unique_emails,
      SUM(privacy_consent) as privacy_yes,
      SUM(marketing_consent) as marketing_yes,
      SUM(CASE WHEN COALESCE(is_lead, 'N') = 'Y' THEN 1 ELSE 0 END) as leads,
      SUM(CASE WHEN COALESCE(is_lead, 'N') = 'N' THEN 1 ELSE 0 END) as non_leads
    FROM submissions
  `).get()
  
  console.log('\n📈 Summary Statistics:')
  console.log('='.repeat(100))
  console.log(`   Total Submissions: ${stats.total}`)
  console.log(`   Unique Emails: ${stats.unique_emails}`)
  console.log(`   Privacy Consent: ${stats.privacy_yes}/${stats.total} (${((stats.privacy_yes / stats.total) * 100).toFixed(1)}%)`)
  console.log(`   Marketing Consent: ${stats.marketing_yes}/${stats.total} (${((stats.marketing_yes / stats.total) * 100).toFixed(1)}%)`)
  console.log(`   ✅ Leads (Clicked "Get My Plan"): ${stats.leads}/${stats.total} (${((stats.leads / stats.total) * 100).toFixed(1)}%)`)
  console.log(`   ❌ Non-Leads (Did not click): ${stats.non_leads}/${stats.total} (${((stats.non_leads / stats.total) * 100).toFixed(1)}%)`)
  console.log('')
  
  // Fetch only leads
  const leads = db.prepare(`
    SELECT id, session_id, email, name, COALESCE(is_lead, 'N') as is_lead, created_timestamp
    FROM submissions 
    WHERE COALESCE(is_lead, 'N') = 'Y'
    ORDER BY created_timestamp DESC
  `).all()
  
  if (leads.length > 0) {
    console.log('🎯 Leads (Clicked "Get My Plan"):')
    console.log('='.repeat(100))
    leads.forEach((lead, index) => {
      console.log(`   ${index + 1}. ${lead.email} (${lead.name || 'No name'}) - ${lead.created_timestamp}`)
    })
    console.log('')
  }
  
  db.close()
  
} catch (error) {
  console.error('❌ Error fetching database:', error.message)
  if (error.message.includes('no such table')) {
    console.log('\n💡 Database exists but no table yet. Submit a form to create the table.\n')
  }
  process.exit(1)
}

