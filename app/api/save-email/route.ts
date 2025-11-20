/**
 * API Route to save email with session ID
 * This is a Next.js API route that you can use, or connect to your Python backend
 * 
 * To use your Python backend instead:
 * 1. Update NEXT_PUBLIC_API_ENDPOINT in .env.local to your Python API URL
 * 2. Or modify EmailPage.tsx to point to your Python API endpoint
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { email, sessionId, quizAnswers, privacyConsent, marketingConsent, createdAt, submittedAt } = body

    // Validate required fields
    if (!email || !sessionId) {
      return NextResponse.json(
        { error: 'Email and session ID are required' },
        { status: 400 }
      )
    }

    // TODO: Save to your database here
    // Example structure:
    // await saveToDatabase({
    //   sessionId,
    //   email,
    //   quizAnswers,
    //   privacyConsent,
    //   marketingConsent,
    //   createdAt,
    //   submittedAt
    // })

    // For now, just log the data (you'll replace this with database save)
    console.log('Email submission received:', {
      sessionId,
      email,
      quizAnswers,
      privacyConsent,
      marketingConsent,
      createdAt,
      submittedAt
    })

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

