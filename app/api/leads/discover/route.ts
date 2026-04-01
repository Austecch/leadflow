import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { Lead } from '@/lib/types'

const SAMPLE_LEADS = [
  { businessName: 'NovaSpark Tech', contactName: 'Kwame Asante', jobTitle: 'CEO', email: 'kwame@novasparktech.com', industry: 'SaaS / Automation', location: 'Accra, Ghana', country: 'Ghana', source: 'linkedin' as const },
  { businessName: 'Blume Digital', contactName: 'Sara Lindqvist', jobTitle: 'Co-Founder', email: 'sara@blumedigital.se', industry: 'Digital Marketing', location: 'Stockholm, Sweden', country: 'Sweden', source: 'google' as const },
  { businessName: 'PeakFlow Agency', contactName: 'Carlos Menezes', jobTitle: 'Agency Director', email: 'carlos@peakflow.com.br', industry: 'Marketing Agency', location: 'São Paulo, Brazil', country: 'Brazil', source: 'directory' as const },
  { businessName: 'Kira Commerce', contactName: 'Amara Diallo', jobTitle: 'Founder', email: 'amara@kiracommerce.co', industry: 'E-commerce / Fashion', location: 'Dakar, Senegal', country: 'Senegal', source: 'instagram' as const },
  { businessName: 'TechBridge Solutions', contactName: 'Rohan Mehta', jobTitle: 'CTO', email: 'rohan@techbridge.io', industry: 'SaaS / Developer Tools', location: 'Bangalore, India', country: 'India', source: 'linkedin' as const },
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { icpId, sources = ['linkedin', 'google'], limit = 5 } = body

    // Simulate async discovery delay
    await new Promise(r => setTimeout(r, 1500))

    const newLeads: Lead[] = SAMPLE_LEADS.slice(0, Math.min(limit, SAMPLE_LEADS.length)).map(lead => {
      const score = Math.floor(Math.random() * 50) + 40 // 40-90 range
      const temperature = score >= 75 ? 'hot' : score >= 50 ? 'warm' : 'cold'
      return {
        id: uuidv4(),
        ...lead,
        phone: undefined,
        website: `${lead.businessName.toLowerCase().replace(/\s+/g, '')}.com`,
        temperature,
        score,
        scoreBreakdown: {
          icpMatch: Math.round(score * 0.30),
          activityLevel: Math.round(score * 0.20),
          websiteQuality: Math.round(score * 0.20),
          engagementSignals: Math.round(score * 0.20),
          dataCompleteness: Math.round(score * 0.10),
        },
        status: 'discovered' as const,
        tags: [],
        createdAt: new Date().toISOString(),
        icpId,
        companySize: ['2-10', '10-50', '50-200'][Math.floor(Math.random() * 3)],
      }
    })

    return NextResponse.json({
      leads: newLeads,
      totalFound: newLeads.length,
      sourcesQueried: sources,
      deduplicatedCount: 0,
      message: `Found ${newLeads.length} new leads from ${sources.join(', ')}`,
    })
  } catch (error: any) {
    console.error('Lead discovery error:', error)
    return NextResponse.json({ error: 'Lead discovery failed', details: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    availableSources: ['linkedin', 'instagram', 'google', 'directory', 'manual'],
    status: 'operational',
    rateLimit: { linkedin: '50/day', instagram: '80/day', google: '100/day' },
  })
}
