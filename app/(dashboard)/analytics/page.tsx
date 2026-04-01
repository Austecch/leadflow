'use client'
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Send, MessageSquare, Calendar, Target, BarChart3, Download } from 'lucide-react'
import { mockAnalyticsOverview, mockTimeSeries, mockChannelPerformance, mockFunnel, mockCampaigns } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'

const o = mockAnalyticsOverview

const CHANNEL_COLORS: Record<string, string> = {
  email: '#3b82f6', linkedin: '#0a66c2', instagram: '#9333ea'
}

const CHANNEL_LABELS: Record<string, string> = {
  email: 'Email', linkedin: 'LinkedIn', instagram: 'Instagram'
}

type Period = '7d' | '30d' | '90d' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days', 'all': 'All time'
}

function KpiTile({ label, value, sub, delta, icon: Icon, color }: {
  label: string; value: string; sub?: string; delta?: string; positive?: boolean; icon: any; color: string
}) {
  const isPositive = delta?.startsWith('+')
  return (
    <div className="stat-card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
        {delta && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700,
            color: isPositive ? '#10b981' : '#ef4444',
            background: isPositive ? '#f0fdf4' : '#fef2f2',
            padding: '3px 9px', borderRadius: 100,
            border: `1px solid ${isPositive ? '#bbf7d0' : '#fecaca'}`
          }}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {delta}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12 }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
            <span style={{ color: '#64748b' }}>{p.name}:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const radarData = [
  { metric: 'Reply Rate', score: 75 },
  { metric: 'Open Rate', score: 82 },
  { metric: 'Lead Quality', score: 67 },
  { metric: 'Personalization', score: 88 },
  { metric: 'Deliverability', score: 95 },
  { metric: 'Conversion', score: 58 },
]

const leadSourceData = [
  { name: 'LinkedIn', value: 612, color: '#0a66c2' },
  { name: 'Google', value: 489, color: '#10b981' },
  { name: 'Instagram', value: 312, color: '#9333ea' },
  { name: 'Directory', value: 278, color: '#f59e0b' },
  { name: 'Manual', value: 156, color: '#94a3b8' },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'channels'>('overview')

  const slicedTimeSeries = period === '7d' ? mockTimeSeries.slice(-4)
    : period === '30d' ? mockTimeSeries.slice(-8)
    : mockTimeSeries

  return (
    <div style={{ padding: 28, maxWidth: 1400 }}>

      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Analytics</div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Performance Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Real-time metrics across all campaigns and channels.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
            {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: period === p ? 'white' : 'transparent',
                color: period === p ? '#0f172a' : '#64748b',
                boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}>{PERIOD_LABELS[p]}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiTile label="Leads Discovered" value={formatNumber(o.leadsDiscovered)} sub="Total across all sources" delta="+12%" icon={Users} color="#3b82f6" />
        <KpiTile label="Outreach Sent" value={formatNumber(o.outreachSent)} sub="Email + LinkedIn + Instagram" delta="+8%" icon={Send} color="#8b5cf6" />
        <KpiTile label="Reply Rate" value={`${o.replyRate}%`} sub={`${o.repliesReceived} total replies`} delta="+1.4%" icon={MessageSquare} color="#10b981" />
        <KpiTile label="Appointments Booked" value={o.appointmentsBooked.toString()} sub={`${o.conversionRate}% conversion rate`} delta="+15%" icon={Calendar} color="#f59e0b" />
      </div>

      {/* Secondary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Qualified Leads', value: formatNumber(o.leadsQualified), sub: `${Math.round((o.leadsQualified / o.leadsDiscovered) * 100)}% qualification rate`, color: '#3b82f6' },
          { label: 'Positive Reply Rate', value: `${o.positiveReplyRate}%`, sub: `${o.positiveReplies} interested prospects`, color: '#10b981' },
          { label: 'Cost Per Lead', value: `$${o.costPerLead}`, sub: 'Blended across all channels', color: '#8b5cf6' },
          { label: 'Cost Per Appointment', value: `$${o.costPerAppointment}`, sub: 'Full pipeline cost', color: '#f59e0b' },
        ].map((item, i) => (
          <div key={i} className="card animate-in" style={{ padding: '16px 18px', animationDelay: `${i * 0.04}s` }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid #f1f5f9' }}>
        {(['overview', 'campaigns', 'channels'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            color: activeTab === tab ? '#2563eb' : '#64748b',
            borderBottom: `2px solid ${activeTab === tab ? '#2563eb' : 'transparent'}`, marginBottom: -2, transition: 'all 0.15s',
          }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Main Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
            {/* Time Series */}
            <div className="card animate-in" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Outreach Activity</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{PERIOD_LABELS[period]}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                  {[['#3b82f6', 'Sent'], ['#10b981', 'Replied'], ['#f59e0b', 'Converted'], ['#8b5cf6', 'Discovered']].map(([color, name]) => (
                    <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />{name}
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={slicedTimeSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="sent" name="Sent" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="replied" name="Replied" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="converted" name="Converted" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="leadsDiscovered" name="Discovered" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Source Pie */}
            <div className="card animate-in delay-1" style={{ padding: 22 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>Lead Sources</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>{o.leadsDiscovered.toLocaleString()} total leads</div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={leadSourceData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" paddingAngle={3}>
                    {leadSourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [v.toLocaleString(), 'Leads']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {leadSourceData.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#374151', flex: 1 }}>{s.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{s.value}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{Math.round((s.value / o.leadsDiscovered) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Funnel */}
            <div className="card animate-in delay-2" style={{ padding: 22 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>Conversion Funnel</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mockFunnel.map((stage, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: stage.color }} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{stage.stage}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{stage.count.toLocaleString()}</span>
                        <span style={{ fontSize: 12, color: '#94a3b8', width: 44, textAlign: 'right' }}>{stage.percentage}%</span>
                      </div>
                    </div>
                    <div className="score-bar" style={{ height: 8, borderRadius: 4 }}>
                      <div className="score-bar-fill funnel-bar" style={{ width: `${stage.percentage}%`, background: stage.color, borderRadius: 4 }} />
                    </div>
                    {i < mockFunnel.length - 1 && (
                      <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 3 }}>
                        {Math.round((mockFunnel[i + 1].count / stage.count) * 100)}% proceed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Radar */}
            <div className="card animate-in delay-3" style={{ padding: 22 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>Performance Radar</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Campaign health across key dimensions</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'campaigns' && (
        <div className="card animate-in" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Campaign Performance Breakdown</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Opened</th>
                <th>Open Rate</th>
                <th>Replied</th>
                <th>Reply Rate</th>
                <th>Positive</th>
                <th>Booked</th>
                <th>Bounced</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map(c => {
                const openRate = c.stats.sent > 0 ? Math.round((c.stats.opened / c.stats.sent) * 1000) / 10 : 0
                const replyRate = c.stats.sent > 0 ? Math.round((c.stats.replied / c.stats.sent) * 1000) / 10 : 0
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{c.icpName}</div>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                        <span className={`status-dot ${c.status === 'active' ? 'status-live' : c.status === 'paused' ? 'status-paused' : 'status-complete'}`} />
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#374151' }}>{c.stats.sent}</td>
                    <td style={{ color: '#374151' }}>{c.stats.opened}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: openRate >= 40 ? '#10b981' : openRate >= 25 ? '#f59e0b' : '#94a3b8' }}>{openRate}%</span>
                    </td>
                    <td style={{ color: '#374151' }}>{c.stats.replied}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: replyRate >= 15 ? '#10b981' : replyRate >= 8 ? '#f59e0b' : '#94a3b8' }}>{replyRate}%</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>{c.positiveReplies}</td>
                    <td style={{ fontWeight: 700, color: '#3b82f6' }}>{c.appointmentsBooked}</td>
                    <td style={{ color: c.stats.bounced > 5 ? '#ef4444' : '#94a3b8' }}>{c.stats.bounced}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'channels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Channel Comparison Bar Chart */}
          <div className="card animate-in" style={{ padding: 22 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 20 }}>Channel Performance Comparison</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockChannelPerformance.map(c => ({ ...c, channel: CHANNEL_LABELS[c.channel] }))} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="channel" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sent" name="Sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="replied" name="Replied" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="converted" name="Converted" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Detail Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {mockChannelPerformance.map((ch, i) => (
              <div key={i} className="card animate-in" style={{ padding: 20, animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${CHANNEL_COLORS[ch.channel]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={18} color={CHANNEL_COLORS[ch.channel]} />
                  </div>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{CHANNEL_LABELS[ch.channel]}</span>
                </div>
                {[
                  { label: 'Messages Sent', value: ch.sent, color: '#0f172a' },
                  { label: 'Replies', value: ch.replied, color: '#0f172a' },
                  { label: 'Reply Rate', value: `${ch.replyRate}%`, color: ch.replyRate >= 15 ? '#10b981' : '#f59e0b' },
                  { label: 'Conversions', value: ch.converted, color: '#0f172a' },
                  { label: 'Conversion Rate', value: `${ch.conversionRate}%`, color: ch.conversionRate >= 3 ? '#10b981' : '#f59e0b' },
                ].map((s, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{s.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
