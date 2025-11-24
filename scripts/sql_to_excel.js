/**
 * Convert SQLite database to Excel file
 * Reads test_1_database.db and creates test_1_database.xlsx
 * Run with: node scripts/sql_to_excel.js
 */

const Database = require('better-sqlite3')
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, '..', 'test_1_database.db')
const excelPath = path.join(__dirname, '..', 'test_1_database.xlsx')

try {
  // Open database
  const db = new Database(dbPath)
  
  // Get all submissions
  const submissions = db.prepare('SELECT * FROM submissions ORDER BY created_timestamp DESC').all()
  
  if (submissions.length === 0) {
    console.log('No submissions found in database.')
    db.close()
    process.exit(0)
  }
  
  console.log(`Found ${submissions.length} submissions. Converting to Excel...`)
  
  // Get all unique quiz answer keys from all submissions
  const allQuizKeys = new Set()
  submissions.forEach(sub => {
    try {
      const quizAnswers = JSON.parse(sub.quiz_answers)
      Object.keys(quizAnswers).forEach(key => allQuizKeys.add(key))
    } catch (e) {
      // Skip if can't parse
    }
  })
  
  const sortedQuizKeys = Array.from(allQuizKeys).sort((a, b) => {
    // Sort numerically if possible, otherwise alphabetically
    const numA = parseInt(a)
    const numB = parseInt(b)
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB
    }
    return a.localeCompare(b)
  })
  
  // Build column headers
  const baseColumns = [
    'Session ID',
    'Email',
    'Name',
    'Privacy Consent',
    'Marketing Consent',
    'Created At',
    'Submitted At',
    'Created Timestamp'
  ]
  
  // Add quiz answer columns
  const quizColumns = sortedQuizKeys.map(key => `Quiz Q${key}`)
  const allColumns = [...baseColumns, ...quizColumns]
  
  // Convert submissions to rows
  const rows = submissions.map(sub => {
    const row = {
      'Session ID': sub.session_id,
      'Email': sub.email,
      'Name': sub.name || '',
      'Privacy Consent': sub.privacy_consent ? 'Yes' : 'No',
      'Marketing Consent': sub.marketing_consent ? 'Yes' : 'No',
      'Created At': sub.created_at,
      'Submitted At': sub.submitted_at,
      'Created Timestamp': sub.created_timestamp
    }
    
    // Parse and add quiz answers
    try {
      const quizAnswers = JSON.parse(sub.quiz_answers)
      sortedQuizKeys.forEach(key => {
        const value = quizAnswers[key]
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            row[`Quiz Q${key}`] = value.join(', ')
          } else {
            row[`Quiz Q${key}`] = String(value)
          }
        } else {
          row[`Quiz Q${key}`] = ''
        }
      })
    } catch (e) {
      // If can't parse, fill with empty strings
      sortedQuizKeys.forEach(key => {
        row[`Quiz Q${key}`] = ''
      })
    }
    
    return row
  })
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows)
  
  // Set column widths (optional, makes it more readable)
  const colWidths = allColumns.map(col => ({ wch: Math.max(col.length, 15) }))
  worksheet['!cols'] = colWidths
  
  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions')
  
  // Write to file
  XLSX.writeFile(workbook, excelPath)
  
  console.log(`✅ Excel file created: ${excelPath}`)
  console.log(`   Total rows: ${rows.length}`)
  console.log(`   Total columns: ${allColumns.length}`)
  console.log(`   Quiz answer columns: ${sortedQuizKeys.length}`)
  
  db.close()
  
} catch (error) {
  console.error('Error converting to Excel:', error.message)
  if (error.message.includes('no such table')) {
    console.log('\n💡 Database exists but no submissions table yet. Submit a form to create data.\n')
  }
  process.exit(1)
}

