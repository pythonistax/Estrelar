/**
 * Simple script to view all submissions in the database
 * Run with: node scripts/view-database.js
 */

const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'test_1_database.db')
const db = new Database(dbPath)

try {
  console.log('\n📊 Database: test_1_database.db\n')
  console.log('=' .repeat(80))
  
  // Get all submissions
  const submissions = db.prepare('SELECT * FROM submissions ORDER BY created_timestamp DESC').all()
  
  if (submissions.length === 0) {
    console.log('No submissions yet.\n')
  } else {
    console.log(`Total submissions: ${submissions.length}\n`)
    console.log('=' .repeat(80))
    
    submissions.forEach((sub, index) => {
      console.log(`\n[${index + 1}] Submission ID: ${sub.id}`)
      console.log(`    Session ID: ${sub.session_id}`)
      console.log(`    Email: ${sub.email}`)
      console.log(`    Name: ${sub.name || '(not provided)'}`)
      console.log(`    Privacy Consent: ${sub.privacy_consent ? 'Yes' : 'No'}`)
      console.log(`    Marketing Consent: ${sub.marketing_consent ? 'Yes' : 'No'}`)
      console.log(`    Created: ${sub.created_at}`)
      console.log(`    Submitted: ${sub.submitted_at}`)
      
      // Parse and show quiz answers
      try {
        const quizAnswers = JSON.parse(sub.quiz_answers)
        if (Object.keys(quizAnswers).length > 0) {
          console.log(`    Quiz Answers:`)
          Object.entries(quizAnswers).forEach(([key, value]) => {
            const displayValue = Array.isArray(value) ? value.join(', ') : value
            console.log(`      Q${key}: ${displayValue}`)
          })
        }
      } catch (e) {
        console.log(`    Quiz Answers: ${sub.quiz_answers}`)
      }
      
      console.log('-' .repeat(80))
    })
  }
  
  // Show summary stats
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT email) as unique_emails,
      SUM(privacy_consent) as privacy_yes,
      SUM(marketing_consent) as marketing_yes
    FROM submissions
  `).get()
  
  console.log('\n📈 Summary Statistics:')
  console.log(`   Total Submissions: ${stats.total}`)
  console.log(`   Unique Emails: ${stats.unique_emails}`)
  console.log(`   Privacy Consent: ${stats.privacy_yes}/${stats.total}`)
  console.log(`   Marketing Consent: ${stats.marketing_yes}/${stats.total}`)
  console.log('')
  
} catch (error) {
  console.error('Error reading database:', error.message)
  if (error.message.includes('no such table')) {
    console.log('\n💡 Database exists but no table yet. Submit a form to create the table.\n')
  }
} finally {
  db.close()
}

