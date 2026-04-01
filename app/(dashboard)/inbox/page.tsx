'use client'
import { useState } from 'react'
import { Inbox, CheckCircle, XCircle, HelpCircle, Plane, ArrowUpRight, Send, Sparkles, Mail, Linkedin, Instagram, RefreshCw, Eye, EyeOff, MessageSquare } from 'lucide-react'
import { mockReplies } from '@/lib/mock-data'
import type { Reply, ReplyClassification } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils'

const CLASSIFICATION_CONFIG: Record<ReplyClassification, { icon: any; label: string; color: string; bg: string; border: string }> = {
  interested: { icon: <CheckCircle size={14} />, label: 'Interested', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  not_interested: { icon: <XCircle size={14} />, label: 'Not Interested', color: '#b91c1c', bg: '#fef2f2', border: '#fca5a5' },
  neutral: { icon: <HelpCircle size={14} />, label: 'Neutral', color: '#92400e', bg: '#fffbeb', border: '#fcd34d' },
  ooo: { icon: <Plane size={14} />, label: 'Out of Office', color: '#475569', bg: '#f8fafc', border: '#cbd5e1' },
  referral: { icon: <ArrowUpRight size={14} />, label: 'Referral', color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
}

const CHANNEL_ICONS: Record<string, any> = {
  email: <Mail size={13} color="#2563eb" />,
  linkedin: <Linkedin size={13} color="#0a66c2" />,
  instagram: <Instagram size={13} color="#9333ea" />,
}

function ReplyCard({ reply, isSelected, onClick }: { reply: Reply; isSelected: boolean; onClick: () => void }) {
  const cfg = CLASSIFICATION_CONFIG[reply.classification]
  return (
    <div onClick={onClick} style={{
      padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
      background: isSelected ? '#eff6ff' : reply.isRead ? 'white' : '#fafcff',
      borderLeft: `3px solid ${isSelected ? '#3b82f6' : reply.isRead ? 'transparent' : '#3b82f6'}`,
      transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 13, fontFamily: 'Plus Jakarta Sans',
        }}>
          {reply.leadName.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: reply.isRead ? 500 : 700, color: '#0f172a' }}>{reply.leadName}</span>
              {!reply.isRead && <span style={{ marginLeft: 6, width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', verticalAlign: 'middle' }} />}
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, marginLeft: 8 }}>{formatRelativeTime(reply.receivedAt)}</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
            {reply.leadCompany} · {reply.campaignName}
          </div>
          <div style={{ fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>
            {reply.body.substring(0, 80)}{reply.body.length > 80 ? '...' : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              {cfg.icon}{cfg.label}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
              {CHANNEL_ICONS[reply.channel]}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{Math.round(reply.confidence * 100)}% confidence</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReplyDetail({ reply, onRespond }: { reply: Reply; onRespond: (id: string, body: string) => void }) {
  const cfg = CLASSIFICATION_CONFIG[reply.classification]
  const [responseBody, setResponseBody] = useState(reply.aiSuggestedResponse || '')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(reply.humanApproved || false)
  const [editMode, setEditMode] = useState(false)
  const [classifying, setClassifying] = useState(false)

  async function handleSend() {
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    onRespond(reply.id, responseBody)
  }

  async function handleReclassify() {
    setClassifying(true)
    await new Promise(r => setTimeout(r, 1500))
    setClassifying(false)
    alert('Reply re-classified. The AI has updated its classification based on additional context.')
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, fontFamily: 'Plus Jakarta Sans', flexShrink: 0
          }}>
            {reply.leadName.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{reply.leadName}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{reply.leadCompany} · {reply.leadEmail}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>via {reply.campaignName} · {formatRelativeTime(reply.receivedAt)}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-sm btn-ghost" onClick={handleReclassify} disabled={classifying}>
              {classifying ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={13} />}
              Re-classify
            </button>
          </div>
        </div>

        {/* Classification Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 100, fontSize: 13, fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            {cfg.icon}{cfg.label}
          </span>
          <span style={{ fontSize: 12, color: '#64748b' }}>AI confidence: <strong>{Math.round(reply.confidence * 100)}%</strong></span>
          <span className="ai-tag"><Sparkles size={11} /> AI Classified</span>
          {sent && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#10b981' }}><CheckCircle size={13} /> Response sent</span>}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', background: '#fafbff' }}>
        {/* Inbound reply */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            {CHANNEL_ICONS[reply.channel]} Inbound Reply
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{reply.body}</div>
          </div>
        </div>

        {/* AI Suggested Response */}
        {reply.aiSuggestedResponse && reply.classification !== 'not_interested' && reply.classification !== 'ooo' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Suggested Response</div>
                <span className="ai-tag"><Sparkles size={10} /> Claude</span>
              </div>
              <button className="btn btn-sm btn-ghost" onClick={() => setEditMode(!editMode)}>
                {editMode ? <><EyeOff size={12} /> Preview</> : <><Eye size={12} /> Edit</>}
              </button>
            </div>

            {editMode ? (
              <textarea
                className="input"
                value={responseBody}
                onChange={e => setResponseBody(e.target.value)}
                style={{ resize: 'vertical', height: 200, lineHeight: 1.7, fontSize: 13 }}
              />
            ) : (
              <div style={{ background: 'white', border: '1px solid #bfdbfe', borderRadius: 10, padding: '16px 18px', borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{responseBody}</div>
              </div>
            )}

            {!sent ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditMode(true)}>
                  Edit Response
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSend} disabled={sending || !responseBody}>
                  {sending ? <><div className="loading-dots"><span /><span /><span /></div> Sending...</>
                    : <><Send size={15} /> Approve & Send</>}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 14, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} color="#16a34a" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Response approved and sent successfully</span>
              </div>
            )}
          </div>
        )}

        {/* Opt-out notice */}
        {reply.classification === 'not_interested' && (
          <div style={{ padding: '14px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#b91c1c', marginBottom: 6 }}>Lead marked as Not Interested</div>
            <div style={{ fontSize: 13, color: '#374151' }}>This lead has been automatically removed from all active sequences and added to the global suppression list. No further outreach will be sent.</div>
          </div>
        )}

        {/* OOO notice */}
        {reply.classification === 'ooo' && (
          <div style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Out of Office Detected</div>
            <div style={{ fontSize: 13, color: '#374151' }}>Follow-up sequences have been paused and will automatically resume when the OOO end date is detected.</div>
          </div>
        )}
      </div>
    </div>
  )
}

type FilterType = 'all' | ReplyClassification

export default function InboxPage() {
  const [replies, setReplies] = useState(mockReplies)
  const [selected, setSelected] = useState<Reply | null>(mockReplies[0])
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = replies.filter(r => filter === 'all' || r.classification === filter)
  const unread = replies.filter(r => !r.isRead).length

  function handleSelect(reply: Reply) {
    setSelected(reply)
    setReplies(prev => prev.map(r => r.id === reply.id ? { ...r, isRead: true } : r))
  }

  function handleRespond(id: string, body: string) {
    setReplies(prev => prev.map(r => r.id === id ? { ...r, humanApproved: true, approvedResponseBody: body } : r))
  }

  const counts: Record<string, number> = {
    all: replies.length,
    interested: replies.filter(r => r.classification === 'interested').length,
    neutral: replies.filter(r => r.classification === 'neutral').length,
    not_interested: replies.filter(r => r.classification === 'not_interested').length,
    ooo: replies.filter(r => r.classification === 'ooo').length,
    referral: replies.filter(r => r.classification === 'referral').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '22px 28px 0', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Reply Intelligence</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Reply Inbox</h1>
              {unread > 0 && (
                <span style={{ background: '#ef4444', color: 'white', fontSize: 12, fontWeight: 700, padding: '2px 9px', borderRadius: 100 }}>{unread} new</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><MessageSquare size={13} /> Mark all read</button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {([
            { key: 'all', label: 'All', color: '#3b82f6' },
            { key: 'interested', label: '✅ Interested', color: '#10b981' },
            { key: 'neutral', label: '🤔 Neutral', color: '#f59e0b' },
            { key: 'not_interested', label: '❌ Not Interested', color: '#ef4444' },
            { key: 'ooo', label: '🏖 OOO', color: '#94a3b8' },
            { key: 'referral', label: '↗️ Referral', color: '#8b5cf6' },
          ] as const).map(({ key, label, color }) => (
            <button key={key} onClick={() => setFilter(key as FilterType)} style={{
              padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13,
              fontWeight: filter === key ? 700 : 500, color: filter === key ? color : '#64748b',
              borderBottom: `2px solid ${filter === key ? color : 'transparent'}`, marginBottom: -1,
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap'
            }}>
              {label}
              <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 100, background: filter === key ? `${color}18` : '#f1f5f9', color: filter === key ? color : '#94a3b8', fontWeight: 700 }}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', flex: 1, overflow: 'hidden' }}>
        {/* Left: List */}
        <div style={{ borderRight: '1px solid #f1f5f9', overflowY: 'auto', background: 'white' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
              <Inbox size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
              <div style={{ fontWeight: 600, fontSize: 14, color: '#64748b' }}>No replies in this category</div>
            </div>
          ) : (
            filtered.map(r => (
              <ReplyCard key={r.id} reply={r} isSelected={selected?.id === r.id} onClick={() => handleSelect(r)} />
            ))
          )}
        </div>

        {/* Right: Detail */}
        <div style={{ overflow: 'hidden', background: '#fafbff' }}>
          {selected ? (
            <ReplyDetail key={selected.id} reply={selected} onRespond={handleRespond} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              <Inbox size={40} style={{ marginBottom: 14, opacity: 0.4 }} />
              <div style={{ fontWeight: 600, fontSize: 15, color: '#64748b' }}>Select a reply to view details</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>AI classifications and suggested responses appear here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
