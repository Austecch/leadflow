'use client'
import { useState } from 'react'
import { Sparkles, Send, Mail, Linkedin, Instagram, RefreshCw, CheckCircle, Copy, ChevronDown, Wand2 } from 'lucide-react'
import { mockLeads, mockCampaigns } from '@/lib/mock-data'
import type { CampaignChannel, Lead } from '@/lib/types'

const CHANNEL_CONFIG = {
  email: { icon: <Mail size={16} color="#2563eb" />, label: 'Email', maxWords: 120, bgColor: '#eff6ff', borderColor: '#bfdbfe' },
  linkedin: { icon: <Linkedin size={16} color="#0a66c2" />, label: 'LinkedIn DM', maxWords: 80, bgColor: '#eff6ff', borderColor: '#bfdbfe' },
  instagram: { icon: <Instagram size={16} color="#9333ea" />, label: 'Instagram DM', maxWords: 60, bgColor: '#fdf4ff', borderColor: '#e9d5ff' },
}

function SignalTag({ signal }: { signal: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
      <CheckCircle size={10} /> {signal}
    </span>
  )
}

function MessagePreview({ subject, body, channel, signals, confidence, loading }: { subject?: string; body: string; channel: CampaignChannel; signals: string[]; confidence: number; loading: boolean }) {
  const [copied, setCopied] = useState(false)
  const wordCount = body.split(' ').filter(Boolean).length
  const conf = Math.round(confidence * 100)

  function handleCopy() {
    navigator.clipboard.writeText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="ai-tag"><Sparkles size={11} /> AI Generated</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>·</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>{wordCount} words</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 40 }}>
              <div className="score-bar">
                <div className="score-bar-fill" style={{ width: `${conf}%`, background: conf >= 85 ? '#10b981' : '#f59e0b' }} />
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: conf >= 85 ? '#10b981' : '#d97706' }}>{conf}% confidence</span>
          </div>
          <button className="btn btn-sm btn-ghost" style={{ padding: '4px 8px' }} onClick={handleCopy}>
            {copied ? <CheckCircle size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Message body */}
      {loading ? (
        <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div className="loading-dots"><span /><span /><span /></div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Claude is reading their profile and crafting a message...</div>
        </div>
      ) : (
        <div style={{ padding: '16px 18px' }}>
          {subject && (
            <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject: </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{subject}</span>
            </div>
          )}
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{body}</div>
        </div>
      )}

      {/* Signals */}
      {signals.length > 0 && !loading && (
        <div style={{ padding: '10px 18px', borderTop: '1px solid #f1f5f9', background: '#fafcff' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 7 }}>Personalization signals used:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {signals.map((s, i) => <SignalTag key={i} signal={s} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OutreachPage() {
  const [selectedLead, setSelectedLead] = useState<Lead>(mockLeads[0])
  const [selectedCampaign, setSelectedCampaign] = useState(mockCampaigns[0])
  const [channel, setChannel] = useState<CampaignChannel>('email')
  const [step, setStep] = useState(1)
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ subject?: string; body: string; personalizationSignals: string[]; confidence: number } | null>(null)
  const [variants, setVariants] = useState<string[]>([])
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [batchLeads, setBatchLeads] = useState<typeof mockLeads>([])
  const [batchLoading, setBatchLoading] = useState(false)
  const [batchResults, setBatchResults] = useState<Array<{ lead: Lead; body: string; subject?: string }>>([])

  async function handleGenerate() {
    setLoading(true)
    setResult(null)
    setVariants([])
    try {
      const res = await fetch('/api/ai/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            businessName: selectedLead.businessName, contactName: selectedLead.contactName,
            jobTitle: selectedLead.jobTitle, industry: selectedLead.industry,
            location: selectedLead.location, website: selectedLead.website, linkedin: selectedLead.linkedin,
          },
          campaign: { name: selectedCampaign.name, channels: selectedCampaign.channels },
          icp: { industry: ['SaaS', 'E-commerce'], decisionMakerRoles: ['CEO', 'Founder', 'CTO'] },
          channel, stepNumber: step, additionalContext: context || undefined,
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({
        subject: channel === 'email' ? `Quick idea for ${selectedLead.businessName}` : undefined,
        body: `Hey ${selectedLead.contactName.split(' ')[0]},\n\nJust came across ${selectedLead.businessName} and had to reach out — the work you're doing in the ${selectedLead.industry.split('/')[0].trim()} space is exactly the kind of challenge we love helping with.\n\nWe've been helping ${selectedLead.jobTitle.includes('Founder') ? 'founders' : 'teams'} like yours cut prospecting time by 70% while tripling reply rates with AI-personalized outreach.\n\nWould it be worth a 20-minute call to see if we can do the same for you?\n\n[Your name]`,
        personalizationSignals: [`${selectedLead.industry} industry context`, `${selectedLead.jobTitle} role-specific tone`, `${selectedLead.location}-based approach`, 'Value-first structure'],
        confidence: 0.88,
      })
    }
    setLoading(false)
  }

  async function handleBatchGenerate() {
    if (batchLeads.length === 0) { alert('Select at least 1 lead for batch generation.'); return }
    setBatchLoading(true)
    setBatchResults([])
    for (const lead of batchLeads.slice(0, 3)) {
      await new Promise(r => setTimeout(r, 900))
      setBatchResults(prev => [...prev, {
        lead,
        subject: channel === 'email' ? `Quick thought for ${lead.businessName}` : undefined,
        body: `Hey ${lead.contactName.split(' ')[0]},\n\nSaw what ${lead.businessName} is building in the ${lead.industry.split('/')[0].trim()} space — really impressive.\n\nWe help companies like yours automate their outbound without losing the personal touch. Would love to share how.\n\n15 minutes this week?`,
      }])
    }
    setBatchLoading(false)
  }

  function toggleBatchLead(lead: Lead) {
    setBatchLeads(prev => prev.some(l => l.id === lead.id) ? prev.filter(l => l.id !== lead.id) : [...prev, lead])
  }

  return (
    <div style={{ padding: 28, maxWidth: 1300 }}>
      {/* Header */}
      <div className="animate-in" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>AI Outreach</div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>AI Personalization Engine</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Generate hyper-personalized messages using Claude AI. Single lead or batch generation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
        {/* Left: Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Lead Selection */}
          <div className="card animate-in" style={{ padding: 18 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12 }}>1. Select Lead</div>
            <select className="select" value={selectedLead.id} onChange={e => { const l = mockLeads.find(l => l.id === e.target.value); if (l) setSelectedLead(l); setResult(null) }}>
              {mockLeads.map(l => <option key={l.id} value={l.id}>{l.contactName} · {l.businessName}</option>)}
            </select>
            {/* Lead Preview */}
            <div style={{ marginTop: 12, padding: '12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: 'Plus Jakarta Sans' }}>
                  {selectedLead.contactName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{selectedLead.contactName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{selectedLead.jobTitle} · {selectedLead.businessName}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                <div style={{ fontSize: 12, color: '#64748b' }}><span style={{ fontWeight: 600, color: '#374151' }}>Industry:</span> {selectedLead.industry.substring(0, 20)}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}><span style={{ fontWeight: 600, color: '#374151' }}>Location:</span> {selectedLead.location}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}><span style={{ fontWeight: 600, color: '#374151' }}>Score:</span> {selectedLead.score}/100</div>
                <div style={{ fontSize: 12, color: '#64748b' }}><span style={{ fontWeight: 600, color: '#374151' }}>Temp:</span> {selectedLead.temperature}</div>
              </div>
            </div>
          </div>

          {/* Channel & Step */}
          <div className="card animate-in delay-1" style={{ padding: 18 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12 }}>2. Configure Message</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Channel</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {(Object.keys(CHANNEL_CONFIG) as CampaignChannel[]).map(ch => {
                  const cfg = CHANNEL_CONFIG[ch]
                  return (
                    <button key={ch} onClick={() => { setChannel(ch); setResult(null) }} style={{
                      padding: '8px 6px', borderRadius: 8, border: `1px solid ${channel === ch ? cfg.borderColor : '#e2e8f0'}`,
                      background: channel === ch ? cfg.bgColor : 'white', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                    }}>
                      {cfg.icon}
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Sequence Step</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4].map(s => (
                  <button key={s} onClick={() => { setStep(s); setResult(null) }} style={{
                    flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${step === s ? '#3b82f6' : '#e2e8f0'}`,
                    background: step === s ? '#eff6ff' : 'white', cursor: 'pointer',
                    fontSize: 13, fontWeight: 700, color: step === s ? '#2563eb' : '#374151'
                  }}>Step {s}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                {step === 1 ? 'Initial outreach' : step === 2 ? 'Follow-up (Day 4)' : step === 3 ? 'Second follow-up (Day 9)' : 'Break-up message (Day 15)'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Extra Context (optional)</label>
              <textarea className="input" placeholder="e.g. They just announced a funding round..." value={context} onChange={e => setContext(e.target.value)} style={{ resize: 'vertical', height: 70 }} />
            </div>
          </div>

          {/* Generate Button */}
          <button className="btn btn-primary btn-lg animate-in delay-2" onClick={handleGenerate} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><div className="loading-dots"><span /><span /><span /></div> Crafting with Claude...</> : <><Wand2 size={18} /> Generate Personalized Message</>}
          </button>
        </div>

        {/* Right: Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Result */}
          {(result || loading) && (
            <div className="card animate-in" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={15} color="#4f46e5" />
                  </div>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Generated Message</span>
                </div>
                {result && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-ghost" onClick={handleGenerate}><RefreshCw size={13} /> Regenerate</button>
                    <button className="btn btn-sm btn-primary"><Send size={13} /> Add to Queue</button>
                  </div>
                )}
              </div>
              {result && (
                <MessagePreview
                  subject={result.subject} body={result.body} channel={channel}
                  signals={result.personalizationSignals} confidence={result.confidence} loading={loading}
                />
              )}
              {loading && !result && (
                <MessagePreview subject="" body="" channel={channel} signals={[]} confidence={0} loading={true} />
              )}
            </div>
          )}

          {/* Batch Generation */}
          <div className="card animate-in delay-2" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Batch Generation</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Generate messages for multiple leads at once</div>
              </div>
              <button className="btn btn-sm btn-primary" onClick={handleBatchGenerate} disabled={batchLoading || batchLeads.length === 0}>
                {batchLoading ? <><div className="loading-dots"><span /><span /><span /></div>Generating...</> : <><Sparkles size={13} /> Generate Batch ({batchLeads.length})</>}
              </button>
            </div>

            {/* Lead Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, maxHeight: 180, overflowY: 'auto' }}>
              {mockLeads.filter(l => l.temperature !== 'cold').map(lead => (
                <label key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: batchLeads.some(l => l.id === lead.id) ? '#eff6ff' : '#f8fafc', border: `1px solid ${batchLeads.some(l => l.id === lead.id) ? '#bfdbfe' : '#f1f5f9'}`, cursor: 'pointer' }}>
                  <input type="checkbox" checked={batchLeads.some(l => l.id === lead.id)} onChange={() => toggleBatchLead(lead)} style={{ cursor: 'pointer' }} />
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0, fontFamily: 'Plus Jakarta Sans' }}>
                    {lead.contactName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{lead.contactName}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{lead.businessName} · Score: {lead.score}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: lead.temperature === 'hot' ? '#ef4444' : '#d97706' }}>
                    {lead.temperature === 'hot' ? '🔥' : '🌤'}
                  </span>
                </label>
              ))}
            </div>

            {/* Batch Results */}
            {batchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{batchResults.length} messages generated:</div>
                {batchResults.map((r, i) => (
                  <div key={i} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{r.lead.contactName} — {r.lead.businessName}</div>
                    {r.subject && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}><strong>Subject:</strong> {r.subject}</div>}
                    <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{r.body}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button className="btn btn-sm btn-secondary" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => navigator.clipboard.writeText(r.body)}><Copy size={11} /> Copy</button>
                      <button className="btn btn-sm btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}><Send size={11} /> Queue</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placeholder when nothing generated */}
          {!result && !loading && batchResults.length === 0 && (
            <div style={{ padding: '48px 24px', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: 12, background: '#fafbff' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Sparkles size={24} color="#4f46e5" />
              </div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 6 }}>Ready to personalize</div>
              <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 320, margin: '0 auto' }}>
                Select a lead, choose your channel and step, then hit "Generate" to craft a message with Claude AI.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
