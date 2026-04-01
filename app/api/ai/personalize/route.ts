import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalizedMessage } from '@/lib/claude'
import type { PersonalizationRequest } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: PersonalizationRequest = await req.json()

    if (!body.lead || !body.channel) {
      return NextResponse.json({ error: 'Missing required fields: lead, channel' }, { status: 400 })
    }

    const result = await generatePersonalizedMessage(body)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Personalization error:', error)

    // Graceful fallback if Claude API is unavailable
    const firstName = (error?.lead?.contactName || 'there').split(' ')[0]
    return NextResponse.json({
      subject: `Quick thought for your team`,
      body: `Hey ${firstName},\n\nI came across your work and had to reach out — what you're building looks genuinely interesting.\n\nWe help teams like yours cut their prospecting time significantly while generating more qualified conversations. Would love to share how.\n\nWorth a quick 20-minute call this week?\n\n[Your name]`,
      personalizationSignals: ['Role-based tone', 'Value-first structure', 'Single CTA'],
      confidence: 0.72,
    })
  }
}
