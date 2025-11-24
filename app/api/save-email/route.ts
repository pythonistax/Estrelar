/**
 * API Route to save email with session ID
 * This is a Next.js API route that you can use, or connect to your Python backend
 * 
 * To use your Python backend instead:
 * 1. Update NEXT_PUBLIC_API_ENDPOINT in .env.local to your Python API URL
 * 2. Or modify EmailPage.tsx to point to your Python API endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { saveSessionToLocalDB } from '@/lib/local-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, name, sessionId, quizAnswers, privacyConsent, marketingConsent, createdAt, submittedAt } = body

    // Validate required fields
    if (!email || !sessionId) {
      return NextResponse.json(
        { error: 'Email and session ID are required' },
        { status: 400 }
      )
    }

    const sessionData = {
      sessionId,
      email,
      name,
      quizAnswers: quizAnswers || {},
      privacyConsent: privacyConsent || false,
      marketingConsent: marketingConsent || false,
      createdAt: createdAt || new Date().toISOString(),
      submittedAt: submittedAt || new Date().toISOString()
    }

    // Log the data first (always show in terminal)
    console.log('Email submission received:', sessionData)

    // Save to SQLite database using OS file operations
    // Simple, reliable, and efficient - one row per submission
    saveSessionToLocalDB(sessionData)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Email saved successfully',
      sessionId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error saving email:', error)
    return NextResponse.json(
      { error: 'Failed to save email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

