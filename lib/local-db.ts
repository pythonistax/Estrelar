import * as fs from 'fs'
import * as path from 'path'

const DB_FILE_PATH = path.join(process.cwd(), 'test_1_database.json')

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
 * Simple OS-based local database using direct file system operations
 * Uses fs.existsSync, fs.readFileSync, and fs.writeFileSync - pure OS operations
 */
export function saveSessionToLocalDB(data: SessionData): void {
  // Step 1: Check if file exists using OS
  let allSessions: SessionData[] = []
  
  if (fs.existsSync(DB_FILE_PATH)) {
    // Step 2: Read existing file using OS
    const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    if (fileContent.trim()) {
      allSessions = JSON.parse(fileContent)
    }
  }
  
  // Step 3: Add new session to array
  allSessions.push(data)
  
  // Step 4: Write back to file using OS
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(allSessions, null, 2), 'utf-8')
  
  console.log(`✅ Session saved to local DB: ${data.sessionId}`)
}

/**
 * Also save to Excel if xlsx is available (optional)
 */
export async function saveSessionToExcel(data: SessionData): Promise<void> {
  try {
    const XLSX = await import('xlsx')
    const EXCEL_FILE_PATH = path.join(process.cwd(), 'test_1_database.xlsx')
    
    let existingData: any[] = []
    let allColumns: string[] = []
    
    // Read existing file if it exists
    if (fs.existsSync(EXCEL_FILE_PATH)) {
      const workbook = XLSX.readFile(EXCEL_FILE_PATH)
      const sheetName = workbook.SheetNames[0] || 'Sessions'
      const worksheet = workbook.Sheets[sheetName]
      existingData = XLSX.utils.sheet_to_json(worksheet)
      
      if (existingData.length > 0) {
        allColumns = Object.keys(existingData[0])
      }
    }
    
    // Get all quiz keys
    const keys = new Set<string>()
    existingData.forEach(row => {
      Object.keys(row).forEach(col => {
        if (col.startsWith('Quiz Q')) {
          const key = col.replace('Quiz Q', '')
          if (key) keys.add(key)
        }
      })
    })
    Object.keys(data.quizAnswers || {}).forEach(key => keys.add(key))
    const allQuizKeys = Array.from(keys).sort()
    
    // Build columns
    if (allColumns.length === 0) {
      allColumns = [
        'Session ID',
        'Email',
        'Name',
        'Privacy Consent',
        'Marketing Consent',
        'Created At',
        'Submitted At'
      ]
      allQuizKeys.forEach(key => {
        allColumns.push(`Quiz Q${key}`)
      })
    } else {
      allQuizKeys.forEach(key => {
        const colName = `Quiz Q${key}`
        if (!allColumns.includes(colName)) {
          allColumns.push(colName)
        }
      })
    }
    
    // Prepare new row
    const newRow: Record<string, any> = {
      'Session ID': data.sessionId,
      'Email': data.email,
      'Name': data.name || '',
      'Privacy Consent': data.privacyConsent ? 'Yes' : 'No',
      'Marketing Consent': data.marketingConsent ? 'Yes' : 'No',
      'Created At': data.createdAt,
      'Submitted At': data.submittedAt,
    }
    
    allQuizKeys.forEach(key => {
      const colName = `Quiz Q${key}`
      const value = data.quizAnswers[key]
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          newRow[colName] = value.join(', ')
        } else {
          newRow[colName] = String(value)
        }
      } else {
        newRow[colName] = ''
      }
    })
    
    allColumns.forEach(col => {
      if (!(col in newRow)) {
        newRow[col] = ''
      }
    })
    
    // Update existing rows
    const updatedExistingData = existingData.map(row => {
      const updatedRow: Record<string, any> = { ...row }
      allColumns.forEach(col => {
        if (!(col in updatedRow)) {
          updatedRow[col] = ''
        }
      })
      return updatedRow
    })
    
    const allRows = [...updatedExistingData, newRow]
    const worksheet = XLSX.utils.json_to_sheet(allRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sessions')
    
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    fs.writeFileSync(EXCEL_FILE_PATH, excelBuffer)
    
    console.log(`✅ Session saved to Excel: ${data.sessionId}`)
  } catch (error) {
    // Excel is optional, don't fail if it doesn't work
    console.warn('⚠️ Could not save to Excel (JSON backup still saved):', error)
  }
}

