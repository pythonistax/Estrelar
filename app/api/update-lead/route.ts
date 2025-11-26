/**
 * API Route to update lead status when "Get My Plan" button is clicked
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateLeadStatus } from '@/lib/local-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { sessionId } = body

    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update lead status to 'Y' (they clicked "Get My Plan")
    updateLeadStatus(sessionId, 'Y')

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Lead status updated successfully',
      sessionId,
      isLead: 'Y',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating lead status:', error)
    return NextResponse.json(
      { error: 'Failed to update lead status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

