import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { Campaign } from '@/lib/types'

// In-memory store (use PostgreSQL in production)
const campaigns: Campaign[] = []

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const icpId = searchParams.get('icpId')

  let filtered = campaigns
  if (status) filtered = filtered.filter(c => c.status === status)
  if (icpId) filtered = filtered.filter(c => c.icpId === icpId)

  return NextResponse.json({ campaigns: filtered, total: filtered.length })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, icpId, icpName, channels, steps, targetLeadCount, sendWindowStart, sendWindowEnd, timezone, tags } = body

    if (!name || !icpId || !channels?.length) {
      return NextResponse.json({ error: 'Missing required fields: name, icpId, channels' }, { status: 400 })
    }

    const campaign: Campaign = {
      id: uuidv4(),
      name, description, icpId, icpName,
      status: 'draft',
      channels,
      steps: steps || [],
      targetLeadCount: targetLeadCount || 100,
      leadsEnrolled: 0, leadsContacted: 0, repliesReceived: 0, positiveReplies: 0, appointmentsBooked: 0,
      sendWindowStart: sendWindowStart || '09:00',
      sendWindowEnd: sendWindowEnd || '17:00',
      timezone: timezone || 'UTC',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { sent: 0, opened: 0, clicked: 0, replied: 0, unsubscribed: 0, bounced: 0 },
    }

    campaigns.push(campaign)
    return NextResponse.json(campaign, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create campaign', details: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, ...updates } = body

    const index = campaigns.findIndex(c => c.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    campaigns[index] = { ...campaigns[index], ...updates, status: status || campaigns[index].status, updatedAt: new Date().toISOString() }
    return NextResponse.json(campaigns[index])
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update campaign', details: error.message }, { status: 500 })
  }
}
