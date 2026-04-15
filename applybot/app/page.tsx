"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [jobListing, setJobListing] = useState("");
  const [resume, setResume] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleOptimize = async () => {
    if (!jobListing.trim() || !resume.trim()) return;

    setIsLoading(true);
    setOptimizedResume("");
    setAtsScore(null);
    setShowResult(false);

    try {
      const apiKey = process.env.NEXT_PUBLIC_MINIMAX_API_KEY;
      if (!apiKey) {
        throw new Error("MINIMAX_API_KEY not configured");
      }

      const response = await fetch(
        "https://api.minimax.chat/v1/text/chatcompletion_pro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "MiniMax-M2.7",
            messages: [
              {
                role: "system",
                content: `You are an expert ATS (Applicant Tracking System) resume optimizer. Your task is to:
1. Analyze the job listing to identify key requirements, keywords, and preferred qualifications
2. Analyze the resume to understand the candidate's experience and skills
3. Rewrite the resume to:
   - Include relevant keywords from the job listing (natural placement, not keyword stuffing)
   - Match the job's preferred format and structure
   - Highlight achievements with metrics where possible
   - Remove irrelevant orATS-unfriendly content
   - Use standard section headings (Experience, Education, Skills, etc.)
4. Estimate the ATS score (0-100) based on keyword matching, format, and structure

Output format:
[ATS_SCORE: XX]
---
<optimized resume content>

Keep the resume concise, professional, and ATS-friendly. Use standard resume formatting.`,
              },
              {
                role: "user",
                content: `JOB LISTING:
${jobListing}

RESUME:
${resume}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 4096,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      // Parse ATS score
      const scoreMatch = content.match(/ATS_SCORE:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

      // Extract resume content (after the score line and ---)
      const parts = content.split("---");
      const resumeContent = parts.length > 1 ? parts[1].trim() : content.replace(/ATS_SCORE:\s*\d+/i, "").trim();

      setOptimizedResume(resumeContent);
      setAtsScore(score);
      setShowResult(true);
    } catch (err) {
      console.error(err);
      setOptimizedResume(`Error: ${err instanceof Error ? err.message : "Failed to optimize resume. Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = optimizedResume;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToResult = () => {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold">ApplyBot</span>
          </div>
          <a href="#tool" className="btn-primary text-sm py-2 px-4">
            Try Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm text-slate-300">No account required · Instant results</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your resume is getting
            <br />
            <span className="gradient-text">rejected by robots.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            75% of resumes are rejected by ATS before a human ever sees them.
            ApplyBot optimizes your resume to beat the bots and land real interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#tool" className="btn-primary text-lg py-4 px-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimize Your Resume
            </a>
            <a href="#how" className="btn-secondary text-lg py-4 px-8">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Built for job seekers who mean business</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Stop sending the same generic resume to every job. Get an ATS-optimized version in seconds.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Smart Keyword Matching",
                desc: "AI analyzes the job description and weaves in the exact keywords recruiters are searching for.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "ATS Score Estimate",
                desc: "See your estimated ATS compatibility score before you apply. Know exactly where you stand.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Instant Results",
                desc: "Paste, click, done. Get your optimized resume in under 30 seconds. No signup, no waiting.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 card-hover"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Paste the Job Listing", desc: "Copy the entire job description from LinkedIn, Indeed, or any job board." },
              { step: "02", title: "Paste Your Resume", desc: "Drop in your current resume text. Plain text works best." },
              { step: "03", title: "Get Your Optimized Resume", desc: "Receive an ATS-friendly version with keyword optimization and a score estimate." },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-slate-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 mb-12">Try before you buy. No commitment.</p>
          <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 md:p-12 max-w-md mx-auto">
            <div className="text-sm text-amber-400 font-medium mb-2">Free Tier</div>
            <div className="text-5xl font-bold mb-2">$0</div>
            <div className="text-slate-400 mb-8">Forever free</div>
            <ul className="text-left space-y-3 mb-8">
              {["5 optimizations per month", "ATS score estimate", "Copy to clipboard", "Mobile-first design"].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">{f}</span>
                </li>
              ))}
            </ul>
            <a href="#tool" className="btn-primary w-full justify-center text-lg py-4">
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Optimize Your Resume Now</h2>
            <p className="text-slate-400">Paste your job listing and resume below. Get an ATS-optimized version in seconds.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="text-amber-400 mr-1">1.</span> Job Listing
              </label>
              <textarea
                value={jobListing}
                onChange={(e) => setJobListing(e.target.value)}
                placeholder="Paste the full job description here (copy from LinkedIn, Indeed, company careers page, etc.)..."
                className="w-full h-48 p-4 rounded-xl text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="text-amber-400 mr-1">2.</span> Your Resume
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your current resume here (plain text works best)..."
                className="w-full h-64 p-4 rounded-xl text-sm leading-relaxed"
              />
            </div>

            <button
              onClick={handleOptimize}
              disabled={isLoading || !jobListing.trim() || !resume.trim()}
              className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Optimizing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Optimize Resume
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {showResult && (
            <div ref={resultRef} className="mt-8 animate-fade-in-up">
              {atsScore !== null && (
                <div className="mb-6 flex items-center justify-center">
                  <div className="ats-badge rounded-2xl p-6 text-center min-w-[200px]">
                    <div className="relative z-10">
                      <div className="text-sm text-slate-400 mb-1">ATS Score</div>
                      <div className="text-5xl font-bold text-amber-400">{atsScore}</div>
                      <div className="text-xs text-slate-500 mt-1">/ 100</div>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="score-fill h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          style={{ width: `${atsScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="result-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Optimized Resume</h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-mono bg-slate-900/50 p-4 rounded-xl overflow-x-auto">
                  {optimizedResume}
                </pre>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={scrollToResult}
                  className="text-sm text-slate-500 hover:text-amber-400 transition-colors"
                >
                  ↑ Back to top
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-500">
          Built by <span className="text-amber-400">Recursion Labs</span> · <a href="https://recursionagent.net" className="hover:text-amber-400 transition-colors">recursionagent.net</a>
        </div>
      </footer>
    </main>
  );
}