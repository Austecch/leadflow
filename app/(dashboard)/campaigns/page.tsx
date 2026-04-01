'use client'
import { useState } from 'react'
import { Plus, Zap, Play, Pause, Eye, Copy, Trash2, Mail, Linkedin, Instagram, Target, Users, Send, MessageSquare, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import { mockCampaigns } from '@/lib/mock-data'
import type { Campaign, CampaignStatus, CampaignChannel } from '@/lib/types'
import { getStatusBadgeClass, calcReplyRate, calcOpenRate, formatDate } from '@/lib/utils'

const CHANNEL_ICONS: Record<CampaignChannel, any> = {
  email: <Mail size={14} color="#2563eb" />,
  linkedin: <Linkedin size={14} color="#0a66c2" />,
  instagram: <Instagram size={14} color="#9333ea" />,
}
const CHANNEL_LABELS: Record<CampaignChannel, string> = { email: 'Email', linkedin: 'LinkedIn', instagram: 'Instagram' }

function CampaignCard({ campaign, onToggle }: { campaign: Campaign; onToggle: (id: string) => void }) {
  const replyRate = calcReplyRate(campaign.stats.sent, campaign.stats.replied)
  const openRate = calcOpenRate(campaign.stats.sent, campaign.stats.opened)
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Card Header */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', background: campaign.status === 'active' ? 'linear-gradient(135deg,#f0f9ff,#faf5ff)' : 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className={`status-dot ${campaign.status === 'active' ? 'status-live' : campaign.status === 'paused' ? 'status-paused' : campaign.status === 'completed' ? 'status-complete' : 'status-draft'}`} />
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{campaign.name}</span>
            </div>
            {campaign.description && <div style={{ fontSize: 12, color: '#64748b' }}>{campaign.description}</div>}
          </div>
          <span className={`badge ${getStatusBadgeClass(campaign.status)}`} style={{ marginLeft: 10, flexShrink: 0 }}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe' }}>
            <Target size={12} color="#2563eb" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>{campaign.icpName}</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {campaign.channels.map(ch => (
              <span key={ch} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, color: '#374151' }}>
                {CHANNEL_ICONS[ch]} {CHANNEL_LABELS[ch]}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>{campaign.steps.length} steps</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0 }}>
        {[
          { icon: <Users size={13} />, label: 'Enrolled', value: campaign.leadsEnrolled, color: '#3b82f6' },
          { icon: <Send size={13} />, label: 'Sent', value: campaign.stats.sent, color: '#8b5cf6' },
          { icon: <Eye size={13} />, label: 'Open Rate', value: `${openRate}%`, color: '#f59e0b' },
          { icon: <MessageSquare size={13} />, label: 'Reply Rate', value: `${replyRate}%`, color: '#10b981' },
          { icon: <TrendingUp size={13} />, label: 'Positive', value: campaign.positiveReplies, color: '#10b981' },
          { icon: <Calendar size={13} />, label: 'Booked', value: campaign.appointmentsBooked, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRight: i < 5 ? '1px solid #f1f5f9' : 'none', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: s.color, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 17, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid #f8fafc', background: '#fafbff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Progress: {campaign.leadsContacted} of {campaign.targetLeadCount} contacted</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>{Math.round((campaign.leadsContacted / campaign.targetLeadCount) * 100)}%</span>
        </div>
        <div className="score-bar" style={{ height: 5 }}>
          <div className="score-bar-fill" style={{ width: `${Math.round((campaign.leadsContacted / campaign.targetLeadCount) * 100)}%`, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>
          {campaign.startDate && `Started ${formatDate(campaign.startDate)}`}
          {campaign.endDate && ` · Ended ${formatDate(campaign.endDate)}`}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-ghost" title="Analytics"><BarChart3 size={14} /></button>
          <button className="btn btn-sm btn-ghost" title="Duplicate"><Copy size={14} /></button>
          {campaign.status !== 'completed' && (
            <button className="btn btn-sm btn-secondary" onClick={() => onToggle(campaign.id)}>
              {campaign.status === 'active' ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
            </button>
          )}
          <button className="btn btn-sm btn-primary">View Details →</button>
        </div>
      </div>
    </div>
  )
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all')

  const filtered = campaigns.filter(c => statusFilter === 'all' || c.status === statusFilter)

  function handleToggle(id: string) {
    setCampaigns(cs => cs.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' as CampaignStatus } : c
    ))
  }

  const statsByStatus = {
    active: campaigns.filter(c => c.status === 'active').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    total: campaigns.length,
  }

  const totalSent = campaigns.reduce((a, c) => a + c.stats.sent, 0)
  const totalReplied = campaigns.reduce((a, c) => a + c.stats.replied, 0)
  const totalBooked = campaigns.reduce((a, c) => a + c.appointmentsBooked, 0)

  return (
    <div style={{ padding: 28, maxWidth: 1300 }}>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Campaign Management</div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Campaigns</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>{statsByStatus.active} active · {statsByStatus.paused} paused · {statsByStatus.completed} completed</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Sent', value: totalSent.toLocaleString(), color: '#3b82f6', icon: <Send size={18} /> },
          { label: 'Total Replied', value: totalReplied.toLocaleString(), color: '#10b981', icon: <MessageSquare size={18} /> },
          { label: 'Appointments', value: totalBooked.toLocaleString(), color: '#f59e0b', icon: <Calendar size={18} /> },
          { label: 'Overall Reply Rate', value: `${calcReplyRate(totalSent, totalReplied)}%`, color: '#8b5cf6', icon: <TrendingUp size={18} /> },
        ].map((s, i) => (
          <div key={i} className="card animate-in" style={{ padding: '16px 18px', animationDelay: `${i * 0.04}s`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'active', 'paused', 'completed', 'draft'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className="btn btn-sm" style={{
            background: statusFilter === s ? '#0f172a' : 'white',
            color: statusFilter === s ? 'white' : '#374151',
            border: `1px solid ${statusFilter === s ? '#0f172a' : '#d1d5db'}`,
            fontWeight: 600,
          }}>
            {s === 'all' ? `All (${statsByStatus.total})` : s.charAt(0).toUpperCase() + s.slice(1)}
            {s === 'active' && ` (${statsByStatus.active})`}
            {s === 'paused' && ` (${statsByStatus.paused})`}
            {s === 'completed' && ` (${statsByStatus.completed})`}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((campaign, i) => (
          <div key={campaign.id} className="animate-in" style={{ animationDelay: `${i * 0.06}s` }}>
            <CampaignCard campaign={campaign} onToggle={handleToggle} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
          <Zap size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
          <div style={{ fontWeight: 600, fontSize: 16, color: '#64748b' }}>No campaigns found</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Create your first campaign to start reaching leads</div>
          <button className="btn btn-primary" style={{ marginTop: 16 }}><Plus size={15} /> Create Campaign</button>
        </div>
      )}
    </div>
  )
}
