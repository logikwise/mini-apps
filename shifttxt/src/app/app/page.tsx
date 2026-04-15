'use client'

import { useState } from 'react'
import Link from 'next/link'

const situations = [
  { id: 'call_out_sick', emoji: '🤒', label: 'Call out sick' },
  { id: 'shift_swap', emoji: '🔄', label: 'Shift swap' },
  { id: 'running_late', emoji: '⏰', label: 'Running late' },
  { id: 'schedule_change', emoji: '📅', label: 'Schedule change' },
  { id: 'cant_make_shift', emoji: '❌', label: "Can't make shift" },
  { id: 'vacation_pto', emoji: '🌴', label: 'Vacation / PTO' },
]

export default function AppPage() {
  const [selectedSituation, setSelectedSituation] = useState('')
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const selected = situations.find(s => s.id === selectedSituation)

  const generate = async () => {
    if (!selectedSituation || !name.trim()) {
      setError('Please pick a situation and enter your name.')
      return
    }

    setError('')
    setLoading(true)
    setMessage('')
    setCopied(false)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: selected?.label,
          name: name.trim(),
          details: details.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setMessage(data.message)
      }
    } catch {
      setError('Failed to reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!message) return
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.3rem' }}>💬</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--indigo-700)' }}>ShiftTxt</span>
        </Link>
        <Link href="/" style={{ color: 'var(--indigo-600)', fontWeight: 700, fontSize: '0.9rem' }}>
          ← Home
        </Link>
      </header>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>

        {/* Step 1: Situation */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--indigo-600)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}>1</span>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--indigo-900)' }}>What happened?</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10,
          }}>
            {situations.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedSituation(s.id); setMessage(''); setError('') }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '16px 12px',
                  borderRadius: 'var(--radius)',
                  border: `2px solid ${selectedSituation === s.id ? 'var(--indigo-500)' : 'var(--border)'}`,
                  background: selectedSituation === s.id ? 'var(--indigo-50)' : 'var(--surface)',
                  color: selectedSituation === s.id ? 'var(--indigo-700)' : 'var(--text)',
                  fontWeight: selectedSituation === s.id ? 700 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Details */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--indigo-600)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}>2</span>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--indigo-900)' }}>Your details</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 6, color: 'var(--indigo-800)' }}>
                Your name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="e.g. Jamie"
                maxLength={50}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${name ? 'var(--indigo-300)' : 'var(--border)'}`,
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--indigo-500)'}
                onBlur={e => e.target.style.borderColor = name ? 'var(--indigo-300)' : 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 6, color: 'var(--indigo-800)' }}>
                Anything else? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="e.g. I have a fever and sore throat. Shift is 3–11pm today."
                rows={3}
                maxLength={300}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--border)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  resize: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--indigo-500)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {details.length}/300
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: '#dc2626',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '1.05rem', padding: '14px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
              Generating...
            </>
          ) : (
            <>Generate message →</>
          )}
        </button>

        {/* Result */}
        {message && (
          <section style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--indigo-600)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}>3</span>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--indigo-900)' }}>Your message</h2>
            </div>

            {/* Chat bubble */}
            <div style={{
              background: 'var(--surface)',
              border: '2px solid var(--indigo-200)',
              borderRadius: 'var(--radius)',
              padding: '20px 22px',
              boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
              marginBottom: 12,
              position: 'relative',
            }}>
              {/* Chat tail */}
              <div style={{
                position: 'absolute',
                top: -10,
                left: 24,
                width: 16,
                height: 16,
                background: 'var(--surface)',
                borderLeft: '2px solid var(--indigo-200)',
                borderTop: '2px solid var(--indigo-200)',
                transform: 'rotate(45deg)',
              }} />
              <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                {message}
              </p>
            </div>

            {/* Copy button */}
            <button
              onClick={copy}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.95rem', padding: '12px' }}
            >
              {copied ? '✓ Copied to clipboard!' : '📋 Copy to clipboard'}
            </button>
          </section>
        )}

        {/* Try another */}
        {message && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => { setMessage(''); setCopied(false); setError('') }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--indigo-600)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Generate another →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="site-footer">
        Built by <a href="https://recursionagent.net" target="_blank" rel="noopener">Recursion Labs</a> · <a href="https://recursionagent.net" target="_blank" rel="noopener">recursionagent.net</a>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 640px) {
          input, textarea {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </main>
  )
}
