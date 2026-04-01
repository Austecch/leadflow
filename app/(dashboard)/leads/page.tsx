'use client'
import { useState, useMemo } from 'react'
import { Search, Filter, Download, RefreshCw, Plus, Globe, Linkedin, Instagram, MapPin, Mail, Phone, ExternalLink } from 'lucide-react'
import { mockLeads } from '@/lib/mock-data'
import type { Lead, LeadTemperature, LeadStatus } from '@/lib/types'
import { getTemperatureLabel, getTemperatureBadgeClass, getScoreBarColor, formatRelativeTime, getSourceLabel } from '@/lib/utils'

const SOURCE_ICONS: Record<string, any> = {
  linkedin: <Linkedin size={13} color="#0a66c2" />,
  instagram: <Instagram size={13} color="#9333ea" />,
  google: <Globe size={13} color="#10b981" />,
  directory: <Globe size={13} color="#f59e0b" />,
  manual: <Plus size={13} color="#64748b" />,
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#94a3b8'
  const r = 14, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#f1f5f9" strokeWidth="3" />
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" className="progress-ring" />
      <text x="18" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{score}</text>
    </svg>
  )
}

function LeadDetailPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 400,
      background: 'white', boxShadow: '-8px 0 40px rgba(0,0,0,0.1)', zIndex: 200,
      overflowY: 'auto', borderLeft: '1px solid #e2e8f0'
    }}>
      <div style={{ padding: '20px 20px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0, fontFamily: 'Plus Jakarta Sans' }}>
              {lead.contactName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{lead.contactName}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{lead.jobTitle}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{lead.businessName}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '4px 8px' }}>✕</button>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        {/* Lead Score */}
        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, marginBottom: 16, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Lead Quality Score</span>
            <ScoreRing score={lead.score} />
          </div>
          {Object.entries(lead.scoreBreakdown).map(([key, val]) => {
            const labels: Record<string, string> = { icpMatch: 'ICP Match (30%)', activityLevel: 'Activity Level (20%)', websiteQuality: 'Website Quality (20%)', engagementSignals: 'Engagement Signals (20%)', dataCompleteness: 'Data Completeness (10%)' }
            const maxes: Record<string, number> = { icpMatch: 30, activityLevel: 20, websiteQuality: 20, engagementSignals: 20, dataCompleteness: 10 }
            const pct = Math.round((val / maxes[key]) * 100)
            return (
              <div key={key} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{labels[key]}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{val}/{maxes[key]}</span>
                </div>
                <div className="score-bar">
                  <div className="score-bar-fill" style={{ width: `${pct}%`, background: pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#94a3b8' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Info */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Contact Information</div>
          {[
            { icon: <Mail size={14} />, label: lead.email },
            lead.phone && { icon: <Phone size={14} />, label: lead.phone },
            { icon: <MapPin size={14} />, label: `${lead.location}, ${lead.country}` },
            lead.website && { icon: <ExternalLink size={14} />, label: lead.website },
            lead.linkedin && { icon: <Linkedin size={14} />, label: lead.linkedin },
            lead.instagram && { icon: <Instagram size={14} />, label: lead.instagram },
          ].filter(Boolean).map((item: any, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f8fafc' }}>
              <span style={{ color: '#94a3b8', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: '#374151' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Enrichment Data */}
        {lead.enrichmentData && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Enrichment Data</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {lead.enrichmentData.employeeCount && (
                <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Employees</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{lead.enrichmentData.employeeCount}</div>
                </div>
              )}
              {lead.enrichmentData.fundingStage && (
                <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Funding</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{lead.enrichmentData.fundingStage}</div>
                </div>
              )}
              {lead.enrichmentData.annualRevenue && (
                <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Revenue</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{lead.enrichmentData.annualRevenue}</div>
                </div>
              )}
              {lead.enrichmentData.hiringActive !== undefined && (
                <div style={{ padding: '10px 12px', background: lead.enrichmentData.hiringActive ? '#f0fdf4' : '#fef2f2', borderRadius: 8, border: `1px solid ${lead.enrichmentData.hiringActive ? '#bbf7d0' : '#fecaca'}` }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Hiring</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: lead.enrichmentData.hiringActive ? '#16a34a' : '#dc2626' }}>{lead.enrichmentData.hiringActive ? 'Active' : 'Not Hiring'}</div>
                </div>
              )}
            </div>
            {lead.enrichmentData.techStack && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Tech Stack</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {lead.enrichmentData.techStack.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {lead.tags.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {lead.tags.map(t => <span key={t} className="badge badge-purple">{t}</span>)}
            </div>
          </div>
        )}

        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }}>Add to Campaign</button>
          <button className="btn btn-secondary">Enrich</button>
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [tempFilter, setTempFilter] = useState<LeadTemperature | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [discovering, setDiscovering] = useState(false)

  const filtered = useMemo(() => {
    return mockLeads.filter(l => {
      const matchSearch = !search || [l.contactName, l.businessName, l.industry, l.email, l.location].some(f => f?.toLowerCase().includes(search.toLowerCase()))
      const matchTemp = tempFilter === 'all' || l.temperature === tempFilter
      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      return matchSearch && matchTemp && matchStatus
    })
  }, [search, tempFilter, statusFilter])

  const stats = useMemo(() => ({
    total: mockLeads.length,
    hot: mockLeads.filter(l => l.temperature === 'hot').length,
    warm: mockLeads.filter(l => l.temperature === 'warm').length,
    cold: mockLeads.filter(l => l.temperature === 'cold').length,
    avgScore: Math.round(mockLeads.reduce((a, l) => a + l.score, 0) / mockLeads.length),
  }), [])

  async function handleDiscover() {
    setDiscovering(true)
    await new Promise(r => setTimeout(r, 2200))
    setDiscovering(false)
    alert('Discovery complete! 12 new leads found and qualified.')
  }

  return (
    <div style={{ padding: 28, maxWidth: 1400 }}>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Lead Discovery</div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Lead Database</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>{mockLeads.length} leads discovered · {stats.hot} hot · {stats.warm} warm · {stats.cold} cold</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm"><Download size={15} />Export CSV</button>
          <button className="btn btn-primary" onClick={handleDiscover} disabled={discovering}>
            {discovering ? <><div className="loading-dots"><span /><span /><span /></div>Discovering...</> : <><RefreshCw size={15} />Discover Leads</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Leads', value: stats.total, color: '#3b82f6' },
          { label: '🔥 Hot', value: stats.hot, color: '#ef4444' },
          { label: '🌤 Warm', value: stats.warm, color: '#f59e0b' },
          { label: '❄️ Cold', value: stats.cold, color: '#94a3b8' },
          { label: 'Avg. LQS', value: stats.avgScore, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="card animate-in" style={{ padding: '14px 16px', animationDelay: `${i * 0.04}s` }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card animate-in delay-1" style={{ padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input className="input" placeholder="Search leads, companies, emails..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'hot', 'warm', 'cold'] as const).map(t => (
            <button key={t} onClick={() => setTempFilter(t)} className="btn btn-sm" style={{
              background: tempFilter === t ? '#3b82f6' : 'white', color: tempFilter === t ? 'white' : '#374151',
              border: `1px solid ${tempFilter === t ? '#3b82f6' : '#d1d5db'}`, fontWeight: 600,
            }}>
              {t === 'all' ? 'All' : t === 'hot' ? '🔥 Hot' : t === 'warm' ? '🌤 Warm' : '❄️ Cold'}
            </button>
          ))}
        </div>
        <select className="select" style={{ width: 'auto', padding: '8px 14px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
          <option value="all">All Statuses</option>
          {['discovered', 'qualified', 'contacted', 'replied', 'converted'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="card animate-in delay-2" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Lead</th>
              <th>Company</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Source</th>
              <th>Score</th>
              <th>Temp</th>
              <th>Status</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead, i) => (
              <tr key={lead.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedLead(lead)}>
                <td>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>
                    {lead.contactName.split(' ').map(n => n[0]).join('')}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{lead.contactName}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{lead.jobTitle}</div>
                </td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{lead.businessName}</div>
                  {lead.email && <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{lead.email}</div>}
                </td>
                <td><span style={{ fontSize: 12, color: '#64748b' }}>{lead.industry}</span></td>
                <td><span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{lead.location}</span></td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                    {SOURCE_ICONS[lead.source]}
                    {getSourceLabel(lead.source)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 52 }}>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ width: `${lead.score}%`, background: getScoreBarColor(lead.score) }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: lead.score >= 75 ? '#ef4444' : lead.score >= 40 ? '#d97706' : '#64748b', minWidth: 24 }}>{lead.score}</span>
                  </div>
                </td>
                <td><span className={`badge ${getTemperatureBadgeClass(lead.temperature)}`}>{getTemperatureLabel(lead.temperature)}</span></td>
                <td><span className="badge badge-blue">{lead.status}</span></td>
                <td style={{ fontSize: 12, color: '#94a3b8' }}>{formatRelativeTime(lead.createdAt)}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={e => { e.stopPropagation(); setSelectedLead(lead) }}>
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
            <Search size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontWeight: 600, fontSize: 15, color: '#64748b' }}>No leads match your filters</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or temperature filter</div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedLead && (
        <>
          <div onClick={() => setSelectedLead(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 199 }} />
          <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
        </>
      )}
    </div>
  )
}
