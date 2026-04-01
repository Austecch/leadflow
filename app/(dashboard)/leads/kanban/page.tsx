'use client'
import { useState } from 'react'
import { Mail, MapPin, BarChart2, Linkedin, Instagram, Globe } from 'lucide-react'
import { mockLeads } from '@/lib/mock-data'
import type { Lead, LeadStatus } from '@/lib/types'
import { getTemperatureLabel, getTemperatureBadgeClass, getScoreBarColor } from '@/lib/utils'

const COLUMNS: Array<{ status: LeadStatus; label: string; color: string; bg: string; border: string }> = [
  { status: 'discovered', label: 'Discovered', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { status: 'qualified', label: 'Qualified', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  { status: 'contacted', label: 'Contacted', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { status: 'replied', label: 'Replied', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
  { status: 'converted', label: 'Converted', color: '#22c55e', bg: '#f0fdf4', border: '#86efac' },
]

function LeadKanbanCard({ lead }: { lead: Lead }) {
  return (
    <div className="card" style={{ padding: '12px 14px', cursor: 'grab', marginBottom: 8, transition: 'all 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = '' }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: 'Plus Jakarta Sans' }}>
          {lead.contactName.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.contactName}</div>
          <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.businessName}</div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {lead.jobTitle}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className={`badge ${getTemperatureBadgeClass(lead.temperature)}`} style={{ fontSize: 10, padding: '1px 6px' }}>
          {getTemperatureLabel(lead.temperature)}
        </span>
        <span style={{ fontSize: 12, fontWeight: 800, color: lead.score >= 75 ? '#ef4444' : lead.score >= 40 ? '#d97706' : '#64748b', fontFamily: 'Plus Jakarta Sans' }}>
          {lead.score}
        </span>
      </div>

      <div className="score-bar" style={{ height: 4, marginBottom: 8 }}>
        <div className="score-bar-fill" style={{ width: `${lead.score}%`, background: getScoreBarColor(lead.score) }} />
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {lead.email && <Mail size={11} color="#94a3b8" />}
        {lead.linkedin && <Linkedin size={11} color="#0a66c2" />}
        {lead.instagram && <Instagram size={11} color="#9333ea" />}
        {lead.website && <Globe size={11} color="#10b981" />}
        <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
          <MapPin size={9} />{lead.location.split(',')[0]}
        </span>
      </div>
    </div>
  )
}

export default function LeadKanbanPage() {
  const [leads, setLeads] = useState(mockLeads)

  return (
    <div style={{ padding: '24px 28px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Pipeline View</div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Lead Kanban Board</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/leads" className="btn btn-secondary btn-sm">Table View</a>
          <a href="/leads/kanban" className="btn btn-primary btn-sm"><BarChart2 size={13} /> Kanban View</a>
        </div>
      </div>

      {/* Kanban Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, flex: 1, overflow: 'hidden' }}>
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.status === col.status)
          return (
            <div key={col.status} style={{ display: 'flex', flexDirection: 'column', background: col.bg, borderRadius: 12, border: `1px solid ${col.border}`, overflow: 'hidden' }}>
              {/* Column header */}
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${col.border}`, flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: col.color }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{col.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: col.color, background: 'white', padding: '2px 8px', borderRadius: 100, border: `1px solid ${col.border}` }}>
                    {colLeads.length}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    Avg score: {colLeads.length ? Math.round(colLeads.reduce((a, l) => a + l.score, 0) / colLeads.length) : '—'}
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
                {colLeads.map(lead => <LeadKanbanCard key={lead.id} lead={lead} />)}
                {colLeads.length === 0 && (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                    No leads here yet
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
