'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle, ChevronRight, ChevronLeft, Target, Mail, Linkedin, Instagram,
  Plus, Trash2, Sparkles, Zap, Clock, Globe, Users, Send, Eye, GripVertical,
  ArrowRight, AlertCircle
} from 'lucide-react'
import { mockICPs } from '@/lib/mock-data'
import type { CampaignChannel, CampaignStep } from '@/lib/types'

const STEPS = ['Select ICP', 'Configure Channels', 'Build Sequence', 'Set Schedule', 'Review & Launch']

const CHANNEL_INFO: Record<CampaignChannel, { icon: any; label: string; color: string; bg: string; border: string; limit: string; desc: string }> = {
  email: { icon: <Mail size={20} />, label: 'Email', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', limit: '500/day', desc: 'Highest volume. Best for long-form personalization.' },
  linkedin: { icon: <Linkedin size={20} />, label: 'LinkedIn DM', color: '#0a66c2', bg: '#eff6ff', border: '#bfdbfe', limit: '50/day', desc: 'Highest reply rate. Best for B2B decision-makers.' },
  instagram: { icon: <Instagram size={20} />, label: 'Instagram DM', color: '#9333ea', bg: '#fdf4ff', border: '#e9d5ff', limit: '80/day', desc: 'Best for DTC brands, creators, and lifestyle niches.' },
}

const STEP_TEMPLATES: Array<Partial<CampaignStep>> = [
  { stepNumber: 1, channel: 'email', dayOffset: 0, subject: 'Quick idea for {{businessName}}', messageTemplate: '', aiPersonalized: true, triggerCondition: 'always' },
  { stepNumber: 2, channel: 'linkedin', dayOffset: 4, messageTemplate: '', aiPersonalized: true, triggerCondition: 'no_reply' },
  { stepNumber: 3, channel: 'email', dayOffset: 9, subject: 'Re: Quick idea for {{businessName}}', messageTemplate: '', aiPersonalized: true, triggerCondition: 'no_reply' },
  { stepNumber: 4, channel: 'email', dayOffset: 15, subject: 'Leaving this here, {{firstName}}', messageTemplate: '', aiPersonalized: true, triggerCondition: 'no_reply' },
]

const TIMEZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'Europe/London', 'Africa/Lagos', 'Asia/Kolkata', 'Australia/Sydney']

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
      {STEPS.map((label, i) => {
        const done = i < currentStep
        const active = i === currentStep
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
                background: done ? '#10b981' : active ? '#3b82f6' : '#e2e8f0',
                color: done || active ? 'white' : '#94a3b8',
                border: `2px solid ${done ? '#10b981' : active ? '#3b82f6' : '#e2e8f0'}`,
                transition: 'all 0.3s', fontFamily: 'Plus Jakarta Sans',
              }}>
                {done ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? '#1d4ed8' : done ? '#10b981' : '#94a3b8', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? '#10b981' : '#e2e8f0', margin: '0 8px', marginBottom: 22, transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepCard({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: '#0f172a', margin: '0 0 6px' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [campaignName, setCampaignName] = useState('')
  const [campaignDesc, setCampaignDesc] = useState('')
  const [selectedICP, setSelectedICP] = useState(mockICPs[0])
  const [selectedChannels, setSelectedChannels] = useState<CampaignChannel[]>(['email'])
  const [sequenceSteps, setSequenceSteps] = useState<Partial<CampaignStep>[]>([STEP_TEMPLATES[0]])
  const [targetCount, setTargetCount] = useState(200)
  const [sendStart, setSendStart] = useState('09:00')
  const [sendEnd, setSendEnd] = useState('17:00')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  function toggleChannel(ch: CampaignChannel) {
    setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch])
  }

  function addSequenceStep() {
    const nextTemplate = STEP_TEMPLATES[sequenceSteps.length] || {
      channel: 'email', dayOffset: (sequenceSteps[sequenceSteps.length - 1]?.dayOffset || 0) + 5,
      messageTemplate: '', aiPersonalized: true, triggerCondition: 'no_reply' as const,
    }
    setSequenceSteps(prev => [...prev, { ...nextTemplate, stepNumber: prev.length + 1, id: `step-${Date.now()}` }])
  }

  function removeStep(i: number) {
    setSequenceSteps(prev => prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 })))
  }

  function updateStep(i: number, key: string, value: any) {
    setSequenceSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: value } : s))
  }

  function validate(): boolean {
    const errs: string[] = []
    if (step === 0 && !campaignName.trim()) errs.push('Campaign name is required.')
    if (step === 1 && selectedChannels.length === 0) errs.push('Select at least one channel.')
    if (step === 2 && sequenceSteps.length === 0) errs.push('Add at least one sequence step.')
    setErrors(errs)
    return errs.length === 0
  }

  function handleNext() {
    if (!validate()) return
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }

  async function handleLaunch() {
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 1800))
    setSaving(false)
    router.push('/campaigns')
  }

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-in" style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Campaign Builder</div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Create New Campaign</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Set up your ICP, channels, and AI-powered sequence in minutes.</p>
      </div>

      <StepIndicator currentStep={step} />

      {/* Error banner */}
      {errors.length > 0 && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, display: 'flex', gap: 8 }}>
          <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: '#b91c1c' }}>{errors.join(' ')}</div>
        </div>
      )}

      <div className="card" style={{ padding: 32, minHeight: 420 }}>

        {/* ── Step 0: ICP & Name ── */}
        {step === 0 && (
          <StepCard title="Name your campaign & choose an ICP" subtitle="A well-defined ICP is the foundation of every successful campaign.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Campaign Name *</label>
                <input className="input" placeholder="e.g. Q2 SaaS Founder Outreach" value={campaignName} onChange={e => setCampaignName(e.target.value)} style={{ fontSize: 15 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Description (optional)</label>
                <input className="input" placeholder="What's the goal of this campaign?" value={campaignDesc} onChange={e => setCampaignDesc(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>Select ICP *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {mockICPs.map(icp => (
                    <div key={icp.id} onClick={() => setSelectedICP(icp)} style={{
                      padding: '14px 16px', borderRadius: 10, border: `2px solid ${selectedICP.id === icp.id ? '#3b82f6' : '#e2e8f0'}`,
                      background: selectedICP.id === icp.id ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: selectedICP.id === icp.id ? '#dbeafe' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                        <Target size={17} color={selectedICP.id === icp.id ? '#2563eb' : '#94a3b8'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{icp.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{icp.businessType} · {icp.industry.slice(0, 2).join(', ')} · {icp.geography.slice(0, 2).join(', ')}</div>
                      </div>
                      {selectedICP.id === icp.id && <CheckCircle size={18} color="#2563eb" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StepCard>
        )}

        {/* ── Step 1: Channels ── */}
        {step === 1 && (
          <StepCard title="Choose your outreach channels" subtitle="You can select multiple channels. Each operates within its own daily rate limit.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {(Object.keys(CHANNEL_INFO) as CampaignChannel[]).map(ch => {
                const info = CHANNEL_INFO[ch]
                const selected = selectedChannels.includes(ch)
                return (
                  <div key={ch} onClick={() => toggleChannel(ch)} style={{
                    padding: '18px 20px', borderRadius: 12, border: `2px solid ${selected ? info.border : '#e2e8f0'}`,
                    background: selected ? info.bg : 'white', cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: selected ? `${info.color}15` : '#f8fafc', border: `1px solid ${selected ? info.border : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: selected ? info.color : '#94a3b8', flexShrink: 0 }}>
                      {info.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{info.label}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: '#64748b', padding: '2px 8px', background: '#f1f5f9', borderRadius: 100, fontWeight: 600 }}>
                            {info.limit}
                          </span>
                          {selected && <CheckCircle size={18} color={info.color} />}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{info.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
              <div style={{ fontSize: 13, color: '#92400e', fontWeight: 600, marginBottom: 4 }}>💡 Pro tip</div>
              <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6 }}>
                Combining Email + LinkedIn delivers the highest reply rates. LinkedIn follows up on emails that weren't opened, and vice versa.
              </div>
            </div>
          </StepCard>
        )}

        {/* ── Step 2: Sequence Builder ── */}
        {step === 2 && (
          <StepCard title="Build your outreach sequence" subtitle="Each step is AI-personalized using Claude. Triggers fire automatically on no-reply detection.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {sequenceSteps.map((s, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', background: 'white' }}>
                  {/* Step header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                    <GripVertical size={15} color="#94a3b8" />
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      {/* Channel select */}
                      <select className="select" value={s.channel || 'email'} onChange={e => updateStep(i, 'channel', e.target.value)} style={{ width: 'auto', padding: '5px 10px', fontSize: 13, fontWeight: 600 }}>
                        {selectedChannels.map(ch => <option key={ch} value={ch}>{CHANNEL_INFO[ch].label}</option>)}
                        {selectedChannels.length === 0 && (Object.keys(CHANNEL_INFO) as CampaignChannel[]).map(ch => <option key={ch} value={ch}>{CHANNEL_INFO[ch].label}</option>)}
                      </select>
                      {/* Day offset */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                        <Clock size={13} color="#94a3b8" />
                        Day
                        <input type="number" value={s.dayOffset || 0} min={0} max={90} onChange={e => updateStep(i, 'dayOffset', Number(e.target.value))} style={{ width: 48, padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, textAlign: 'center', fontFamily: 'DM Sans', outline: 'none' }} />
                      </div>
                      {/* Trigger */}
                      <select className="select" value={s.triggerCondition || 'no_reply'} onChange={e => updateStep(i, 'triggerCondition', e.target.value)} style={{ width: 'auto', padding: '5px 10px', fontSize: 13 }}>
                        <option value="always">Always send</option>
                        <option value="no_reply">If no reply</option>
                        <option value="no_open">If not opened</option>
                      </select>
                      {/* AI tag */}
                      {s.aiPersonalized && <span className="ai-tag"><Sparkles size={10} /> AI personalized</span>}
                    </div>
                    <button onClick={() => removeStep(i)} className="btn btn-sm btn-ghost" style={{ padding: '4px 6px', color: '#94a3b8' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Step body */}
                  <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {s.channel === 'email' && (
                      <input className="input" placeholder="Subject line (use {{firstName}}, {{businessName}})" value={s.subject || ''} onChange={e => updateStep(i, 'subject', e.target.value)} style={{ fontSize: 13 }} />
                    )}
                    <textarea className="input" rows={3} placeholder={`Write your message template... Use {{firstName}}, {{businessName}}, {{jobTitle}}\nLeave empty to let Claude AI generate it for each lead.`} value={s.messageTemplate || ''} onChange={e => updateStep(i, 'messageTemplate', e.target.value)} style={{ resize: 'vertical', fontSize: 13, lineHeight: 1.6 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" id={`ai-${i}`} checked={s.aiPersonalized || false} onChange={e => updateStep(i, 'aiPersonalized', e.target.checked)} style={{ accentColor: '#3b82f6', cursor: 'pointer' }} />
                      <label htmlFor={`ai-${i}`} style={{ fontSize: 12, color: '#64748b', cursor: 'pointer', fontWeight: 500 }}>Let Claude AI personalize this message for each lead (recommended)</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={addSequenceStep} disabled={sequenceSteps.length >= 6}>
              <Plus size={15} /> Add Step {sequenceSteps.length < 6 ? `(${sequenceSteps.length}/6)` : '(Max 6)'}
            </button>
          </StepCard>
        )}

        {/* ── Step 3: Schedule ── */}
        {step === 3 && (
          <StepCard title="Set sending schedule" subtitle="All messages send within your defined window. Timezone-aware and randomized by ±15 min to appear natural.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  <Clock size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  Send Window Start
                </label>
                <input type="time" className="input" value={sendStart} onChange={e => setSendStart(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  <Clock size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  Send Window End
                </label>
                <input type="time" className="input" value={sendEnd} onChange={e => setSendEnd(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  <Globe size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  Timezone
                </label>
                <select className="select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  <Users size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  Target Lead Count
                </label>
                <input type="number" className="input" value={targetCount} min={10} max={10000} onChange={e => setTargetCount(Number(e.target.value))} />
              </div>
            </div>

            {/* Send days */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>Send Days</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <button key={day} style={{
                    width: 44, height: 44, borderRadius: 8, border: `1px solid ${i < 5 ? '#bfdbfe' : '#e2e8f0'}`,
                    background: i < 5 ? '#eff6ff' : '#f8fafc', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, color: i < 5 ? '#2563eb' : '#94a3b8',
                  }}>{day}</button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Weekdays selected by default. Click to toggle.</div>
            </div>

            {/* Rate limits summary */}
            <div style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Daily Sending Limits</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedChannels.map(ch => (
                  <div key={ch} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {CHANNEL_INFO[ch].icon} {CHANNEL_INFO[ch].label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{CHANNEL_INFO[ch].limit}</span>
                  </div>
                ))}
              </div>
            </div>
          </StepCard>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && (
          <StepCard title="Review & launch your campaign" subtitle="Everything looks good? Hit launch to start enrolling leads.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Summary cards */}
              {[
                {
                  icon: <Zap size={18} color="#2563eb" />, label: 'Campaign', bg: '#eff6ff', border: '#bfdbfe',
                  items: [{ k: 'Name', v: campaignName || '—' }, { k: 'Description', v: campaignDesc || 'None' }, { k: 'Target Leads', v: targetCount.toLocaleString() }]
                },
                {
                  icon: <Target size={18} color="#8b5cf6" />, label: 'ICP', bg: '#f5f3ff', border: '#ddd6fe',
                  items: [{ k: 'Profile', v: selectedICP.name }, { k: 'Industry', v: selectedICP.industry.join(', ') }, { k: 'Roles', v: selectedICP.decisionMakerRoles.slice(0, 3).join(', ') }]
                },
                {
                  icon: <Send size={18} color="#10b981" />, label: 'Channels & Sequence', bg: '#f0fdf4', border: '#bbf7d0',
                  items: [{ k: 'Channels', v: selectedChannels.map(c => CHANNEL_INFO[c].label).join(', ') }, { k: 'Steps', v: `${sequenceSteps.length} messages` }, { k: 'AI Personalized', v: `${sequenceSteps.filter(s => s.aiPersonalized).length} of ${sequenceSteps.length} steps` }]
                },
                {
                  icon: <Clock size={18} color="#f59e0b" />, label: 'Schedule', bg: '#fffbeb', border: '#fde68a',
                  items: [{ k: 'Send Window', v: `${sendStart} – ${sendEnd}` }, { k: 'Timezone', v: timezone }, { k: 'Days', v: 'Monday – Friday' }]
                },
              ].map((section, i) => (
                <div key={i} style={{ padding: '14px 16px', background: section.bg, border: `1px solid ${section.border}`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    {section.icon}
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{section.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {section.items.map((item, j) => (
                      <div key={j}>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 2 }}>{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ padding: '14px 16px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, display: 'flex', gap: 8 }}>
                <AlertCircle size={16} color="#854d0e" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 13, color: '#713f12', lineHeight: 1.6 }}>
                  Launching will begin enrolling leads from your ICP immediately. You can pause at any time from the Campaigns page.
                </div>
              </div>
            </div>
          </StepCard>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={() => step === 0 ? router.push('/campaigns') : setStep(s => s - 1)}>
          <ChevronLeft size={16} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Step {step + 1} of {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleLaunch} disabled={saving}>
              {saving ? <><div className="loading-dots"><span /><span /><span /></div> Launching...</> : <><Zap size={16} /> Launch Campaign</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
