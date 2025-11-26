/**
 * API Route to create initial session record when quiz starts
 */

import { NextRequest, NextResponse } from 'next/server'
import { createInitialSession } from '@/lib/local-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { sessionId, createdAt } = body

    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Create initial session record
    createInitialSession(sessionId, createdAt || new Date().toISOString())

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Initial session created successfully',
      sessionId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error creating initial session:', error)
    return NextResponse.json(
      { error: 'Failed to create initial session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

