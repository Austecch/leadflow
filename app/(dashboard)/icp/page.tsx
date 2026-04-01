'use client'
import { useState } from 'react'
import { Plus, Target, Sparkles, ChevronDown, X, CheckCircle, Loader } from 'lucide-react'
import { mockICPs, INDUSTRIES, DECISION_MAKER_ROLES, GEOGRAPHIES } from '@/lib/mock-data'
import type { ICP } from '@/lib/types'

function TagSelector({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false)
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {selected.map(v => (
          <span key={v} className="tag">
            {v}
            <button onClick={() => toggle(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#2563eb', display: 'flex', lineHeight: 1 }}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => setOpen(!open)}>
          <span>Add {label}</span>
          <ChevronDown size={14} />
        </button>
        {open && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, zIndex: 100, maxHeight: 200, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', marginTop: 4 }}>
            {options.filter(o => !selected.includes(o)).map(opt => (
              <div key={opt} onClick={() => { toggle(opt); setOpen(false) }} style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', transition: 'background 0.1s', color: '#374151' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ICPCard({ icp }: { icp: ICP }) {
  return (
    <div className="card card-hover" style={{ padding: 20, cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Target size={17} color="#4f46e5" />
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{icp.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{icp.businessType} · {icp.companySizeMin}–{icp.companySizeMax} employees</div>
          </div>
        </div>
        <span className="badge badge-blue">Active</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {icp.industry.map(ind => <span key={ind} className="tag" style={{ fontSize: 11 }}>{ind}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Roles: </span>
          {icp.decisionMakerRoles.slice(0, 3).join(', ')}{icp.decisionMakerRoles.length > 3 ? '...' : ''}
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Geo: </span>
          {icp.geography.slice(0, 2).join(', ')}{icp.geography.length > 2 ? ` +${icp.geography.length - 2}` : ''}
        </div>
      </div>
      {icp.revenueRange && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Revenue: </span>{icp.revenueRange}
        </div>
      )}
    </div>
  )
}

export default function ICPPage() {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState<string[]>([])
  const [businessType, setBusinessType] = useState('B2B')
  const [sizeMin, setSizeMin] = useState(5)
  const [sizeMax, setSizeMax] = useState(200)
  const [geography, setGeography] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [revenue, setRevenue] = useState('')
  const [keywords, setKeywords] = useState('')
  const [generating, setGenerating] = useState(false)
  const [aiInsights, setAiInsights] = useState<{ icpSummary: string; keyPainPoints: string[]; messagingAngles: string[]; qualificationQuestions: string[] } | null>(null)
  const [icps, setIcps] = useState(mockICPs)

  async function handleGenerateICP() {
    if (!industry.length || !geography.length || !roles.length) {
      alert('Please select at least one Industry, Geography, and Decision-Maker Role.')
      return
    }
    setGenerating(true)
    setAiInsights(null)
    try {
      const res = await fetch('/api/ai/generate-icp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, businessType, companySizeMin: sizeMin, companySizeMax: sizeMax, geography, decisionMakerRoles: roles }),
      })
      const data = await res.json()
      setAiInsights(data)
    } catch {
      setAiInsights({
        icpSummary: `Your ideal customers are ${businessType} companies in ${industry[0] || 'your target industry'} with ${sizeMin}–${sizeMax} employees based in ${geography[0] || 'your target region'}. They're led by ${roles[0] || 'key decision-makers'} focused on growth, efficiency, and competitive advantage.`,
        keyPainPoints: ['Manual, time-consuming lead generation processes', 'Poor outreach personalization leading to low reply rates', 'Difficulty scaling sales without adding headcount', 'No unified view of pipeline health and conversion metrics'],
        messagingAngles: ['Focus on time saved and deals closed', 'Lead with industry-specific case studies and ROI', 'Highlight AI-driven personalization that feels human'],
        qualificationQuestions: ['Do you currently have an outbound sales process?', 'What does your current lead generation look like?', 'How many leads does your team prospect per week?'],
      })
    }
    setGenerating(false)
  }

  function handleSaveICP() {
    if (!name || !industry.length || !geography.length || !roles.length) {
      alert('Please fill in the ICP name and select at least one Industry, Geography, and Role.')
      return
    }
    const newIcp: ICP = {
      id: `icp-${Date.now()}`, name, industry, businessType: businessType as any,
      companySizeMin: sizeMin, companySizeMax: sizeMax, geography, decisionMakerRoles: roles,
      revenueRange: revenue || undefined, keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    setIcps([newIcp, ...icps])
    setShowForm(false)
    setName(''); setIndustry([]); setGeography([]); setRoles([]); setRevenue(''); setKeywords(''); setAiInsights(null)
  }

  return (
    <div style={{ padding: 28, maxWidth: 1200 }}>
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>ICP Builder</div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Ideal Customer Profiles</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Define who you want to reach. AI generates targeting intelligence from your inputs.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          New ICP
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card animate-in" style={{ padding: 24, marginBottom: 28, border: '1px solid #bfdbfe', background: '#fafcff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: '#0f172a', margin: 0 }}>Create New ICP</h2>
            <span className="ai-tag"><Sparkles size={11} /> AI-Enhanced</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>ICP Name *</label>
              <input className="input" placeholder="e.g. SaaS Founders in US" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Business Type</label>
              <select className="select" value={businessType} onChange={e => setBusinessType(e.target.value)}>
                {['B2B', 'B2C', 'D2C', 'Both'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <TagSelector label="Industries *" options={INDUSTRIES} selected={industry} onChange={setIndustry} />
            <TagSelector label="Geographies *" options={GEOGRAPHIES} selected={geography} onChange={setGeography} />
            <TagSelector label="Decision-Maker Roles *" options={DECISION_MAKER_ROLES} selected={roles} onChange={setRoles} />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Company Size: {sizeMin}–{sizeMax} employees</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="input" type="number" placeholder="Min" value={sizeMin} onChange={e => setSizeMin(Number(e.target.value))} style={{ width: '50%' }} />
                <input className="input" type="number" placeholder="Max" value={sizeMax} onChange={e => setSizeMax(Number(e.target.value))} style={{ width: '50%' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Revenue Range (optional)</label>
              <input className="input" placeholder="e.g. $500K – $5M ARR" value={revenue} onChange={e => setRevenue(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Targeting Keywords (comma-separated)</label>
              <input className="input" placeholder="e.g. PLG, Series A, hiring growth" value={keywords} onChange={e => setKeywords(e.target.value)} />
            </div>
          </div>

          {/* AI Insights */}
          {aiInsights && (
            <div style={{ marginTop: 20, padding: 16, background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', borderRadius: 10, border: '1px solid #c7d2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Sparkles size={16} color="#4f46e5" />
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 14, color: '#4f46e5' }}>AI-Generated ICP Intelligence</span>
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 14 }}>{aiInsights.icpSummary}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Key Pain Points</div>
                  {aiInsights.keyPainPoints.map((p, i) => <div key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 5, display: 'flex', gap: 6 }}><span style={{ color: '#ef4444', flexShrink: 0 }}>✗</span>{p}</div>)}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Messaging Angles</div>
                  {aiInsights.messagingAngles.map((m, i) => <div key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 5, display: 'flex', gap: 6 }}><span style={{ color: '#10b981', flexShrink: 0 }}>→</span>{m}</div>)}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Qualification Qs</div>
                  {aiInsights.qualificationQuestions.map((q, i) => <div key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 5, display: 'flex', gap: 6 }}><span style={{ color: '#3b82f6', flexShrink: 0 }}>?</span>{q}</div>)}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={handleGenerateICP} disabled={generating}>
                {generating ? <><div className="loading-dots"><span /><span /><span /></div> Generating...</> : <><Sparkles size={15} /> Generate AI Insights</>}
              </button>
              <button className="btn btn-primary" onClick={handleSaveICP}>
                <CheckCircle size={15} />
                Save ICP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ICP Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {icps.map((icp, i) => (
          <div key={icp.id} className="animate-in" style={{ animationDelay: `${i * 0.06}s` }}>
            <ICPCard icp={icp} />
          </div>
        ))}
      </div>
    </div>
  )
}
