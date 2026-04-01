'use client'
import { useState } from 'react'
import {
  Settings, Key, Mail, Linkedin, Instagram, CreditCard, Shield,
  CheckCircle, XCircle, Eye, EyeOff, Save, RefreshCw, Bell, Palette,
  Globe, AlertCircle, Plus, Trash2, ExternalLink, Zap, Database
} from 'lucide-react'

type Tab = 'general' | 'integrations' | 'sending' | 'compliance' | 'billing' | 'notifications'

const TABS: Array<{ key: Tab; label: string; icon: any }> = [
  { key: 'general', label: 'General', icon: <Settings size={15} /> },
  { key: 'integrations', label: 'Integrations', icon: <Key size={15} /> },
  { key: 'sending', label: 'Sending Accounts', icon: <Mail size={15} /> },
  { key: 'compliance', label: 'Compliance', icon: <Shield size={15} /> },
  { key: 'billing', label: 'Billing', icon: <CreditCard size={15} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
]

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ flex: 1, marginRight: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{label}</div>
        {desc && <div style={{ fontSize: 13, color: '#64748b', marginTop: 3, lineHeight: 1.5 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative',
      background: value ? '#3b82f6' : '#d1d5db', transition: 'background 0.2s', padding: 0,
    }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </button>
  )
}

function SecretField({ label, value, placeholder, helpText, status }: { label: string; value: string; placeholder: string; helpText?: string; status?: 'connected' | 'missing' | 'invalid' }) {
  const [show, setShow] = useState(false)
  const [val, setVal] = useState(value)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{label}</label>
          {status === 'connected' && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#15803d', background: '#f0fdf4', padding: '2px 8px', borderRadius: 100, border: '1px solid #bbf7d0' }}><CheckCircle size={10} /> Connected</span>}
          {status === 'missing' && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#b45309', background: '#fffbeb', padding: '2px 8px', borderRadius: 100, border: '1px solid #fde68a' }}><AlertCircle size={10} /> Not set</span>}
          {status === 'invalid' && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#b91c1c', background: '#fef2f2', padding: '2px 8px', borderRadius: 100, border: '1px solid #fca5a5' }}><XCircle size={10} /> Invalid</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input className="input" type={show ? 'text' : 'password'} placeholder={placeholder} value={val} onChange={e => setVal(e.target.value)} style={{ paddingRight: 40, fontFamily: val ? 'JetBrains Mono, monospace' : 'DM Sans', fontSize: 13 }} />
          <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleSave}>
          {saved ? <><CheckCircle size={13} color="#10b981" /> Saved</> : <><Save size={13} /> Save</>}
        </button>
      </div>
      {helpText && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 5 }}>{helpText}</div>}
    </div>
  )
}

function SendingAccount({ name, email, status, channel }: { name: string; email: string; status: 'active' | 'warming' | 'paused'; channel: string }) {
  const statusColors = { active: { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' }, warming: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' }, paused: { color: '#475569', bg: '#f8fafc', border: '#cbd5e1' } }
  const sc = statusColors[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9', marginBottom: 8 }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: 'Plus Jakarta Sans' }}>
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'JetBrains Mono' }}>{email}</div>
      </div>
      <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>
        {status === 'warming' ? '🔥 Warming up' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      <span style={{ fontSize: 12, color: '#94a3b8', padding: '3px 8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6 }}>{channel}</span>
      <button className="btn btn-sm btn-ghost" style={{ padding: '5px 8px', color: '#ef4444' }}><Trash2 size={13} /></button>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general')
  const [notifications, setNotifications] = useState({ newReply: true, appointment: true, campaignMilestone: true, bounce: true, weeklyReport: false, leadDiscovery: false })
  const [compliance, setCompliance] = useState({ canSpamFooter: true, optOutList: true, gdprMode: false, autoRemoveBouncedEmails: true, pauseOnHighBounce: true })

  return (
    <div style={{ padding: 28, maxWidth: 1000 }}>
      {/* Header */}
      <div className="animate-in" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Account</div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Settings</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Manage your integrations, sending accounts, compliance rules, and billing.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Tab Sidebar */}
        <div className="card animate-in" style={{ padding: '8px 0', position: 'sticky', top: 20 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px',
              border: 'none', background: tab === t.key ? '#eff6ff' : 'transparent', cursor: 'pointer',
              fontSize: 14, fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? '#2563eb' : '#374151', transition: 'all 0.15s', textAlign: 'left',
              borderLeft: `3px solid ${tab === t.key ? '#3b82f6' : 'transparent'}`,
            }}>
              <span style={{ color: tab === t.key ? '#3b82f6' : '#94a3b8' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card animate-in delay-1" style={{ padding: '24px 28px' }}>

          {/* ── General ── */}
          {tab === 'general' && (
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: '#0f172a', margin: '0 0 20px' }}>General Settings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input className="input" defaultValue="Austine Ogedegbe" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Company / Workspace</label>
                  <input className="input" defaultValue="LeadFlow AI" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input className="input" defaultValue="austecch@gmail.com" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Default Timezone</label>
                  <select className="select" defaultValue="Africa/Lagos">
                    <option>Africa/Lagos</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
              <SettingRow label="Sender Name" desc="Name that appears in the 'From' field of your outreach emails.">
                <input className="input" defaultValue="Austine from LeadFlow" style={{ width: 220 }} />
              </SettingRow>
              <SettingRow label="Reply-To Email" desc="All replies will be routed to this address and appear in your inbox.">
                <input className="input" defaultValue="austecch@gmail.com" style={{ width: 220 }} />
              </SettingRow>
              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary"><Save size={14} /> Save Changes</button>
              </div>
            </div>
          )}

          {/* ── Integrations ── */}
          {tab === 'integrations' && (
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: '#0f172a', margin: '0 0 6px' }}>API Integrations</h2>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Connect your API keys to enable AI personalization, lead enrichment, and multi-channel sending.</p>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f1f5f9' }}>
                  <Zap size={16} color="#4f46e5" />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>AI & Intelligence</span>
                </div>
                <SecretField label="Anthropic (Claude) API Key" value="" placeholder="sk-ant-api03-..." helpText="Get your key at console.anthropic.com — Required for AI message generation" status="missing" />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f1f5f9' }}>
                  <Mail size={16} color="#2563eb" />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Email Delivery</span>
                </div>
                <SecretField label="Mailgun API Key" value="" placeholder="key-xxxxxxxxxxxxxxxx" helpText="Primary email delivery. Get from mailgun.com" status="missing" />
                <SecretField label="SendGrid API Key" value="" placeholder="SG.xxxxxxxx" helpText="Fallback email delivery. Get from sendgrid.com" status="missing" />
                <SecretField label="ZeroBounce API Key" value="" placeholder="xxxxxxxxxxxxxxxx" helpText="Email validation before sending — reduces bounce rate" status="missing" />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f1f5f9' }}>
                  <Database size={16} color="#10b981" />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Lead Enrichment</span>
                </div>
                <SecretField label="Hunter.io API Key" value="" placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" helpText="Email discovery and verification" status="missing" />
                <SecretField label="Apollo.io API Key" value="" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" helpText="Contact and company data enrichment" status="missing" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f1f5f9' }}>
                  <Globe size={16} color="#9333ea" />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Social Channels</span>
                </div>
                <SecretField label="Instagram Access Token" value="" placeholder="IGQVJ..." helpText="Instagram Business API. Get from developers.facebook.com" status="missing" />
                <SecretField label="LinkedIn Client ID" value="" placeholder="xxxxxxxxxx" helpText="LinkedIn OAuth App. Get from developer.linkedin.com" status="missing" />
                <SecretField label="LinkedIn Client Secret" value="" placeholder="xxxxxxxxxxxxxxxx" status="missing" />
              </div>
            </div>
          )}

          {/* ── Sending Accounts ── */}
          {tab === 'sending' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: '#0f172a', margin: '0 0 4px' }}>Sending Accounts</h2>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Connect email addresses and social accounts for outreach.</p>
                </div>
                <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Account</button>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Email Accounts</div>
                <SendingAccount name="Austine Ogedegbe" email="austecch@gmail.com" status="active" channel="Gmail" />
                <SendingAccount name="LeadFlow Outreach" email="outreach@digitalriverz.com" status="warming" channel="SMTP" />
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Social Accounts</div>
                <div style={{ padding: '16px', background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>No social accounts connected</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>Connect LinkedIn and Instagram in the Integrations tab first</div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setTab('integrations')}>
                    <ExternalLink size={13} /> Go to Integrations
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 20, padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>⚠️ Email Warm-Up Required</div>
                <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6 }}>
                  New email accounts must warm up over 14 days before sending at full volume. LeadFlow AI handles this automatically — starting at 10/day and ramping up to your plan limit.
                </div>
              </div>
            </div>
          )}

          {/* ── Compliance ── */}
          {tab === 'compliance' && (
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: '#0f172a', margin: '0 0 6px' }}>Compliance & Anti-Spam</h2>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>These settings help ensure your outreach complies with CAN-SPAM, GDPR, and CASL regulations.</p>

              <SettingRow label="CAN-SPAM Footer" desc="Automatically append a physical address and unsubscribe link to all cold emails. Required by US law.">
                <Toggle value={compliance.canSpamFooter} onChange={v => setCompliance(c => ({ ...c, canSpamFooter: v }))} />
              </SettingRow>
              <SettingRow label="Global Opt-Out List" desc="Maintain a suppression list. Anyone who unsubscribes is permanently blocked from all future outreach.">
                <Toggle value={compliance.optOutList} onChange={v => setCompliance(c => ({ ...c, optOutList: v }))} />
              </SettingRow>
              <SettingRow label="GDPR Mode" desc="Store EU leads in EU-region only. Enforce data deletion within 72 hours of request. Required for EU contacts.">
                <Toggle value={compliance.gdprMode} onChange={v => setCompliance(c => ({ ...c, gdprMode: v }))} />
              </SettingRow>
              <SettingRow label="Auto-Remove Bounced Emails" desc="Hard bounces are immediately removed from all campaigns and added to the suppression list.">
                <Toggle value={compliance.autoRemoveBouncedEmails} onChange={v => setCompliance(c => ({ ...c, autoRemoveBouncedEmails: v }))} />
              </SettingRow>
              <SettingRow label="Pause Campaign on High Bounce Rate" desc="Automatically pause a campaign if its bounce rate exceeds 5% to protect sender reputation.">
                <Toggle value={compliance.pauseOnHighBounce} onChange={v => setCompliance(c => ({ ...c, pauseOnHighBounce: v }))} />
              </SettingRow>

              <div style={{ marginTop: 20, padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d', marginBottom: 8 }}>✅ Compliance Status</div>
                {[
                  { label: 'CAN-SPAM', status: compliance.canSpamFooter },
                  { label: 'Opt-Out Handling', status: compliance.optOutList },
                  { label: 'Bounce Management', status: compliance.autoRemoveBouncedEmails },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    {item.status ? <CheckCircle size={14} color="#16a34a" /> : <XCircle size={14} color="#dc2626" />}
                    <span style={{ fontSize: 13, color: '#374151' }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: item.status ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{item.status ? 'Compliant' : 'Not configured'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Billing ── */}
          {tab === 'billing' && (
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: '#0f172a', margin: '0 0 20px' }}>Billing & Plan</h2>

              {/* Current plan */}
              <div style={{ padding: '20px', background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current Plan</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Growth Plan</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>$497/month · Renews May 1, 2026</div>
                  </div>
                  <span style={{ padding: '4px 12px', background: '#10b981', color: 'white', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Active</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {[
                    { label: 'Leads/mo', value: '2,500' },
                    { label: 'Campaigns', value: 'Unlimited' },
                    { label: 'Email Accounts', value: '5' },
                    { label: 'AI Messages', value: 'Unlimited' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'white', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: 800, color: '#1e40af' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>This Month's Usage</div>
                {[
                  { label: 'Leads Generated', used: 1203, max: 2500, color: '#3b82f6' },
                  { label: 'Outreach Sent', used: 715, max: 5000, color: '#8b5cf6' },
                  { label: 'AI Messages Generated', used: 842, max: 99999, color: '#10b981' },
                ].map((u, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{u.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{u.used.toLocaleString()} {u.max < 99999 ? `/ ${u.max.toLocaleString()}` : '(Unlimited)'}</span>
                    </div>
                    {u.max < 99999 && (
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ width: `${Math.round((u.used / u.max) * 100)}%`, background: u.color }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary"><Zap size={14} /> Upgrade Plan</button>
                <button className="btn btn-secondary"><CreditCard size={14} /> Manage Billing</button>
                <button className="btn btn-ghost" style={{ marginLeft: 'auto', color: '#ef4444' }}>Cancel Plan</button>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: '#0f172a', margin: '0 0 6px' }}>Notification Preferences</h2>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Choose what you want to be notified about. Notifications appear in-app and via email.</p>

              <SettingRow label="New Reply Received" desc="Get notified when a prospect replies to any outreach message.">
                <Toggle value={notifications.newReply} onChange={v => setNotifications(n => ({ ...n, newReply: v }))} />
              </SettingRow>
              <SettingRow label="Appointment Booked" desc="Alert when a prospect books a discovery call via your calendar link.">
                <Toggle value={notifications.appointment} onChange={v => setNotifications(n => ({ ...n, appointment: v }))} />
              </SettingRow>
              <SettingRow label="Campaign Milestones" desc="Notify when campaigns hit 100, 250, 500+ leads contacted.">
                <Toggle value={notifications.campaignMilestone} onChange={v => setNotifications(n => ({ ...n, campaignMilestone: v }))} />
              </SettingRow>
              <SettingRow label="Bounce Rate Alert" desc="Alert when a campaign's bounce rate exceeds your threshold.">
                <Toggle value={notifications.bounce} onChange={v => setNotifications(n => ({ ...n, bounce: v }))} />
              </SettingRow>
              <SettingRow label="Weekly Performance Report" desc="Receive a summary of all campaign activity every Monday morning.">
                <Toggle value={notifications.weeklyReport} onChange={v => setNotifications(n => ({ ...n, weeklyReport: v }))} />
              </SettingRow>
              <SettingRow label="New Leads Discovered" desc="Alert when a discovery batch completes and new leads are ready for review.">
                <Toggle value={notifications.leadDiscovery} onChange={v => setNotifications(n => ({ ...n, leadDiscovery: v }))} />
              </SettingRow>

              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary"><Save size={14} /> Save Preferences</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
