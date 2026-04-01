// ─── ICP Types ──────────────────────────────────────────────────────────────
export interface ICP {
  id: string
  name: string
  industry: string[]
  businessType: 'B2B' | 'B2C' | 'D2C' | 'Both'
  companySizeMin: number
  companySizeMax: number
  geography: string[]
  decisionMakerRoles: string[]
  revenueRange?: string
  techStack?: string[]
  keywords?: string[]
  createdAt: string
  updatedAt: string
}

// ─── Lead Types ──────────────────────────────────────────────────────────────
export type LeadStatus = 'discovered' | 'qualified' | 'contacted' | 'replied' | 'converted' | 'disqualified'
export type LeadTemperature = 'hot' | 'warm' | 'cold'
export type LeadSource = 'linkedin' | 'google' | 'instagram' | 'directory' | 'manual'

export interface Lead {
  id: string
  businessName: string
  contactName: string
  jobTitle: string
  email: string
  phone?: string
  website?: string
  linkedin?: string
  instagram?: string
  industry: string
  companySize?: string
  location: string
  country: string
  source: LeadSource
  temperature: LeadTemperature
  score: number // 0-100 Lead Quality Score
  scoreBreakdown: {
    icpMatch: number
    activityLevel: number
    websiteQuality: number
    engagementSignals: number
    dataCompleteness: number
  }
  status: LeadStatus
  tags: string[]
  notes?: string
  createdAt: string
  lastContactedAt?: string
  replyReceivedAt?: string
  convertedAt?: string
  campaignId?: string
  icpId?: string
  avatar?: string
  enrichmentData?: {
    techStack?: string[]
    fundingStage?: string
    employeeCount?: number
    annualRevenue?: string
    glassdoorRating?: number
    hiringActive?: boolean
  }
}

// ─── Campaign Types ───────────────────────────────────────────────────────────
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed'
export type CampaignChannel = 'email' | 'linkedin' | 'instagram'

export interface CampaignStep {
  id: string
  stepNumber: number
  channel: CampaignChannel
  dayOffset: number
  subject?: string
  messageTemplate: string
  aiPersonalized: boolean
  triggerCondition: 'no_reply' | 'no_open' | 'always'
}

export interface Campaign {
  id: string
  name: string
  description?: string
  icpId: string
  icpName: string
  status: CampaignStatus
  channels: CampaignChannel[]
  steps: CampaignStep[]
  targetLeadCount: number
  leadsEnrolled: number
  leadsContacted: number
  repliesReceived: number
  positiveReplies: number
  appointmentsBooked: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  sendWindowStart: string
  sendWindowEnd: string
  timezone: string
  tags: string[]
  stats: {
    sent: number
    opened: number
    clicked: number
    replied: number
    unsubscribed: number
    bounced: number
  }
}

// ─── Outreach / Message Types ─────────────────────────────────────────────────
export type MessageStatus = 'pending' | 'scheduled' | 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'failed'
export type ReplyClassification = 'interested' | 'not_interested' | 'neutral' | 'ooo' | 'referral'

export interface OutreachMessage {
  id: string
  leadId: string
  leadName: string
  leadEmail: string
  leadCompany: string
  campaignId: string
  campaignName: string
  channel: CampaignChannel
  subject?: string
  body: string
  status: MessageStatus
  stepNumber: number
  scheduledAt?: string
  sentAt?: string
  openedAt?: string
  repliedAt?: string
  aiGenerated: boolean
  personalizationSignals?: string[]
  createdAt: string
}

export interface Reply {
  id: string
  messageId: string
  leadId: string
  leadName: string
  leadEmail: string
  leadCompany: string
  leadAvatar?: string
  campaignId: string
  campaignName: string
  channel: CampaignChannel
  body: string
  classification: ReplyClassification
  confidence: number // 0-1
  aiSuggestedResponse?: string
  humanApproved?: boolean
  approvedResponseBody?: string
  respondedAt?: string
  receivedAt: string
  isRead: boolean
}

// ─── Analytics Types ──────────────────────────────────────────────────────────
export interface AnalyticsOverview {
  leadsDiscovered: number
  leadsQualified: number
  outreachSent: number
  repliesReceived: number
  positiveReplies: number
  appointmentsBooked: number
  replyRate: number
  positiveReplyRate: number
  conversionRate: number
  avgLeadScore: number
  costPerLead?: number
  costPerAppointment?: number
}

export interface TimeSeriesPoint {
  date: string
  sent: number
  replied: number
  converted: number
  leadsDiscovered: number
}

export interface ChannelPerformance {
  channel: CampaignChannel
  sent: number
  replied: number
  replyRate: number
  converted: number
  conversionRate: number
}

export interface FunnelStage {
  stage: string
  count: number
  percentage: number
  color: string
}

// ─── AI Personalization ───────────────────────────────────────────────────────
export interface PersonalizationRequest {
  lead: Pick<Lead, 'businessName' | 'contactName' | 'jobTitle' | 'industry' | 'location' | 'website' | 'linkedin'>
  campaign: Pick<Campaign, 'name' | 'channels'>
  icp: Pick<ICP, 'industry' | 'decisionMakerRoles'>
  channel: CampaignChannel
  stepNumber: number
  additionalContext?: string
}

export interface PersonalizationResult {
  subject?: string
  body: string
  personalizationSignals: string[]
  confidence: number
  alternativeVariants?: string[]
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string
  type: 'reply' | 'appointment' | 'campaign' | 'lead' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}
