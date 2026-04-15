"use client";

import { useState } from "react";

/* ── constants ─────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are a professional review response specialist for local businesses. Given a customer review (Google or Facebook), generate a thoughtful, warm, professional response that:

1. Thanks the customer by name if possible
2. Acknowledges what they specifically mentioned
3. Shows genuine appreciation for their feedback
4. If there were any issues mentioned, addresses them with care and accountability
5. Ends with an invitation to return or connect

Tone: Confident but warm. Professional but human. Like a trusted local business owner who genuinely cares.

Format: A single well-crafted response paragraph (2-4 sentences) ready to post. No meta-commentary, no explanations—just the response text itself.`;

/* ── API call ───────────────────────────────────────────────── */
async function generateResponse(review: string): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.LLM_MODEL || "minimax/MiniMax-M2.7";

  const res = await fetch("https://api.minimax.chat/v1/text/chatcompletion_pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: review },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Minimax API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "(no response generated)";
}

/* ── landing content components ────────────────────────────── */
function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge">✨ No account required — try it free</div>
        <h1 className="hero-title">
          Turn Every Review Into a<br />
          <span className="hero-title-accent">Relationship</span>
        </h1>
        <p className="hero-sub">
          Paste a Google or Facebook review. Get a thoughtful, professional response
          in seconds. Built for local business owners who care about their reputation.
        </p>
        <a href="#tool" className="btn btn-primary hero-cta">
          Write a Response →
        </a>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      title: "Professional Tone",
      desc: "Responses that sound like you wrote them — warm, competent, and genuinely caring about every customer.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Saves Hours",
      desc: "Stop staring at a blank response box. Get a polished reply in seconds, then tweak if needed.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Private & Secure",
      desc: "Your reviews are processed and never stored. What happens on ReviewRipple stays on ReviewRipple.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
        </svg>
      ),
      title: "Mobile-First",
      desc: "Works perfectly on your phone while you're on the go. Handle reviews from anywhere.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why ReviewRipple?</h2>
          <p className="section-sub">Everything you need to manage your online reputation with confidence.</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "01", text: "Paste a Google or Facebook review into the box" },
    { num: "02", text: "Click \"Generate Response\" — AI does the rest" },
    { num: "03", text: "Copy the response and paste it into your review platform" },
  ];

  return (
    <section className="how" id="how">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub">Three steps to a better review response.</p>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.num} className="step">
              <div className="step-num">{s.num}</div>
              <p className="step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Simple, Honest Pricing</h2>
          <p className="section-sub">No subscriptions. No accounts. Just results.</p>
        </div>
        <div className="pricing-card">
          <div className="pricing-label">Free to Try</div>
          <div className="pricing-price">$0 <span className="pricing-period">/ forever</span></div>
          <ul className="pricing-features">
            <li>✓ Unlimited review responses</li>
            <li>✓ No account required</li>
            <li>✓ Copy to clipboard instantly</li>
            <li>✓ Works on mobile & desktop</li>
          </ul>
          <a href="#tool" className="btn btn-primary">Get Started Free →</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">Built by <strong>Recursion Labs</strong> · <a href="https://recursionagent.net" target="_blank" rel="noopener noreferrer">recursionagent.net</a></p>
      </div>
    </footer>
  );
}

/* ── main page ─────────────────────────────────────────────── */
export default function Home() {
  const [review, setReview] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!review.trim()) {
      setError("Please paste a review first.");
      return;
    }
    setError("");
    setLoading(true);
    setResponse("");
    try {
      const res = await generateResponse(review);
      setResponse(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />

      {/* ── Tool Section ── */}
      <section className="tool" id="tool">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Try It Now</h2>
            <p className="section-sub">Paste any Google or Facebook review below.</p>
          </div>

          <div className="tool-box">
            <textarea
              className="tool-input"
              placeholder={`Paste your review here...\n\nExample:\n"This place was amazing! The staff went above and beyond to help us. Will definitely be coming back!"`}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
            />

            <button
              className="btn btn-primary tool-btn"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <span className="loading-dots">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                "Generate Response"
              )}
            </button>

            {error && <p className="tool-error">{error}</p>}

            {response && (
              <div className="tool-result">
                <div className="tool-result-header">
                  <span className="tool-result-label">Your Response</span>
                  <button
                    className={`btn btn-copy ${copied ? "btn-copy-done" : ""}`}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                          <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
                <p className="tool-result-text">{response}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <PricingSection />
      <Footer />

      <style jsx>{`
        /* ── shared ── */
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
        .section-header { text-align: center; margin-bottom: 3rem; }
        .section-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: var(--navy-900); line-height: 1.2; }
        .section-sub { font-size: 1.0625rem; color: var(--text-secondary); margin-top: 0.5rem; }

        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; font-size: 0.9375rem; border: none; transition: all 0.15s ease; cursor: pointer; }
        .btn-primary { background: var(--navy-900); color: white; }
        .btn-primary:hover { background: var(--navy-800); transform: translateY(-1px); box-shadow: var(--shadow-lg); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* ── hero ── */
        .hero { padding: 5rem 0 4rem; text-align: center; background: linear-gradient(180deg, var(--blue-50) 0%, white 100%); }
        .hero-badge { display: inline-block; background: white; border: 1.5px solid var(--blue-200); color: var(--navy-800); font-size: 0.8125rem; font-weight: 600; padding: 0.375rem 1rem; border-radius: 100px; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm); }
        .hero-title { font-size: clamp(2.25rem, 6vw, 3.75rem); font-weight: 800; color: var(--navy-900); line-height: 1.1; margin-bottom: 1.25rem; }
        .hero-title-accent { color: var(--blue-600); }
        .hero-sub { font-size: clamp(1rem, 2.5vw, 1.1875rem); color: var(--text-secondary); max-width: 580px; margin: 0 auto 2rem; line-height: 1.7; }
        .hero-cta { font-size: 1.0625rem; padding: 0.875rem 2rem; border-radius: 12px; }

        /* ── features ── */
        .features { padding: 5rem 0; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.5rem; }
        .feature-card { background: white; border: 1.5px solid var(--warm-200); border-radius: 16px; padding: 1.75rem; transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .feature-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
        .feature-icon { width: 48px; height: 48px; background: var(--blue-50); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; color: var(--blue-600); }
        .feature-icon svg { width: 22px; height: 22px; }
        .feature-title { font-size: 1.0625rem; font-weight: 700; color: var(--navy-900); margin-bottom: 0.4rem; }
        .feature-desc { font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.6; }

        /* ── how ── */
        .how { padding: 5rem 0; background: var(--warm-50); }
        .steps { display: flex; flex-direction: column; gap: 1.25rem; max-width: 600px; margin: 0 auto; }
        .step { display: flex; align-items: center; gap: 1.5rem; background: white; border: 1.5px solid var(--warm-200); border-radius: 14px; padding: 1.25rem 1.5rem; }
        .step-num { font-size: 1.5rem; font-weight: 800; color: var(--blue-200); min-width: 3rem; }
        .step-text { font-size: 1rem; font-weight: 500; color: var(--navy-800); }

        /* ── tool ── */
        .tool { padding: 5rem 0; }
        .tool-box { max-width: 680px; margin: 0 auto; }
        .tool-input { width: 100%; padding: 1rem 1.125rem; border: 1.5px solid var(--warm-200); border-radius: 14px; font-family: inherit; font-size: 0.9375rem; color: var(--text-primary); background: white; resize: vertical; outline: none; transition: border-color 0.15s; line-height: 1.6; box-shadow: var(--shadow-sm); }
        .tool-input:focus { border-color: var(--blue-400); box-shadow: 0 0 0 3px var(--blue-100); }
        .tool-input::placeholder { color: var(--text-muted); }
        .tool-btn { width: 100%; margin-top: 1rem; font-size: 1rem; padding: 0.875rem; border-radius: 12px; }
        .tool-error { margin-top: 0.75rem; color: #ef4444; font-size: 0.875rem; text-align: center; }
        .tool-result { margin-top: 1.5rem; background: var(--blue-50); border: 1.5px solid var(--blue-200); border-radius: 14px; overflow: hidden; }
        .tool-result-header { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border-bottom: 1px solid var(--blue-100); background: white; }
        .tool-result-label { font-weight: 700; font-size: 0.875rem; color: var(--navy-800); text-transform: uppercase; letter-spacing: 0.05em; }
        .btn-copy { background: var(--blue-50); color: var(--navy-800); border: 1.5px solid var(--blue-200); padding: 0.4rem 0.875rem; border-radius: 8px; font-size: 0.8125rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem; transition: all 0.15s; }
        .btn-copy:hover { background: var(--blue-100); }
        .btn-copy-done { background: #d1fae5; color: #065f46; border-color: #6ee7b7; }
        .tool-result-text { padding: 1.25rem; font-size: 1rem; color: var(--navy-900); line-height: 1.7; white-space: pre-wrap; }

        /* ── pricing ── */
        .pricing { padding: 5rem 0; background: var(--warm-50); }
        .pricing-card { max-width: 420px; margin: 0 auto; background: white; border: 2px solid var(--navy-900); border-radius: 20px; padding: 2.5rem; text-align: center; box-shadow: var(--shadow-xl); }
        .pricing-label { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blue-600); margin-bottom: 0.75rem; }
        .pricing-price { font-size: 3rem; font-weight: 800; color: var(--navy-900); margin-bottom: 0.5rem; }
        .pricing-period { font-size: 1.125rem; font-weight: 500; color: var(--text-muted); }
        .pricing-features { list-style: none; margin: 1.5rem 0; text-align: left; display: flex; flex-direction: column; gap: 0.625rem; }
        .pricing-features li { font-size: 0.9375rem; color: var(--text-secondary); }

        /* ── footer ── */
        .footer { padding: 2rem 0; border-top: 1px solid var(--warm-200); }
        .footer-text { text-align: center; font-size: 0.875rem; color: var(--text-muted); }
        .footer-text a { color: var(--blue-600); font-weight: 500; }
        .footer-text a:hover { text-decoration: underline; }
        .footer-text strong { color: var(--text-primary); }

        /* ── loading dots ── */
        .loading-dots { display: inline-flex; gap: 4px; align-items: center; }
        .loading-dots span { width: 6px; height: 6px; background: white; border-radius: 50%; animation: bounce 1.2s infinite ease-in-out; }
        .loading-dots span:nth-child(1) { animation-delay: 0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.6; } 40% { transform: scale(1); opacity: 1; } }

        /* ── responsive ── */
        @media (max-width: 600px) {
          .hero { padding: 3.5rem 0 3rem; }
          .features, .how, .tool, .pricing { padding: 3.5rem 0; }
          .step { padding: 1rem 1.125rem; gap: 1rem; }
          .step-num { font-size: 1.25rem; min-width: 2.5rem; }
          .pricing-card { padding: 2rem 1.5rem; }
        }
      `}</style>
    </>
  );
}
