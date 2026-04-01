import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// In-memory rate limit store (use Redis in production)
const rateLimits: Record<string, { count: number; resetAt: number }> = {}

const DAILY_LIMITS: Record<string, number> = {
  email: 500,
  linkedin: 50,
  instagram: 80,
}

function checkRateLimit(channel: string, accountId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${accountId}:${channel}`
  const now = Date.now()
  const tomorrow = new Date()
  tomorrow.setHours(24, 0, 0, 0)

  if (!rateLimits[key] || rateLimits[key].resetAt < now) {
    rateLimits[key] = { count: 0, resetAt: tomorrow.getTime() }
  }

  const limit = DAILY_LIMITS[channel] || 100
  const remaining = limit - rateLimits[key].count

  if (remaining <= 0) {
    return { allowed: false, remaining: 0, resetAt: rateLimits[key].resetAt }
  }

  rateLimits[key].count++
  return { allowed: true, remaining: remaining - 1, resetAt: rateLimits[key].resetAt }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { leadId, campaignId, channel, subject, messageBody, scheduledAt, accountId = 'default' } = body

    if (!leadId || !channel || !messageBody) {
      return NextResponse.json({ error: 'Missing required fields: leadId, channel, messageBody' }, { status: 400 })
    }

    // Check rate limits
    const rateCheck = checkRateLimit(channel, accountId)
    if (!rateCheck.allowed) {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        channel,
        limit: DAILY_LIMITS[channel],
        remaining: 0,
        resetAt: new Date(rateCheck.resetAt).toISOString(),
        message: `Daily ${channel} limit of ${DAILY_LIMITS[channel]} messages reached. Resets at midnight.`,
      }, { status: 429 })
    }

    // Simulate send delay
    await new Promise(r => setTimeout(r, 800))

    // Spam score check (simplified)
    const spamTriggers = ['guaranteed', 'click here', 'buy now', 'free money', 'act now', 'limited time offer']
    const hasSpamContent = spamTriggers.some(trigger => messageBody.toLowerCase().includes(trigger))
    if (hasSpamContent) {
      return NextResponse.json({
        error: 'Message failed spam check',
        triggers: spamTriggers.filter(t => messageBody.toLowerCase().includes(t)),
        suggestion: 'Remove spam trigger words and regenerate the message with Claude AI.',
      }, { status: 422 })
    }

    const messageId = uuidv4()
    const sentAt = scheduledAt || new Date().toISOString()

    return NextResponse.json({
      success: true,
      messageId,
      leadId,
      campaignId,
      channel,
      status: scheduledAt ? 'scheduled' : 'sent',
      sentAt,
      rateLimit: {
        remaining: rateCheck.remaining,
        resetAt: new Date(rateCheck.resetAt).toISOString(),
      },
      deliverability: {
        spamScore: Math.random() * 2, // 0-2 is good
        dkimValid: true,
        spfValid: true,
        dmarcValid: true,
      },
      message: `Message ${scheduledAt ? 'scheduled' : 'sent'} successfully via ${channel}`,
    })
  } catch (error: any) {
    console.error('Outreach send error:', error)
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 500 })
  }
}
