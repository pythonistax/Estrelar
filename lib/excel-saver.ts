import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const EXCEL_FILE_PATH = path.join(process.cwd(), 'test_1_database.xlsx')

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
 * Gets all unique quiz answer keys from existing data and new data
 */
function getAllQuizKeys(existingData: any[], newQuizAnswers: Record<string, any>): string[] {
  const keys = new Set<string>()
  
  // Get keys from existing data (look for Quiz Q* columns)
  existingData.forEach(row => {
    Object.keys(row).forEach(col => {
      if (col.startsWith('Quiz Q')) {
        const key = col.replace('Quiz Q', '')
        if (key) keys.add(key)
      }
    })
  })
  
  // Get keys from new data
  Object.keys(newQuizAnswers || {}).forEach(key => keys.add(key))
  
  return Array.from(keys).sort()
}

/**
 * Saves session data to Excel file
 * Creates the file if it doesn't exist, or appends to existing file
 */
export async function saveSessionToExcel(data: SessionData): Promise<void> {
  try {
    let existingData: any[] = []
    let allColumns: string[] = []
    
    // Read existing file if it exists
    if (fs.existsSync(EXCEL_FILE_PATH)) {
      const workbook = XLSX.readFile(EXCEL_FILE_PATH)
      const sheetName = workbook.SheetNames[0] || 'Sessions'
      const worksheet = workbook.Sheets[sheetName]
      existingData = XLSX.utils.sheet_to_json(worksheet)
      
      // Get all column names from existing data
      if (existingData.length > 0) {
        allColumns = Object.keys(existingData[0])
      }
    }
    
    // Get all quiz keys (from existing data and new data)
    const allQuizKeys = getAllQuizKeys(existingData, data.quizAnswers)
    
    // Build base columns if file doesn't exist
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
      // Add quiz answer columns
      allQuizKeys.forEach(key => {
        allColumns.push(`Quiz Q${key}`)
      })
    } else {
      // Add any new quiz columns that don't exist yet
      allQuizKeys.forEach(key => {
        const colName = `Quiz Q${key}`
        if (!allColumns.includes(colName)) {
          allColumns.push(colName)
        }
      })
    }
    
    // Prepare the new row data
    const newRow: Record<string, any> = {}
    
    // Set base columns
    newRow['Session ID'] = data.sessionId
    newRow['Email'] = data.email
    newRow['Name'] = data.name || ''
    newRow['Privacy Consent'] = data.privacyConsent ? 'Yes' : 'No'
    newRow['Marketing Consent'] = data.marketingConsent ? 'Yes' : 'No'
    newRow['Created At'] = data.createdAt
    newRow['Submitted At'] = data.submittedAt
    
    // Set quiz answer columns
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
    
    // Ensure all columns are present in new row (fill missing with empty string)
    allColumns.forEach(col => {
      if (!(col in newRow)) {
        newRow[col] = ''
      }
    })
    
    // Update existing rows to include any new columns
    const updatedExistingData = existingData.map(row => {
      const updatedRow: Record<string, any> = { ...row }
      allColumns.forEach(col => {
        if (!(col in updatedRow)) {
          updatedRow[col] = ''
        }
      })
      return updatedRow
    })
    
    // Combine existing data with new row
    const allRows = [...updatedExistingData, newRow]
    
    // Create worksheet from all rows
    const worksheet = XLSX.utils.json_to_sheet(allRows)
    
    // Create or update workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sessions')
    
    // Write to file using buffer approach (works better in Next.js)
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    fs.writeFileSync(EXCEL_FILE_PATH, excelBuffer)
    
    console.log(`✅ Session saved to Excel: ${data.sessionId}`)
  } catch (error) {
    console.error('Error saving to Excel:', error)
    throw error
  }
}

