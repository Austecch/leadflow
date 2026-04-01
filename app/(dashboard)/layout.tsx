'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Zap, Send, BarChart3, Inbox,
  Target, Bell, Settings, ChevronDown, LogOut, Plus, Cpu, KanbanSquare
} from 'lucide-react'
import { mockNotifications } from '@/lib/mock-data'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/icp', label: 'ICP Builder', icon: Target },
  { href: '/leads', label: 'Lead Discovery', icon: Users },
  { href: '/leads/kanban', label: 'Pipeline Board', icon: BarChart3 },
  { href: '/campaigns', label: 'Campaigns', icon: Zap },
  { href: '/campaigns/new', label: 'New Campaign', icon: Plus },
  { href: '/outreach', label: 'AI Outreach', icon: Send },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/inbox', label: 'Reply Inbox', icon: Inbox },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const unreadCount = mockNotifications.filter(n => !n.read).length

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(59,130,246,0.35)'
            }}>
              <Cpu size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 17, color: 'white', letterSpacing: '-0.3px' }}>
                LeadFlow
              </div>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginTop: -1 }}>AI Platform</div>
            </div>
          </div>
        </div>

        {/* New Campaign CTA */}
        <div style={{ padding: '8px 16px 8px' }}>
          <Link href="/campaigns" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))',
              border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, cursor: 'pointer',
              color: '#93c5fd', fontSize: 13, fontWeight: 600,
            }}>
              <Plus size={15} />
              New Campaign
            </div>
          </Link>
        </div>

        {/* Nav */}
        <div className="nav-section">Main</div>
        <nav>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
              <Icon size={17} className="icon" />
              <span>{label}</span>
              {href === '/inbox' && unreadCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: '#ef4444', color: 'white',
                  fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 100, minWidth: 20, textAlign: 'center'
                }}>{unreadCount}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="nav-section" style={{ marginTop: 16 }}>Account</div>
        <nav>
          <div className="nav-item">
            <Bell size={17} className="icon" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 100 }}>{unreadCount}</span>
            )}
          </div>
          <div className="nav-item">
            <Settings size={17} className="icon" />
            <span>Settings</span>
          </div>
        </nav>

        {/* User */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14,
              fontFamily: 'Plus Jakarta Sans', flexShrink: 0
            }}>AO</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Austine Ogedegbe</div>
              <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Growth Plan</div>
            </div>
            <ChevronDown size={15} color="#64748b" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  )
}
