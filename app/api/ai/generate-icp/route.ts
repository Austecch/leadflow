import { NextRequest, NextResponse } from 'next/server'
import { generateICP } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { industry, businessType, companySizeMin, companySizeMax, geography, decisionMakerRoles } = body

    if (!industry?.length || !geography?.length || !decisionMakerRoles?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, geography, decisionMakerRoles' },
        { status: 400 }
      )
    }

    const result = await generateICP({ industry, businessType, companySizeMin, companySizeMax, geography, decisionMakerRoles })
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('ICP generation error:', error)

    // Fallback ICP data
    return NextResponse.json({
      icpSummary: `Your ideal customers are growth-stage companies in your target industries with decision-makers actively looking to scale operations. They value ROI-driven tools and move quickly when they see a clear business case.`,
      keyPainPoints: [
        'Manual lead generation taking too much of the sales team\'s time',
        'Low reply rates from generic outreach campaigns',
        'Difficulty identifying and reaching the right decision-makers',
        'No clear visibility into pipeline attribution and outreach ROI',
      ],
      messagingAngles: [
        'Lead with time saved + revenue generated (specific numbers resonate)',
        'Reference industry-specific case studies and social proof',
        'Emphasize AI personalization that scales without losing human touch',
      ],
      qualificationQuestions: [
        'Do you currently have an outbound sales or lead generation process?',
        'How many leads does your team manually research each week?',
        'What\'s your current reply rate on cold outreach?',
      ],
    })
  }
}
