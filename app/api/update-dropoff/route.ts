/**
 * API Route to update drop-off page when user progresses or leaves
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateDropOffPage } from '@/lib/local-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { sessionId, dropOffPage } = body

    // Validate required fields
    if (!sessionId || !dropOffPage) {
      return NextResponse.json(
        { error: 'Session ID and drop-off page are required' },
        { status: 400 }
      )
    }

    // Update drop-off page
    updateDropOffPage(sessionId, dropOffPage)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Drop-off page updated successfully',
      sessionId,
      dropOffPage,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating drop-off page:', error)
    return NextResponse.json(
      { error: 'Failed to update drop-off page', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

