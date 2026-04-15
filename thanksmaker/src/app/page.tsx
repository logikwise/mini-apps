"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";

// ──── Types ───────────────────────────────────────────────
interface Result {
  text: string;
  giftee: string;
  gift: string;
}

// ──── AI Generation ────────────────────────────────────────
async function generateNote(gift: string, giftee: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_MINIMAX_API_KEY ?? "";
  if (!apiKey) {
    // Demo mode when no API key
    return `Dear ${giftee},\n\nThank you so very much for the ${gift}. It truly means more than words can express. Your thoughtfulness has filled our hearts with gratitude, and we will treasure this gift—and the memory of your kindness—for years to come.\n\nWith love and appreciation,\nThe Couple`;
  }

  const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "minimax/MiniMax-M2.7",
      messages: [
        {
          role: "system",
          content:
            "You are an elegant wedding stationery scribe. Write warm, heartfelt, polished thank-you notes that feel like they came from a calligrapher — gracious but not overly formal, specific but not clinical. 3-5 sentences. No preamble, no meta-commentary, just the note.",
        },
        {
          role: "user",
          content: `Write a thank-you note for a gift of "${gift}" from ${giftee}. Keep it warm, sincere, and beautifully phrased.`,
        },
      ],
      max_tokens: 256,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Minimax API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

// ──── Copy Button ──────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className={`btn-copy ${copied ? "copied" : ""}`} onClick={handleCopy}>
      {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
    </button>
  );
}

// ──── NoteGenerator (Client Component) ─────────────────────
function NoteGenerator() {
  const [gift, setGift] = useState("");
  const [giftee, setGiftee] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!gift.trim()) {
      setError("Please enter the gift you received.");
      return;
    }
    if (!giftee.trim()) {
      setError("Please enter the giver's name.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const note = await generateNote(gift.trim(), giftee.trim());
      setResult({ text: note, giftee: giftee.trim(), gift: gift.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="tool-section" id="try">
      <h2>Create Your Thank You Note</h2>

      <div className="tool-form">
        <div className="form-group">
          <label htmlFor="gift">Gift Received</label>
          <input
            id="gift"
            type="text"
            placeholder="e.g., Le Creuset Dutch Oven, Silk throw blanket…"
            value={gift}
            onChange={(e) => setGift(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            maxLength={120}
          />
        </div>

        <div className="form-group">
          <label htmlFor="giftee">From (Giver&apos;s Name)</label>
          <input
            id="giftee"
            type="text"
            placeholder="e.g., Aunt Barbara, The Hendersons…"
            value={giftee}
            onChange={(e) => setGiftee(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            maxLength={80}
          />
          <span className="form-hint">Who should this thank-you note be addressed to?</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading || !gift.trim() || !giftee.trim()}
          style={{ width: "100%", marginTop: "0.25rem" }}
        >
          {loading ? "Crafting your note…" : "Generate Note ✨"}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Your note is being crafted…</p>
        </div>
      )}

      {result && !loading && (
        <div className="result-card" ref={resultRef}>
          <p className="result-label">Your Thank You Note</p>
          <p className="result-text">{result.text}</p>
          <div className="result-actions">
            <button
              className={`btn-copy ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ──── Page Component ───────────────────────────────────────
export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Sticky Header */}
      <header className="site-header">
        <div className="logo">
          Thanks<span className="logo-accent">Maker</span>
        </div>
        <nav>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link" style={{ marginLeft: "0.5rem" }}>How It Works</a>
          <a href="#try" className="nav-link" style={{ marginLeft: "0.5rem" }}>Try It Free</a>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="hero">
          <span className="hero-badge">✨ No account required</span>
          <h1>Thank You Notes
            <br />That Mean It</h1>
          <p className="hero-sub">
            Turn the name of a gift and who gave it into a beautifully worded thank-you note — in seconds. Made for weddings, showers, anniversaries, and every occasion worth celebrating.
          </p>
          <a href="#try" className="btn-primary">Write My Note →</a>
        </section>

        <hr className="divider" />

        {/* Features */}
        <section id="features" className="features">
          <p className="section-label">Why You&apos;ll Love It</p>
          <h2 className="section-title">The Thoughtful Way to Say Thanks</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✍️</div>
              <h3>Effortless to Use</h3>
              <p>Just enter the gift and the giver&apos;s name. Our AI handles the rest, crafting something truly personal.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎀</div>
              <h3>Wedding Ready</h3>
              <p>From formal registry gifts to sentimental surprises, each note sounds gracious, warm, and perfectly pitched.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>No signup, no waiting. Your note is ready the moment you hit generate — copy and go.</p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* How It Works */}
        <section id="how-it-works" className="how-it-works">
          <p className="section-label">How It Works</p>
          <h2 className="section-title">Three Steps to the Perfect Note</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-text">
                <h3>Tell Us the Gift</h3>
                <p>Type in what you received — a Le Creuset Dutch Oven, a cash gift, a beautiful throw blanket.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-text">
                <h3>Name the Giver</h3>
                <p>Enter who it came from — Aunt Barbara, The Hendersons, your college roommate.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-text">
                <h3>Copy &amp; Send</h3>
                <p>Get a polished note in seconds. Hit copy, paste it into your card or message — done.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* Pricing */}
        <section className="pricing" id="pricing">
          <p className="section-label">Simple Pricing</p>
          <h2 className="section-title">Try It Free Today</h2>
          <div className="pricing-card">
            <span className="pricing-tag">Launch Special</span>
            <div className="pricing-price">
              <sup>$</sup>0
            </div>
            <p className="pricing-period">Free while in beta — no credit card needed</p>
            <ul className="pricing-features">
              <li>Unlimited thank-you notes</li>
              <li>No account or signup required</li>
              <li>Mobile-optimized for your phone</li>
              <li>Copy-to-clipboard on every note</li>
              <li>Fast AI generation in seconds</li>
            </ul>
            <a href="#try" className="btn-primary" style={{ width: "100%" }}>Get Started Free →</a>
          </div>
        </section>

        <hr className="divider" />

        {/* Tool */}
        <NoteGenerator />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <p className="footer-text">
          Built by <a href="https://recursionagent.net" target="_blank" rel="noopener noreferrer" className="footer-link">Recursion Labs</a> · <a href="https://recursionagent.net" target="_blank" rel="noopener noreferrer" className="footer-link">recursionagent.net</a>
        </p>
      </footer>
    </div>
  );
}
