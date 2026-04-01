'use client'
import { useState } from 'react'
import { Cpu, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles, Users, BarChart3, Zap } from 'lucide-react'

const FEATURES = [
  { icon: <Users size={18} />, title: 'AI Lead Discovery', desc: 'Find qualified prospects across LinkedIn, Google, and Instagram automatically.' },
  { icon: <Sparkles size={18} />, title: 'Claude AI Personalization', desc: 'Every message feels handcrafted — because it\'s built from real signals.' },
  { icon: <Zap size={18} />, title: 'Multi-Channel Outreach', desc: 'Email, LinkedIn, and Instagram DMs from one unified workflow.' },
  { icon: <BarChart3 size={18} />, title: 'Conversion Analytics', desc: 'Track every step from first contact to booked appointment.' },
]

const SOCIAL_PROOF = [
  { name: 'Marcus Chen', company: 'Stackify Labs', text: 'Went from 2% to 14% reply rate in our first month.' },
  { name: 'Adaeze Okafor', company: 'Lumina Beauty Co.', text: 'Booked 9 discovery calls in the first two weeks.' },
  { name: 'James Harrington', company: 'Vertex Growth Agency', text: 'Our clients are seeing 3x better results than manual outreach.' },
]

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    if (mode === 'signup') {
      setStep('verify')
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Left Panel ── */}
      <div style={{
        width: '50%', background: 'linear-gradient(160deg, #0a0f1e 0%, #0f172a 50%, #1e1b4b 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 56px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}>
            <Cpu size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: 'white', letterSpacing: '-0.3px' }}>LeadFlow AI</div>
            <div style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>AI-Powered Outreach</div>
          </div>
        </div>

        {/* Hero copy */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            🚀 Phase 1 MVP — Now Live
          </div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            Turn cold prospects into<br />
            <span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              booked appointments.
            </span>
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 36, maxWidth: 400 }}>
            AI discovers your ideal customers, writes personalized messages, sends across multiple channels, and tracks every conversion — automatically.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
          <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.65, marginBottom: 12, fontStyle: 'italic' }}>
            "{SOCIAL_PROOF[testimonialIdx].text}"
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>
              {SOCIAL_PROOF[testimonialIdx].name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{SOCIAL_PROOF[testimonialIdx].name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{SOCIAL_PROOF[testimonialIdx].company}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
              {SOCIAL_PROOF.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{ width: i === testimonialIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === testimonialIdx ? '#3b82f6' : '#334155', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {step === 'verify' ? (
            /* Email verify screen */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={28} color="#16a34a" />
              </div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 24, color: '#0f172a', margin: '0 0 10px' }}>Check your email</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, marginBottom: 24 }}>
                We sent a verification link to <strong>{email}</strong>.<br />Click it to activate your account.
              </p>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }} onClick={() => setStep('form')}>
                Back to login
              </button>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>
                Didn't receive it? <button onClick={() => {}} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Resend</button>
              </p>
            </div>
          ) : (
            <>
              {/* Mode toggle */}
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 28, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h1>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer', fontSize: 14, padding: 0 }}>
                    {mode === 'login' ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Google OAuth */}
              <button style={{
                width: '100%', padding: '11px 18px', borderRadius: 8, border: '1px solid #d1d5db', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 20, fontFamily: 'DM Sans',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; (e.currentTarget as HTMLElement).style.borderColor = '#9ca3af' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.borderColor = '#d1d5db' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mode === 'signup' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Full Name</label>
                      <input className="input" placeholder="Austine Ogedegbe" value={name} onChange={e => setName(e.target.value)} required={mode === 'signup'} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Company</label>
                      <input className="input" placeholder="Your company" value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input className="input" type="email" placeholder="austecch@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ paddingLeft: 38 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Password</label>
                    {mode === 'login' && (
                      <button type="button" style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: 38, paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: password.length >= i * 3 ? (password.length >= 10 ? '#10b981' : '#f59e0b') : '#e2e8f0', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                  )}
                </div>

                {mode === 'signup' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <input type="checkbox" id="terms" required style={{ marginTop: 2, cursor: 'pointer', accentColor: '#3b82f6' }} />
                    <label htmlFor="terms" style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, cursor: 'pointer' }}>
                      I agree to the <span style={{ color: '#3b82f6', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: '#3b82f6', fontWeight: 600 }}>Privacy Policy</span>
                    </label>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                  {loading ? (
                    <><div className="loading-dots"><span /><span /><span /></div> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
                  ) : (
                    <>{mode === 'login' ? 'Sign in to dashboard' : 'Create free account'} <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              {mode === 'signup' && (
                <div style={{ marginTop: 20, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 13, color: '#15803d', lineHeight: 1.5 }}>
                    <strong>Free 14-day trial</strong> — No credit card required. Full access to all Phase 1 features.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
