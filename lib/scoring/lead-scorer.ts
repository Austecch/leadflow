/**
 * LeadFlow AI — Lead Scoring Engine
 * Computes a 0–100 Lead Quality Score (LQS) across 5 weighted dimensions.
 *
 * Weight distribution (matches PRD spec):
 *   ICP Match              30%
 *   Activity Level         20%
 *   Website Quality        20%
 *   Engagement Signals     20%
 *   Data Completeness      10%
 */

import type { Lead, ICP } from '../types'

export interface ScoringInput {
  lead: Partial<Lead>
  icp: Partial<ICP>
  websiteMetrics?: {
    hasSSL?: boolean
    hasBlog?: boolean
    hasContactPage?: boolean
    pageSpeedScore?: number   // 0-100
    seoScore?: number         // 0-100
    lastUpdatedDays?: number  // days since last update
  }
  socialMetrics?: {
    followerCount?: number
    postFrequencyPerMonth?: number
    avgEngagementRate?: number  // percentage
    hasRecentActivity?: boolean // within 30 days
    isVerified?: boolean
  }
  activitySignals?: {
    linkedinPostsLast30Days?: number
    hasJobPostings?: boolean
    hasRecentFunding?: boolean
    hasRecentNews?: boolean
    adSpendEstimate?: 'none' | 'low' | 'medium' | 'high'
  }
}

export interface ScoreBreakdown {
  icpMatch: number       // max 30
  activityLevel: number  // max 20
  websiteQuality: number // max 20
  engagementSignals: number // max 20
  dataCompleteness: number  // max 10
  total: number          // 0-100
  temperature: 'hot' | 'warm' | 'cold'
  flags: string[]        // disqualifying flags
  boosts: string[]       // score-boosting signals
}

// ─── ICP Match Scoring (max 30 pts) ───────────────────────────────────────────
function scoreIcpMatch(lead: Partial<Lead>, icp: Partial<ICP>): { score: number; flags: string[]; boosts: string[] } {
  let score = 0
  const flags: string[] = []
  const boosts: string[] = []

  // Industry match (0-10 pts)
  if (icp.industry?.length && lead.industry) {
    const icpIndustries = icp.industry.map(i => i.toLowerCase())
    const leadIndustry = lead.industry.toLowerCase()
    const directMatch = icpIndustries.some(i => leadIndustry.includes(i) || i.includes(leadIndustry))
    if (directMatch) { score += 10; boosts.push('Exact industry match') }
    else {
      const partialMatch = icpIndustries.some(i => {
        const iWords = i.split(/[\s\/]+/)
        return iWords.some(w => w.length > 3 && leadIndustry.includes(w))
      })
      if (partialMatch) { score += 6; boosts.push('Partial industry match') }
      else flags.push('Industry mismatch with ICP')
    }
  } else score += 5 // unknown — give benefit of doubt

  // Role match (0-10 pts)
  if (icp.decisionMakerRoles?.length && lead.jobTitle) {
    const targetRoles = icp.decisionMakerRoles.map(r => r.toLowerCase())
    const title = lead.jobTitle.toLowerCase()
    const exactRole = targetRoles.some(r => title.includes(r.split(' ')[0]))
    if (exactRole) { score += 10; boosts.push('Decision-maker role match') }
    else if (title.includes('founder') || title.includes('ceo') || title.includes('owner') || title.includes('director')) {
      score += 7; boosts.push('Senior decision-maker')
    } else if (title.includes('manager') || title.includes('head') || title.includes('lead')) {
      score += 4
    } else flags.push('Job title not in target roles')
  } else score += 5

  // Company size match (0-5 pts)
  if (icp.companySizeMin && icp.companySizeMax && lead.companySize) {
    const sizeMap: Record<string, [number, number]> = {
      '1-5': [1, 5], '2-10': [2, 10], '5-20': [5, 20], '10-50': [10, 50],
      '10-25': [10, 25], '25-100': [25, 100], '50-200': [50, 200], '200+': [200, 10000]
    }
    const range = sizeMap[lead.companySize]
    if (range) {
      const [min, max] = range
      const overlap = min <= icp.companySizeMax && max >= icp.companySizeMin
      if (overlap) { score += 5; boosts.push('Company size in target range') }
      else flags.push('Company size outside target range')
    } else score += 3
  } else score += 3

  // Geography match (0-5 pts)
  if (icp.geography?.length && lead.country) {
    const targetGeos = icp.geography.map(g => g.toLowerCase())
    const match = targetGeos.some(g => lead.country!.toLowerCase().includes(g) || g.includes(lead.country!.toLowerCase()))
    if (match) { score += 5; boosts.push('In target geography') }
    else { score += 1; flags.push('Outside target geography') }
  } else score += 3

  return { score: Math.min(score, 30), flags, boosts }
}

// ─── Activity Level Scoring (max 20 pts) ──────────────────────────────────────
function scoreActivityLevel(signals?: ScoringInput['activitySignals']): { score: number; boosts: string[] } {
  let score = 8 // baseline
  const boosts: string[] = []
  if (!signals) return { score, boosts }

  if (signals.linkedinPostsLast30Days !== undefined) {
    if (signals.linkedinPostsLast30Days >= 8) { score += 5; boosts.push('Very active on LinkedIn') }
    else if (signals.linkedinPostsLast30Days >= 3) { score += 3; boosts.push('Active on LinkedIn') }
    else if (signals.linkedinPostsLast30Days === 0) score -= 2
  }
  if (signals.hasJobPostings) { score += 4; boosts.push('Actively hiring') }
  if (signals.hasRecentFunding) { score += 5; boosts.push('Recent funding round') }
  if (signals.hasRecentNews) { score += 3; boosts.push('Recent news coverage') }
  if (signals.adSpendEstimate === 'high') { score += 4; boosts.push('High ad spend detected') }
  else if (signals.adSpendEstimate === 'medium') score += 2
  else if (signals.adSpendEstimate === 'none') score -= 2

  return { score: Math.max(0, Math.min(score, 20)), boosts }
}

// ─── Website Quality Scoring (max 20 pts) ─────────────────────────────────────
function scoreWebsiteQuality(lead: Partial<Lead>, metrics?: ScoringInput['websiteMetrics']): { score: number; flags: string[]; boosts: string[] } {
  let score = 0
  const flags: string[] = []
  const boosts: string[] = []

  // Has website at all (0-4 pts)
  if (lead.website) { score += 4 }
  else { flags.push('No website found'); return { score: 0, flags, boosts } }

  if (!metrics) return { score: 8, flags, boosts } // basic presence score

  if (metrics.hasSSL) { score += 3; boosts.push('SSL secured') }
  if (metrics.hasContactPage) score += 2
  if (metrics.hasBlog) { score += 2; boosts.push('Active blog') }

  if (metrics.pageSpeedScore !== undefined) {
    if (metrics.pageSpeedScore >= 80) { score += 4; boosts.push('Fast website') }
    else if (metrics.pageSpeedScore >= 60) score += 2
    else flags.push('Slow website load time')
  } else score += 2

  if (metrics.lastUpdatedDays !== undefined) {
    if (metrics.lastUpdatedDays <= 30) { score += 3; boosts.push('Recently updated') }
    else if (metrics.lastUpdatedDays <= 90) score += 1
    else if (metrics.lastUpdatedDays > 365) { score -= 2; flags.push('Website appears outdated') }
  } else score += 1

  if (metrics.seoScore !== undefined) {
    if (metrics.seoScore >= 70) score += 2
    else if (metrics.seoScore >= 40) score += 1
  } else score += 1

  return { score: Math.max(0, Math.min(score, 20)), flags, boosts }
}

// ─── Engagement Signals Scoring (max 20 pts) ──────────────────────────────────
function scoreEngagementSignals(metrics?: ScoringInput['socialMetrics']): { score: number; boosts: string[] } {
  let score = 6
  const boosts: string[] = []
  if (!metrics) return { score, boosts }

  if (metrics.followerCount !== undefined) {
    if (metrics.followerCount >= 10000) { score += 4; boosts.push('Large social following') }
    else if (metrics.followerCount >= 1000) score += 3
    else if (metrics.followerCount >= 100) score += 1
  }

  if (metrics.avgEngagementRate !== undefined) {
    if (metrics.avgEngagementRate >= 5) { score += 5; boosts.push('High engagement rate') }
    else if (metrics.avgEngagementRate >= 2) score += 3
    else if (metrics.avgEngagementRate >= 0.5) score += 1
  }

  if (metrics.postFrequencyPerMonth !== undefined) {
    if (metrics.postFrequencyPerMonth >= 12) { score += 3; boosts.push('Posts frequently') }
    else if (metrics.postFrequencyPerMonth >= 4) score += 2
    else if (metrics.postFrequencyPerMonth === 0) score -= 2
  }

  if (metrics.hasRecentActivity) score += 2
  if (metrics.isVerified) { score += 2; boosts.push('Verified account') }

  return { score: Math.max(0, Math.min(score, 20)), boosts }
}

// ─── Data Completeness Scoring (max 10 pts) ───────────────────────────────────
function scoreDataCompleteness(lead: Partial<Lead>): { score: number; flags: string[] } {
  const flags: string[] = []
  let score = 0

  const fields = [
    { key: 'email', pts: 3, label: 'Email' },
    { key: 'contactName', pts: 1, label: 'Contact name' },
    { key: 'jobTitle', pts: 1, label: 'Job title' },
    { key: 'website', pts: 1, label: 'Website' },
    { key: 'linkedin', pts: 1, label: 'LinkedIn' },
    { key: 'phone', pts: 1, label: 'Phone' },
    { key: 'location', pts: 1, label: 'Location' },
    { key: 'instagram', pts: 1, label: 'Instagram' },
  ]

  for (const field of fields) {
    if ((lead as any)[field.key]) score += field.pts
    else if (field.pts >= 2) flags.push(`Missing ${field.label}`)
  }

  return { score: Math.min(score, 10), flags }
}

// ─── Main Scoring Function ─────────────────────────────────────────────────────
export function scoreLead(input: ScoringInput): ScoreBreakdown {
  const { lead, icp, websiteMetrics, socialMetrics, activitySignals } = input

  const icpResult = scoreIcpMatch(lead, icp)
  const activityResult = scoreActivityLevel(activitySignals)
  const websiteResult = scoreWebsiteQuality(lead, websiteMetrics)
  const engagementResult = scoreEngagementSignals(socialMetrics)
  const completenessResult = scoreDataCompleteness(lead)

  const total = Math.min(100,
    icpResult.score +
    activityResult.score +
    websiteResult.score +
    engagementResult.score +
    completenessResult.score
  )

  const temperature: 'hot' | 'warm' | 'cold' = total >= 75 ? 'hot' : total >= 40 ? 'warm' : 'cold'

  const allFlags = [...icpResult.flags, ...websiteResult.flags, ...completenessResult.flags]
  const allBoosts = [...icpResult.boosts, ...activityResult.boosts, ...websiteResult.boosts, ...engagementResult.boosts]

  return {
    icpMatch: icpResult.score,
    activityLevel: activityResult.score,
    websiteQuality: websiteResult.score,
    engagementSignals: engagementResult.score,
    dataCompleteness: completenessResult.score,
    total,
    temperature,
    flags: allFlags,
    boosts: allBoosts,
  }
}

// ─── Batch Scoring ─────────────────────────────────────────────────────────────
export function scoreLeads(leads: Partial<Lead>[], icp: Partial<ICP>): Map<string, ScoreBreakdown> {
  const results = new Map<string, ScoreBreakdown>()
  for (const lead of leads) {
    if (lead.id) {
      results.set(lead.id, scoreLead({ lead, icp }))
    }
  }
  return results
}

// ─── Score Change Detection ───────────────────────────────────────────────────
export function detectScoreChange(oldScore: number, newScore: number): {
  changed: boolean
  direction: 'improved' | 'declined' | 'unchanged'
  magnitude: 'significant' | 'minor' | 'none'
  temperatureChange?: { from: string; to: string }
} {
  const diff = newScore - oldScore
  if (Math.abs(diff) === 0) return { changed: false, direction: 'unchanged', magnitude: 'none' }

  const oldTemp = oldScore >= 75 ? 'hot' : oldScore >= 40 ? 'warm' : 'cold'
  const newTemp = newScore >= 75 ? 'hot' : newScore >= 40 ? 'warm' : 'cold'

  return {
    changed: true,
    direction: diff > 0 ? 'improved' : 'declined',
    magnitude: Math.abs(diff) >= 15 ? 'significant' : 'minor',
    temperatureChange: oldTemp !== newTemp ? { from: oldTemp, to: newTemp } : undefined,
  }
}
