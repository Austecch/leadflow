import type { Lead, Campaign, Reply, ICP, AnalyticsOverview, TimeSeriesPoint, ChannelPerformance, FunnelStage, Notification } from './types'

// ─── ICPs ─────────────────────────────────────────────────────────────────────
export const mockICPs: ICP[] = [
  {
    id: 'icp-1',
    name: 'SaaS Founders & CTOs',
    industry: ['Software / SaaS', 'Technology'],
    businessType: 'B2B',
    companySizeMin: 5,
    companySizeMax: 200,
    geography: ['United States', 'Canada', 'United Kingdom'],
    decisionMakerRoles: ['CEO', 'CTO', 'Co-Founder', 'Head of Engineering'],
    revenueRange: '$500K - $10M ARR',
    techStack: ['AWS', 'React', 'Node.js'],
    keywords: ['product-led growth', 'B2B SaaS', 'Series A'],
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 'icp-2',
    name: 'E-commerce Brand Owners',
    industry: ['E-commerce', 'Retail', 'DTC Brands'],
    businessType: 'D2C',
    companySizeMin: 2,
    companySizeMax: 100,
    geography: ['United States', 'Nigeria', 'South Africa'],
    decisionMakerRoles: ['Founder', 'CEO', 'Head of Growth', 'CMO'],
    revenueRange: '$100K - $5M/yr',
    keywords: ['Shopify', 'DTC', 'online store'],
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
  },
  {
    id: 'icp-3',
    name: 'Digital Marketing Agencies',
    industry: ['Marketing', 'Advertising', 'Digital Services'],
    businessType: 'B2B',
    companySizeMin: 3,
    companySizeMax: 80,
    geography: ['United Kingdom', 'Australia', 'Nigeria', 'United States'],
    decisionMakerRoles: ['Agency Owner', 'Managing Director', 'Head of Client Services'],
    revenueRange: '$200K - $3M/yr',
    keywords: ['performance marketing', 'paid ads', 'SEO agency'],
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
  },
]

// ─── Leads ────────────────────────────────────────────────────────────────────
export const mockLeads: Lead[] = [
  {
    id: 'lead-001', businessName: 'Stackify Labs', contactName: 'Marcus Chen',
    jobTitle: 'Co-Founder & CTO', email: 'marcus@stackifylabs.com', phone: '+1-415-555-0182',
    website: 'stackifylabs.com', linkedin: 'linkedin.com/in/marcuschen', industry: 'SaaS / Developer Tools',
    companySize: '12-50', location: 'San Francisco, CA', country: 'United States',
    source: 'linkedin', temperature: 'hot', score: 91,
    scoreBreakdown: { icpMatch: 28, activityLevel: 18, websiteQuality: 18, engagementSignals: 18, dataCompleteness: 9 },
    status: 'replied', tags: ['Series A', 'PLG', 'High Intent'],
    createdAt: '2026-03-01T08:00:00Z', lastContactedAt: '2026-03-10T14:22:00Z',
    replyReceivedAt: '2026-03-12T09:15:00Z', campaignId: 'camp-1', icpId: 'icp-1',
    enrichmentData: { techStack: ['AWS', 'React', 'PostgreSQL'], fundingStage: 'Series A', employeeCount: 28, annualRevenue: '$2.4M ARR', hiringActive: true }
  },
  {
    id: 'lead-002', businessName: 'Lumina Beauty Co.', contactName: 'Adaeze Okafor',
    jobTitle: 'Founder & CEO', email: 'adaeze@luminabeauty.co', phone: '+234-801-555-0193',
    website: 'luminabeauty.co', instagram: '@luminabeautyco', industry: 'E-commerce / Beauty',
    companySize: '2-10', location: 'Lagos, Nigeria', country: 'Nigeria',
    source: 'instagram', temperature: 'hot', score: 84,
    scoreBreakdown: { icpMatch: 26, activityLevel: 17, websiteQuality: 16, engagementSignals: 17, dataCompleteness: 8 },
    status: 'contacted', tags: ['DTC', 'Shopify', 'High Growth'],
    createdAt: '2026-03-05T10:30:00Z', lastContactedAt: '2026-03-14T11:00:00Z',
    campaignId: 'camp-2', icpId: 'icp-2',
    enrichmentData: { techStack: ['Shopify', 'Klaviyo'], employeeCount: 6, hiringActive: false }
  },
  {
    id: 'lead-003', businessName: 'Vertex Growth Agency', contactName: 'James Harrington',
    jobTitle: 'Managing Director', email: 'james@vertexgrowth.co.uk',
    website: 'vertexgrowth.co.uk', linkedin: 'linkedin.com/in/jamesharrington',
    industry: 'Digital Marketing Agency', companySize: '10-25', location: 'London, UK', country: 'United Kingdom',
    source: 'linkedin', temperature: 'warm', score: 72,
    scoreBreakdown: { icpMatch: 22, activityLevel: 14, websiteQuality: 14, engagementSignals: 14, dataCompleteness: 8 },
    status: 'qualified', tags: ['Performance Marketing', 'B2B Agency'],
    createdAt: '2026-03-08T09:00:00Z', campaignId: 'camp-3', icpId: 'icp-3',
    enrichmentData: { techStack: ['HubSpot', 'Google Analytics'], employeeCount: 18, hiringActive: true }
  },
  {
    id: 'lead-004', businessName: 'CloudNest Inc.', contactName: 'Priya Sharma',
    jobTitle: 'Head of Product', email: 'priya@cloudnest.io',
    website: 'cloudnest.io', linkedin: 'linkedin.com/in/priyasharma',
    industry: 'SaaS / Cloud Infrastructure', companySize: '50-200', location: 'Austin, TX', country: 'United States',
    source: 'google', temperature: 'warm', score: 68,
    scoreBreakdown: { icpMatch: 20, activityLevel: 14, websiteQuality: 13, engagementSignals: 13, dataCompleteness: 8 },
    status: 'contacted', tags: ['Enterprise', 'Cloud'],
    createdAt: '2026-03-10T14:00:00Z', lastContactedAt: '2026-03-15T10:00:00Z',
    campaignId: 'camp-1', icpId: 'icp-1',
  },
  {
    id: 'lead-005', businessName: 'Crafted Kicks', contactName: 'Emeka Eze',
    jobTitle: 'CEO & Founder', email: 'emeka@craftedkicks.ng',
    website: 'craftedkicks.ng', instagram: '@craftedkicks',
    industry: 'E-commerce / Footwear', companySize: '2-10', location: 'Abuja, Nigeria', country: 'Nigeria',
    source: 'instagram', temperature: 'warm', score: 63,
    scoreBreakdown: { icpMatch: 20, activityLevel: 12, websiteQuality: 12, engagementSignals: 11, dataCompleteness: 8 },
    status: 'discovered', tags: ['DTC', 'Fashion'],
    createdAt: '2026-03-12T11:00:00Z', campaignId: 'camp-2', icpId: 'icp-2',
  },
  {
    id: 'lead-006', businessName: 'Meridian Digital', contactName: 'Sophie Laurent',
    jobTitle: 'Agency Director', email: 'sophie@meridiandigital.fr',
    website: 'meridiandigital.fr', linkedin: 'linkedin.com/in/sophielaurent',
    industry: 'Marketing Agency', companySize: '5-20', location: 'Paris, France', country: 'France',
    source: 'linkedin', temperature: 'cold', score: 38,
    scoreBreakdown: { icpMatch: 12, activityLevel: 7, websiteQuality: 8, engagementSignals: 7, dataCompleteness: 4 },
    status: 'discovered', tags: [],
    createdAt: '2026-03-14T13:00:00Z', icpId: 'icp-3',
  },
  {
    id: 'lead-007', businessName: 'Finova Systems', contactName: 'David Osei',
    jobTitle: 'CEO', email: 'david@finovasystems.com',
    website: 'finovasystems.com', linkedin: 'linkedin.com/in/davidosei',
    industry: 'Fintech / SaaS', companySize: '25-100', location: 'Accra, Ghana', country: 'Ghana',
    source: 'linkedin', temperature: 'hot', score: 88,
    scoreBreakdown: { icpMatch: 27, activityLevel: 18, websiteQuality: 17, engagementSignals: 18, dataCompleteness: 8 },
    status: 'converted', tags: ['Fintech', 'Series A', 'High Intent'],
    createdAt: '2026-02-20T08:00:00Z', lastContactedAt: '2026-03-01T09:00:00Z',
    replyReceivedAt: '2026-03-03T14:00:00Z', convertedAt: '2026-03-08T10:00:00Z',
    campaignId: 'camp-1', icpId: 'icp-1',
    enrichmentData: { techStack: ['Python', 'React', 'PostgreSQL'], fundingStage: 'Series A', employeeCount: 45, annualRevenue: '$1.8M ARR', hiringActive: true }
  },
  {
    id: 'lead-008', businessName: 'GlowUp Studio', contactName: 'Tara Williams',
    jobTitle: 'Founder', email: 'tara@glowupstudio.co',
    website: 'glowupstudio.co', instagram: '@glowupstudio',
    industry: 'E-commerce / Wellness', companySize: '1-5', location: 'Atlanta, GA', country: 'United States',
    source: 'instagram', temperature: 'warm', score: 59,
    scoreBreakdown: { icpMatch: 18, activityLevel: 11, websiteQuality: 11, engagementSignals: 12, dataCompleteness: 7 },
    status: 'qualified', tags: ['Wellness', 'Shopify'],
    createdAt: '2026-03-15T12:00:00Z', campaignId: 'camp-2', icpId: 'icp-2',
  },
]

// ─── Campaigns ────────────────────────────────────────────────────────────────
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Q2 SaaS Founder Outreach',
    description: 'Targeting Series A SaaS founders in US/UK for product demo bookings',
    icpId: 'icp-1', icpName: 'SaaS Founders & CTOs',
    status: 'active', channels: ['email', 'linkedin'],
    targetLeadCount: 500, leadsEnrolled: 312, leadsContacted: 287,
    repliesReceived: 41, positiveReplies: 18, appointmentsBooked: 9,
    startDate: '2026-03-01', createdAt: '2026-02-25T09:00:00Z', updatedAt: '2026-03-30T14:00:00Z',
    sendWindowStart: '09:00', sendWindowEnd: '17:00', timezone: 'America/New_York',
    tags: ['Q2', 'SaaS', 'Priority'],
    steps: [
      { id: 'step-1-1', stepNumber: 1, channel: 'email', dayOffset: 0, subject: 'Quick idea for {{businessName}}', messageTemplate: 'Hey {{firstName}}, saw your recent post about scaling {{businessName}}...', aiPersonalized: true, triggerCondition: 'always' },
      { id: 'step-1-2', stepNumber: 2, channel: 'linkedin', dayOffset: 4, messageTemplate: 'Hi {{firstName}}, just sent you an email — wanted to connect here too...', aiPersonalized: true, triggerCondition: 'no_reply' },
      { id: 'step-1-3', stepNumber: 3, channel: 'email', dayOffset: 9, subject: 'Re: Quick idea for {{businessName}}', messageTemplate: 'Following up — I know your inbox is busy, so I\'ll be brief...', aiPersonalized: true, triggerCondition: 'no_reply' },
    ],
    stats: { sent: 287, opened: 168, clicked: 52, replied: 41, unsubscribed: 4, bounced: 7 },
  },
  {
    id: 'camp-2',
    name: 'DTC Ecom Brands — Instagram First',
    description: 'Instagram DM + email sequence for DTC brands doing $100K+/yr',
    icpId: 'icp-2', icpName: 'E-commerce Brand Owners',
    status: 'active', channels: ['instagram', 'email'],
    targetLeadCount: 300, leadsEnrolled: 198, leadsContacted: 156,
    repliesReceived: 28, positiveReplies: 12, appointmentsBooked: 5,
    startDate: '2026-03-10', createdAt: '2026-03-08T10:00:00Z', updatedAt: '2026-03-30T12:00:00Z',
    sendWindowStart: '10:00', sendWindowEnd: '18:00', timezone: 'Africa/Lagos',
    tags: ['DTC', 'Ecom', 'Instagram'],
    steps: [
      { id: 'step-2-1', stepNumber: 1, channel: 'instagram', dayOffset: 0, messageTemplate: 'Love what you\'re building with {{businessName}} 🔥 Had a quick thought...', aiPersonalized: true, triggerCondition: 'always' },
      { id: 'step-2-2', stepNumber: 2, channel: 'email', dayOffset: 3, subject: 'Following up from Instagram', messageTemplate: 'Hey {{firstName}}, I sent you a DM on Instagram...', aiPersonalized: true, triggerCondition: 'no_reply' },
    ],
    stats: { sent: 156, opened: 89, clicked: 31, replied: 28, unsubscribed: 2, bounced: 3 },
  },
  {
    id: 'camp-3',
    name: 'Agency Owner Cold Email',
    description: 'Cold email to UK/AU marketing agency owners for partnership pitches',
    icpId: 'icp-3', icpName: 'Digital Marketing Agencies',
    status: 'paused', channels: ['email'],
    targetLeadCount: 200, leadsEnrolled: 145, leadsContacted: 130,
    repliesReceived: 15, positiveReplies: 6, appointmentsBooked: 3,
    startDate: '2026-02-15', createdAt: '2026-02-12T08:00:00Z', updatedAt: '2026-03-20T11:00:00Z',
    sendWindowStart: '08:00', sendWindowEnd: '16:00', timezone: 'Europe/London',
    tags: ['Agency', 'Partnership'],
    steps: [
      { id: 'step-3-1', stepNumber: 1, channel: 'email', dayOffset: 0, subject: 'Noticed something on your site, {{firstName}}', messageTemplate: 'Hey {{firstName}}, I was looking at {{businessName}}\'s site and noticed...', aiPersonalized: true, triggerCondition: 'always' },
      { id: 'step-3-2', stepNumber: 2, channel: 'email', dayOffset: 5, subject: 'Quick follow-up', messageTemplate: 'Following up on my last email — I wanted to share a quick case study...', aiPersonalized: false, triggerCondition: 'no_reply' },
    ],
    stats: { sent: 130, opened: 68, clicked: 22, replied: 15, unsubscribed: 3, bounced: 4 },
  },
  {
    id: 'camp-4',
    name: 'Fintech SaaS APAC Push',
    description: 'LinkedIn-first outreach to fintech founders in Africa & APAC',
    icpId: 'icp-1', icpName: 'SaaS Founders & CTOs',
    status: 'completed', channels: ['linkedin', 'email'],
    targetLeadCount: 150, leadsEnrolled: 150, leadsContacted: 142,
    repliesReceived: 24, positiveReplies: 11, appointmentsBooked: 6,
    startDate: '2026-01-15', endDate: '2026-02-28',
    createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-02-28T17:00:00Z',
    sendWindowStart: '09:00', sendWindowEnd: '17:00', timezone: 'Africa/Lagos',
    tags: ['Fintech', 'APAC', 'Africa', 'Completed'],
    steps: [],
    stats: { sent: 142, opened: 94, clicked: 38, replied: 24, unsubscribed: 2, bounced: 5 },
  },
]

// ─── Replies ──────────────────────────────────────────────────────────────────
export const mockReplies: Reply[] = [
  {
    id: 'reply-001', messageId: 'msg-001', leadId: 'lead-001',
    leadName: 'Marcus Chen', leadEmail: 'marcus@stackifylabs.com', leadCompany: 'Stackify Labs',
    campaignId: 'camp-1', campaignName: 'Q2 SaaS Founder Outreach', channel: 'email',
    body: 'Hey, thanks for reaching out! This actually resonates with what we\'re working on. We\'ve been looking for something exactly like this. Can we set up a 20 min call this week? I\'m free Thursday afternoon PST.',
    classification: 'interested', confidence: 0.96,
    aiSuggestedResponse: 'Hi Marcus,\n\nThank you for the quick reply — really glad it resonated!\n\nThursday afternoon PST works perfectly. Here\'s my Calendly link to grab a slot that works for you: [calendly-link]\n\nLooking forward to the conversation!\n\nBest,\n[Your Name]',
    receivedAt: '2026-03-12T09:15:00Z', isRead: true,
  },
  {
    id: 'reply-002', messageId: 'msg-002', leadId: 'lead-007',
    leadName: 'David Osei', leadEmail: 'david@finovasystems.com', leadCompany: 'Finova Systems',
    campaignId: 'camp-1', campaignName: 'Q2 SaaS Founder Outreach', channel: 'linkedin',
    body: 'Thanks for connecting Marcus! Yes, I saw your message. We recently went through a round and are actively looking at tools to scale our outbound. Happy to chat. What does your process look like?',
    classification: 'interested', confidence: 0.89,
    aiSuggestedResponse: 'Hi David,\n\nGreat to hear you\'re scaling the outbound motion — congratulations on the round!\n\nOur process starts with a 25-minute discovery call where we map your ICP and show you a live demo with your actual target companies.\n\nHere\'s a link to book: [calendly-link]\n\nWould love to show you what this looks like for fintech in West Africa specifically.\n\nBest,\n[Your Name]',
    humanApproved: true, respondedAt: '2026-03-03T16:00:00Z',
    receivedAt: '2026-03-03T14:00:00Z', isRead: true,
  },
  {
    id: 'reply-003', messageId: 'msg-003', leadId: 'lead-003',
    leadName: 'James Harrington', leadEmail: 'james@vertexgrowth.co.uk', leadCompany: 'Vertex Growth Agency',
    campaignId: 'camp-3', campaignName: 'Agency Owner Cold Email', channel: 'email',
    body: 'Interesting timing on this. We\'ve been exploring options for client prospecting automation. What does pricing look like and can it handle B2B clients across multiple industries?',
    classification: 'neutral', confidence: 0.78,
    aiSuggestedResponse: 'Hi James,\n\nGreat questions — pricing is built around your volume and we have an agency plan specifically designed for managing multiple client campaigns.\n\nTo give you accurate numbers, it helps to understand your setup a bit more. Would you be open to a 20-minute call this week so I can give you a tailored walkthrough?\n\nBest,\n[Your Name]',
    receivedAt: '2026-03-18T11:30:00Z', isRead: false,
  },
  {
    id: 'reply-004', messageId: 'msg-004', leadId: 'lead-004',
    leadName: 'Priya Sharma', leadEmail: 'priya@cloudnest.io', leadCompany: 'CloudNest Inc.',
    campaignId: 'camp-1', campaignName: 'Q2 SaaS Founder Outreach', channel: 'email',
    body: 'Hi, I\'m currently on leave until April 7. For urgent matters, please contact my colleague at team@cloudnest.io. I\'ll respond to non-urgent emails when I return.',
    classification: 'ooo', confidence: 0.99,
    receivedAt: '2026-03-15T10:45:00Z', isRead: true,
  },
  {
    id: 'reply-005', messageId: 'msg-005', leadId: 'lead-002',
    leadName: 'Adaeze Okafor', leadEmail: 'adaeze@luminabeauty.co', leadCompany: 'Lumina Beauty Co.',
    campaignId: 'camp-2', campaignName: 'DTC Ecom Brands — Instagram First', channel: 'instagram',
    body: 'Hey! Thanks for reaching out. We\'re actually not looking for any tools or services right now. We\'re focused on product development this quarter. Maybe another time!',
    classification: 'not_interested', confidence: 0.91,
    receivedAt: '2026-03-16T14:20:00Z', isRead: true,
  },
]

// ─── Analytics ────────────────────────────────────────────────────────────────
export const mockAnalyticsOverview: AnalyticsOverview = {
  leadsDiscovered: 1847,
  leadsQualified: 1203,
  outreachSent: 715,
  repliesReceived: 108,
  positiveReplies: 47,
  appointmentsBooked: 23,
  replyRate: 15.1,
  positiveReplyRate: 6.6,
  conversionRate: 3.2,
  avgLeadScore: 67,
  costPerLead: 11.20,
  costPerAppointment: 97.40,
}

export const mockTimeSeries: TimeSeriesPoint[] = [
  { date: 'Jan 1', sent: 45, replied: 6, converted: 2, leadsDiscovered: 120 },
  { date: 'Jan 8', sent: 68, replied: 9, converted: 3, leadsDiscovered: 145 },
  { date: 'Jan 15', sent: 82, replied: 11, converted: 4, leadsDiscovered: 167 },
  { date: 'Jan 22', sent: 91, replied: 13, converted: 4, leadsDiscovered: 189 },
  { date: 'Jan 29', sent: 76, replied: 10, converted: 3, leadsDiscovered: 158 },
  { date: 'Feb 5', sent: 105, replied: 15, converted: 5, leadsDiscovered: 210 },
  { date: 'Feb 12', sent: 118, replied: 17, converted: 6, leadsDiscovered: 234 },
  { date: 'Feb 19', sent: 132, replied: 20, converted: 7, leadsDiscovered: 256 },
  { date: 'Feb 26', sent: 145, replied: 22, converted: 8, leadsDiscovered: 278 },
  { date: 'Mar 5', sent: 158, replied: 24, converted: 8, leadsDiscovered: 298 },
  { date: 'Mar 12', sent: 171, replied: 26, converted: 9, leadsDiscovered: 315 },
  { date: 'Mar 19', sent: 184, replied: 28, converted: 10, leadsDiscovered: 332 },
  { date: 'Mar 26', sent: 198, replied: 31, converted: 11, leadsDiscovered: 348 },
]

export const mockChannelPerformance: ChannelPerformance[] = [
  { channel: 'email', sent: 432, replied: 58, replyRate: 13.4, converted: 14, conversionRate: 3.2 },
  { channel: 'linkedin', sent: 201, replied: 38, replyRate: 18.9, converted: 7, conversionRate: 3.5 },
  { channel: 'instagram', sent: 82, replied: 12, replyRate: 14.6, converted: 2, conversionRate: 2.4 },
]

export const mockFunnel: FunnelStage[] = [
  { stage: 'Leads Discovered', count: 1847, percentage: 100, color: '#3b82f6' },
  { stage: 'Qualified', count: 1203, percentage: 65.1, color: '#8b5cf6' },
  { stage: 'Contacted', count: 715, percentage: 38.7, color: '#f59e0b' },
  { stage: 'Replied', count: 108, percentage: 5.8, color: '#10b981' },
  { stage: 'Converted', count: 23, percentage: 1.2, color: '#ef4444' },
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'reply', title: 'New reply from Marcus Chen', message: 'Stackify Labs — Interested in a call this Thursday', read: false, createdAt: '2026-03-12T09:15:00Z', link: '/inbox' },
  { id: 'n2', type: 'appointment', title: 'Appointment booked!', message: 'David Osei (Finova Systems) booked a 25-min call for March 8', read: false, createdAt: '2026-03-05T16:30:00Z', link: '/inbox' },
  { id: 'n3', type: 'campaign', title: 'Campaign milestone', message: 'Q2 SaaS Founder Outreach hit 300 leads enrolled', read: true, createdAt: '2026-03-10T12:00:00Z', link: '/campaigns' },
  { id: 'n4', type: 'lead', title: '47 new leads qualified', message: 'LinkedIn discovery batch completed — 47 hot leads ready for outreach', read: true, createdAt: '2026-03-09T08:00:00Z', link: '/leads' },
  { id: 'n5', type: 'reply', title: 'New reply from James Harrington', message: 'Vertex Growth Agency — Questions about pricing and multi-industry support', read: false, createdAt: '2026-03-18T11:30:00Z', link: '/inbox' },
]

// ─── Industry Options ─────────────────────────────────────────────────────────
export const INDUSTRIES = [
  'SaaS / Software', 'Fintech', 'E-commerce / DTC', 'Digital Marketing Agency',
  'Real Estate', 'Healthcare / MedTech', 'EdTech', 'Legal Services',
  'Consulting', 'Manufacturing', 'Logistics / Supply Chain', 'Media / Publishing',
  'HR / Recruitment', 'Hospitality / Travel', 'Non-Profit', 'Construction',
]

export const DECISION_MAKER_ROLES = [
  'CEO', 'Co-Founder', 'CTO', 'CMO', 'COO', 'Head of Marketing',
  'Head of Growth', 'Head of Sales', 'Managing Director', 'VP of Engineering',
  'Agency Owner', 'Founder', 'Director of Operations', 'Partner',
]

export const GEOGRAPHIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Nigeria',
  'South Africa', 'Ghana', 'Kenya', 'Germany', 'France', 'India',
  'Singapore', 'UAE', 'Brazil', 'Mexico', 'Netherlands', 'Sweden',
]
