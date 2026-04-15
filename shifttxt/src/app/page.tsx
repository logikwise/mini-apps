'use client'

import Link from 'next/link'

const features = [
  {
    emoji: '⚡',
    title: 'Instant',
    desc: 'Type your situation, get a polished message in seconds.',
  },
  {
    emoji: '📱',
    title: 'Mobile-first',
    desc: 'Built for phones. Works perfectly on any device.',
  },
  {
    emoji: '🔒',
    title: 'No account needed',
    desc: 'Just open and use. No sign-up, no password, no hassle.',
  },
  {
    emoji: '🤝',
    title: 'Sounds like you',
    desc: 'AI that captures your voice — professional but personal.',
  },
]

const steps = [
  { num: '1', title: 'Pick a situation', desc: 'Sick, late, swap, schedule change — choose what happened.' },
  { num: '2', title: 'Add your details', desc: 'Your name, your shift, anything relevant.' },
  { num: '3', title: 'Copy & send', desc: 'Get a clean, professional message. Copy it. Send it.' },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: '10 messages per day. No credit card.',
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$4',
    period: '/month',
    desc: 'Unlimited messages. Priority AI. Save your templates.',
    cta: 'Go Pro',
    highlight: true,
  },
]

export default function LandingPage() {
  return (
    <main>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.5rem' }}>💬</span>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--indigo-700)' }}>ShiftTxt</span>
        </div>
        <Link href="/app" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
          Use app →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '64px 20px 48px',
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'var(--indigo-100)',
          color: 'var(--indigo-700)',
          padding: '6px 16px',
          borderRadius: 99,
          fontWeight: 700,
          fontSize: '0.85rem',
          marginBottom: 24,
        }}>
          For hourly workers 👷
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 3rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          color: 'var(--indigo-900)',
          marginBottom: 16,
        }}>
          Stop staring at a blank screen.
          <br />
          <span style={{ color: 'var(--indigo-500)' }}>Send the text.</span>
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: 32,
          maxWidth: 480,
          margin: '0 auto 32px',
        }}>
          Pick your situation, add the details — get a professional shift message
          that sounds like a real person wrote it. No sign-up needed.
        </p>
        <Link href="/app" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
          Generate your message →
        </Link>
      </section>

      {/* Preview bubble */}
      <div style={{
        maxWidth: 480,
        margin: '0 auto 64px',
        padding: '0 20px',
        textAlign: 'center',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '2px solid var(--indigo-200)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          textAlign: 'left',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: -12,
            right: 24,
            background: 'var(--indigo-500)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 99,
          }}>
            Preview
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text)', fontStyle: 'italic' }}>
            &ldquo;Hey [Manager], I&rsquo;m not feeling well and won&rsquo;t be able to make my shift tonight.
            I&rsquo;m really sorry for the short notice — I&rsquo;ll make sure to find coverage for next time.
            Hope you&rsquo;re doing well!&rdquo;
          </p>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--indigo-50)',
              color: 'var(--indigo-600)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 99,
            }}>
              ✓ Copied!
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <section style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '64px 20px',
      }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, fontSize: '1.75rem', textAlign: 'center', marginBottom: 40, color: 'var(--indigo-900)' }}>
            Why ShiftTxt?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {features.map(f => (
              <div key={f.title} style={{
                padding: 24,
                background: 'var(--bg)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.emoji}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: 'var(--indigo-800)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '64px 20px' }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, fontSize: '1.75rem', textAlign: 'center', marginBottom: 16, color: 'var(--indigo-900)' }}>
            How it works
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40 }}>
            Three steps. Under 30 seconds.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map(s => (
              <div key={s.num} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                padding: 20,
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--indigo-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0,
                }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4, color: 'var(--indigo-800)' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{
        background: 'var(--indigo-950)',
        padding: '64px 20px',
      }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, fontSize: '1.75rem', textAlign: 'center', marginBottom: 40, color: 'white' }}>
            Simple pricing
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            maxWidth: 560,
            margin: '0 auto',
          }}>
            {pricingPlans.map(p => (
              <div key={p.name} style={{
                background: p.highlight ? 'var(--indigo-600)' : 'var(--indigo-900)',
                borderRadius: 'var(--radius)',
                padding: 28,
                border: p.highlight ? '2px solid var(--indigo-400)' : '1px solid var(--indigo-800)',
                position: 'relative',
              }}>
                {p.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--indigo-400)',
                    color: 'var(--indigo-950)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 12px',
                    borderRadius: 99,
                  }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: p.highlight ? 'white' : 'var(--indigo-300)', marginBottom: 8 }}>
                  {p.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                  <span style={{ fontWeight: 800, fontSize: '2.5rem', color: 'white' }}>{p.price}</span>
                  <span style={{ color: p.highlight ? 'var(--indigo-200)' : 'var(--indigo-400)', fontSize: '0.9rem' }}>{p.period}</span>
                </div>
                <p style={{ color: p.highlight ? 'var(--indigo-100)' : 'var(--indigo-400)', fontSize: '0.9rem', marginBottom: 20 }}>
                  {p.desc}
                </p>
                <button
                  className="btn"
                  style={{
                    width: '100%',
                    background: p.highlight ? 'white' : 'var(--indigo-800)',
                    color: p.highlight ? 'var(--indigo-700)' : 'white',
                    border: p.highlight ? 'none' : '1px solid var(--indigo-700)',
                    fontWeight: 700,
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--indigo-900)', marginBottom: 16 }}>
          Ready to send the text?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '1.05rem' }}>
          No sign-up. No credit card. Just open and go.
        </p>
        <Link href="/app" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
          Try ShiftTxt free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        Built by <a href="https://recursionagent.net" target="_blank" rel="noopener">Recursion Labs</a> · <a href="https://recursionagent.net" target="_blank" rel="noopener">recursionagent.net</a>
      </footer>
    </main>
  )
}
