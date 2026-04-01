'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Users, Send, MessageSquare, Calendar, Zap, ArrowUpRight, Target, ChevronRight, Inbox } from 'lucide-react'
import { mockAnalyticsOverview, mockTimeSeries, mockCampaigns, mockReplies, mockLeads, mockFunnel, mockNotifications } from '@/lib/mock-data'
import { formatRelativeTime, getTemperatureLabel, getTemperatureBadgeClass, formatNumber, getStatusBadgeClass } from '@/lib/utils'

function StatCard({ label, value, sub, icon: Icon, color, trend }: { label: string; value: string; sub?: string; icon: any; color: string; trend?: string }) {
  return (
    <div className="stat-card animate-in" style={{ '--accent': color } as any}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
        {trend && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: '#10b981', background: '#f0fdf4', padding: '2px 8px', borderRadius: 100, border: '1px solid #bbf7d0' }}>
            <TrendingUp size={12} />{trend}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

const o = mockAnalyticsOverview

export default function DashboardPage() {
  return (
    <div style={{ padding: 28, maxWidth: 1400 }}>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Good morning, Austine 👋
          </div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
            Pipeline Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0', fontWeight: 400 }}>
            All campaigns are running. 3 replies need your attention.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/leads" className="btn btn-secondary btn-sm">
            <Users size={15} />
            Find Leads
          </Link>
          <Link href="/campaigns" className="btn btn-primary btn-sm">
            <Zap size={15} />
            New Campaign
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Leads Discovered" value={formatNumber(o.leadsDiscovered)} sub="This quarter" icon={Users} color="#3b82f6" trend="+12%" />
        <StatCard label="Outreach Sent" value={formatNumber(o.outreachSent)} sub="Across all campaigns" icon={Send} color="#8b5cf6" trend="+8%" />
        <StatCard label="Replies Received" value={o.repliesReceived.toString()} sub={`${o.replyRate}% reply rate`} icon={MessageSquare} color="#10b981" trend="+5%" />
        <StatCard label="Appointments" value={o.appointmentsBooked.toString()} sub={`${o.conversionRate}% conv. rate`} icon={Calendar} color="#f59e0b" trend="+15%" />
      </div>

      {/* Secondary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Qualified Leads', value: formatNumber(o.leadsQualified), color: '#3b82f6' },
          { label: 'Positive Reply Rate', value: `${o.positiveReplyRate}%`, color: '#10b981' },
          { label: 'Cost Per Lead', value: `$${o.costPerLead}`, color: '#8b5cf6' },
          { label: 'Cost Per Appointment', value: `$${o.costPerAppointment}`, color: '#f59e0b' },
        ].map((item, i) => (
          <div key={i} className="card animate-in" style={{ padding: '14px 18px', animationDelay: `${i * 0.05}s` }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 24 }}>
        {/* Time Series */}
        <div className="card animate-in delay-2" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>Outreach & Reply Trend</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Last 13 weeks</p>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} />Sent</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981', display: 'inline-block' }} />Replied</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} />Converted</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockTimeSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
              <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="replied" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="converted" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div className="card animate-in delay-3" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', margin: '0 0 16px' }}>Conversion Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockFunnel.map((stage, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{stage.stage}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{stage.count.toLocaleString()}</span>
                </div>
                <div className="score-bar">
                  <div className="score-bar-fill" style={{ width: `${stage.percentage}%`, background: stage.color }} />
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 3 }}>{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campaigns + Recent Replies */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Active Campaigns */}
        <div className="card animate-in delay-3" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>Active Campaigns</h3>
            <Link href="/campaigns" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
              View all <ChevronRight size={15} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockCampaigns.filter(c => c.status === 'active').map(campaign => (
              <div key={campaign.id} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{campaign.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{campaign.icpName}</div>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(campaign.status)}`}>{campaign.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { label: 'Enrolled', val: campaign.leadsEnrolled },
                    { label: 'Replied', val: campaign.repliesReceived },
                    { label: 'Booked', val: campaign.appointmentsBooked },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', fontFamily: 'Plus Jakarta Sans' }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981', fontFamily: 'Plus Jakarta Sans' }}>
                      {Math.round((campaign.repliesReceived / Math.max(campaign.leadsContacted, 1)) * 1000) / 10}%
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Reply Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Replies */}
        <div className="card animate-in delay-4" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>Recent Replies</h3>
              <span style={{ background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 100 }}>
                {mockReplies.filter(r => !r.isRead).length} new
              </span>
            </div>
            <Link href="/inbox" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
              Open Inbox <ChevronRight size={15} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockReplies.slice(0, 4).map(reply => {
              const classColors: Record<string, string> = { interested: '#10b981', not_interested: '#ef4444', neutral: '#f59e0b', ooo: '#94a3b8', referral: '#8b5cf6' }
              const classLabels: Record<string, string> = { interested: 'Interested', not_interested: 'Not Interested', neutral: 'Neutral', ooo: 'Out of Office', referral: 'Referral' }
              return (
                <div key={reply.id} style={{
                  display: 'flex', gap: 12, padding: '10px 12px',
                  background: reply.isRead ? '#f8fafc' : '#eff6ff',
                  borderRadius: 10, border: `1px solid ${reply.isRead ? '#f1f5f9' : '#bfdbfe'}`,
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>
                    {reply.leadName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{reply.leadName}</div>
                      <span style={{ fontSize: 11, color: classColors[reply.classification], fontWeight: 600, background: `${classColors[reply.classification]}15`, padding: '1px 7px', borderRadius: 100, flexShrink: 0, marginLeft: 8 }}>
                        {classLabels[reply.classification]}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{reply.leadCompany}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {reply.body.substring(0, 70)}...
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="card animate-in delay-5" style={{ marginTop: 20, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>Recent Leads</h3>
          <Link href="/leads" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
            View all <ChevronRight size={15} />
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Company</th>
              <th>Industry</th>
              <th>Score</th>
              <th>Temperature</th>
              <th>Status</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.slice(0, 5).map(lead => (
              <tr key={lead.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {lead.contactName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{lead.contactName}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{lead.jobTitle}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13, fontWeight: 500 }}>{lead.businessName}</td>
                <td><span style={{ fontSize: 12, color: '#64748b' }}>{lead.industry}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 50 }}>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ width: `${lead.score}%`, background: lead.score >= 75 ? '#ef4444' : lead.score >= 40 ? '#f59e0b' : '#94a3b8' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: lead.score >= 75 ? '#ef4444' : lead.score >= 40 ? '#d97706' : '#64748b' }}>{lead.score}</span>
                  </div>
                </td>
                <td><span className={`badge ${getTemperatureBadgeClass(lead.temperature)}`}>{getTemperatureLabel(lead.temperature)}</span></td>
                <td><span className="badge badge-blue">{lead.status}</span></td>
                <td style={{ fontSize: 12, color: '#94a3b8' }}>{formatRelativeTime(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
