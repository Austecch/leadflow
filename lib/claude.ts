import Anthropic from '@anthropic-ai/sdk'
import type { PersonalizationRequest, PersonalizationResult } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generatePersonalizedMessage(req: PersonalizationRequest): Promise<PersonalizationResult> {
  const { lead, channel, stepNumber, icp } = req

  const channelInstructions: Record<string, string> = {
    email: 'Write a cold email (80-120 words, subject line required). Keep it conversational, value-first, and end with a single clear CTA.',
    linkedin: 'Write a LinkedIn DM (50-80 words). Be direct and professional. No subject line needed.',
    instagram: 'Write an Instagram DM (30-60 words). Keep it casual, friendly, and genuine. Emoji OK but max 1-2.',
  }

  const stepContext: Record<number, string> = {
    1: 'This is the FIRST outreach message. Be warm, personalized, and reference something specific about their business.',
    2: 'This is a FOLLOW-UP (day 4). Acknowledge you sent a previous message. Add new context, angle, or a case study reference.',
    3: 'This is a SECOND FOLLOW-UP (day 9). Try a different angle — focus on outcomes/ROI, not features.',
    4: 'This is a FINAL FOLLOW-UP (break-up message, day 15). Keep it brief, low pressure. Leave the door open gracefully.',
  }

  const prompt = `You are an expert B2B outreach copywriter. Generate a highly personalized ${channel} message.

LEAD INFORMATION:
- Name: ${lead.contactName}
- Company: ${lead.businessName}
- Job Title: ${lead.jobTitle}
- Industry: ${lead.industry}
- Location: ${lead.location}
${lead.website ? `- Website: ${lead.website}` : ''}
${lead.linkedin ? `- LinkedIn: ${lead.linkedin}` : ''}

TARGET AUDIENCE CONTEXT:
- Industries we serve: ${icp.industry.join(', ')}
- Decision-maker roles: ${icp.decisionMakerRoles.join(', ')}

CHANNEL: ${channel.toUpperCase()}
${channelInstructions[channel]}

STEP CONTEXT: ${stepContext[stepNumber] || stepContext[1]}

CRITICAL RULES:
1. Use "{{firstName}}" and "{{businessName}}" as placeholders for the actual name/company
2. NEVER use generic openings like "I hope this finds you well" or "My name is X and I work at Y"
3. Reference something SPECIFIC about their industry, role, or likely challenges
4. The tone must be human, warm, and direct — not salesy or robotic
5. End with ONE clear call-to-action only
6. Do NOT mention AI or automation in the message
7. Do NOT include unsubscribe links (handled separately)

Respond in this exact JSON format:
{
  "subject": "subject line here (email only, null for other channels)",
  "body": "message body here",
  "personalizationSignals": ["signal 1", "signal 2", "signal 3"],
  "confidence": 0.0-1.0
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in AI response')

  const result = JSON.parse(jsonMatch[0])
  return {
    subject: result.subject || undefined,
    body: result.body,
    personalizationSignals: result.personalizationSignals || [],
    confidence: result.confidence || 0.85,
  }
}

export async function classifyReply(replyBody: string, originalContext: string): Promise<{
  classification: 'interested' | 'not_interested' | 'neutral' | 'ooo' | 'referral'
  confidence: number
  suggestedResponse: string
}> {
  const prompt = `You are an expert at classifying sales reply emails.

ORIGINAL OUTREACH CONTEXT: ${originalContext}

REPLY TO CLASSIFY:
"${replyBody}"

Classify this reply into one of these categories:
- "interested": Positive, wants to learn more, asks follow-up questions, or agrees to meet
- "not_interested": Clear rejection, not the right time, no thank you
- "neutral": Asks clarifying questions without committing, wants pricing info
- "ooo": Out of office auto-reply
- "referral": Redirecting to a different person/team

Also provide a suggested human-like response for "interested" and "neutral" replies.

Respond in JSON format:
{
  "classification": "interested|not_interested|neutral|ooo|referral",
  "confidence": 0.0-1.0,
  "suggestedResponse": "response text here, or null if not applicable"
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in AI response')
  return JSON.parse(jsonMatch[0])
}

export async function generateICP(inputs: {
  industry: string[]
  businessType: string
  companySizeMin: number
  companySizeMax: number
  geography: string[]
  decisionMakerRoles: string[]
}): Promise<{
  icpSummary: string
  keyPainPoints: string[]
  messagingAngles: string[]
  qualificationQuestions: string[]
}> {
  const prompt = `Based on the following targeting inputs, generate a detailed Ideal Customer Profile (ICP) analysis.

TARGETING INPUTS:
- Industries: ${inputs.industry.join(', ')}
- Business Type: ${inputs.businessType}
- Company Size: ${inputs.companySizeMin}-${inputs.companySizeMax} employees
- Geography: ${inputs.geography.join(', ')}
- Decision-Maker Roles: ${inputs.decisionMakerRoles.join(', ')}

Provide:
1. A clear ICP summary paragraph (2-3 sentences)
2. Top 4-5 pain points this audience likely faces
3. Top 3-4 messaging angles that would resonate with them
4. 3-4 qualifying questions to identify the best-fit leads

Respond in JSON format:
{
  "icpSummary": "...",
  "keyPainPoints": ["pain1", "pain2", "pain3", "pain4"],
  "messagingAngles": ["angle1", "angle2", "angle3"],
  "qualificationQuestions": ["q1", "q2", "q3"]
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in AI response')
  return JSON.parse(jsonMatch[0])
}
