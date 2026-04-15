"use client";

import { useState, useRef } from "react";

type LetterType = {
  id: string;
  label: string;
  description: string;
  icon: string;
  promptHint: string;
};

const LETTER_TYPES: LetterType[] = [
  {
    id: "late_payment",
    label: "Late Payment Notice",
    description: "Remind a tenant that rent is overdue, respectfully but firmly.",
    icon: "⏰",
    promptHint: "Mention the due date, amount owed, and any late fee policy.",
  },
  {
    id: "maintenance_request",
    label: "Maintenance Request",
    description: "Report a repair issue to your landlord clearly and completely.",
    icon: "🔧",
    promptHint: "Describe the issue, when it started, and any photos available.",
  },
  {
    id: "lease_violation",
    label: "Lease Violation Notice",
    description: "Document a breach of lease terms for the record.",
    icon: "⚠️",
    promptHint: "Specify which lease clause was violated and the corrective action needed.",
  },
  {
    id: "move_out_notice",
    label: "Move-Out Notice",
    description: "Formally notify your landlord of your intent to vacate.",
    icon: "🚪",
    promptHint: "Include your move-out date and forwarding address if known.",
  },
  {
    id: "noise_complaint",
    label: "Noise Complaint",
    description: "Address excessive noise from a neighbor respectfully.",
    icon: "🔇",
    promptHint: "Describe the noise pattern, times, and how it's affecting you.",
  },
  {
    id: "rent_increase",
    label: "Rent Increase Notice",
    description: "Notify a tenant of an upcoming rent adjustment.",
    icon: "📈",
    promptHint: "Include the current rent, new rent amount, and effective date.",
  },
  {
    id: "security_deposit",
    label: "Security Deposit Demand",
    description: "Request the return of your security deposit after move-out.",
    icon: "💵",
    promptHint: "Include move-out date, forwarding address, and amount held.",
  },
  {
    id: "lease_renewal",
    label: "Lease Renewal Request",
    description: "Ask your landlord to renew your expiring lease.",
    icon: "🔄",
    promptHint: "Mention your current lease end date and desired new terms.",
  },
];

function copyToClipboard(text: string, btn: HTMLButtonElement) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
    }, 2000);
  });
}

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<string>("late_payment");
  const [tenantName, setTenantName] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectedLetterType = LETTER_TYPES.find((t) => t.id === selectedType)!;

  async function generateLetter(e: React.FormEvent) {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedLetter(null);

    const letterType = selectedLetterType;
    const prompt = `You are a professional legal letter writer specializing in US residential housing. Write a formal but approachable housing letter with the following details:

LETTER TYPE: ${letterType.label}
${letterType.promptHint}
${additionalDetails ? `ADDITIONAL DETAILS: ${additionalDetails}` : ""}

Generate a complete, ready-to-use formal letter. Include:
- A proper date line at the top
- Recipient name and address block
- A clear subject line
- A professional but respectful body
- A formal closing
- Sender signature block (use "${tenantName || "[Your Name]"}" as the sender)

Use proper letter formatting. The tone should be formal but not intimidating — clear, confident, and respectful. Do NOT include any legal disclaimers or "this is not legal advice" language.

Output ONLY the letter text, no explanations, no headers, nothing else.`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_MINIMAX_API_KEY || process.env.MINIMAX_API_KEY;
      if (!apiKey) {
        setError("API key not configured. Please set MINIMAX_API_KEY in your environment.");
        setIsGenerating(false);
        return;
      }

      const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_pro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "MiniMax-M2.7",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const letterText =
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.text ||
        data.output ||
        "No response generated. Please try again.";

      setGeneratedLetter(letterText);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate letter. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function resetForm() {
    setGeneratedLetter(null);
    setError(null);
    setAdditionalDetails("");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-forest text-white py-4 px-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-serif text-xl font-bold">RentReply</span>
          </div>
          <nav>
            <a href="#tool" className="text-sm text-amber-light hover:text-white transition-colors">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-forest-dark via-forest to-forest-light text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Formal Housing Letters,<br className="hidden sm:block" /> Made Simple
            </h1>
            <p className="text-amber-light text-lg sm:text-xl mb-8 max-w-xl mx-auto">
              Tenants and landlords generate professional, legally-minded housing letters in seconds.
              No account. No hassle.
            </p>
            <a
              href="#tool"
              className="inline-block bg-amber text-white font-semibold px-8 py-3 rounded-lg hover:bg-amber-dark transition-colors shadow-lg"
            >
              Write a Letter Free
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-8 text-ink">
              Why RentReply?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "Instant Results",
                  desc: "Get a formal letter in seconds. Just pick a type, fill in details, done.",
                },
                {
                  icon: "📱",
                  title: "Mobile First",
                  desc: "Works perfectly on your phone. Draft from anywhere — apartment, coffee shop, wherever.",
                },
                {
                  icon: "🔒",
                  title: "No Account Needed",
                  desc: "Try it right now. No signup, no login, no tracking. Your data stays yours.",
                },
              ].map((f) => (
                <div key={f.title} className="text-center p-4">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-serif font-bold text-lg mb-1 text-forest">{f.title}</h3>
                  <p className="text-sm text-ink-light leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 px-4 bg-stone-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-8 text-ink">
              How It Works
            </h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Pick a Letter Type", desc: "Choose from 8 common housing scenarios — late payment, maintenance, move-out, and more." },
                { step: "2", title: "Fill in the Details", desc: "Add names, address, and any specifics. The more detail, the better the letter." },
                { step: "3", title: "Copy & Send", desc: "Get a professionally formatted letter. Copy it, paste it into email, or print it out." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start bg-white rounded-xl p-4 shadow-sm border border-stone-100">
                  <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-forest mb-0.5">{item.title}</h3>
                    <p className="text-sm text-ink-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Letter Generator Tool */}
        <section id="tool" className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-2 text-ink">
              Write Your Letter
            </h2>
            <p className="text-center text-ink-light text-sm mb-8">
              Select a letter type and fill in the details below.
            </p>

            {!generatedLetter ? (
              <form onSubmit={generateLetter} className="space-y-6">
                {/* Letter Type Selector */}
                <div>
                  <label className="block font-semibold text-sm mb-2 text-ink">
                    Letter Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LETTER_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${
                          selectedType === type.id
                            ? "border-forest bg-forest/5 text-forest font-medium"
                            : "border-stone-200 bg-white text-ink hover:border-forest/40"
                        }`}
                      >
                        <span className="mr-1.5">{type.icon}</span>
                        <span className="font-semibold">{type.label}</span>
                        <p className={`text-xs mt-0.5 ${selectedType === type.id ? "text-forest/70" : "text-ink-light"}`}>
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tenantName" className="block text-sm font-semibold mb-1 text-ink">
                      Your Name
                    </label>
                    <input
                      id="tenantName"
                      type="text"
                      placeholder="Jane Smith"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="landlordName" className="block text-sm font-semibold mb-1 text-ink">
                      Landlord / Recipient Name
                    </label>
                    <input
                      id="landlordName"
                      type="text"
                      placeholder="Property Manager Co."
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="propertyAddress" className="block text-sm font-semibold mb-1 text-ink">
                    Property Address
                  </label>
                  <input
                    id="propertyAddress"
                    type="text"
                    placeholder="123 Main St, Apt 4B, City, State 12345"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="additionalDetails" className="block text-sm font-semibold mb-1 text-ink">
                    Additional Details
                  </label>
                  <p className="text-xs text-ink-light mb-1.5">
                    {selectedLetterType.promptHint}
                  </p>
                  <textarea
                    id="additionalDetails"
                    rows={4}
                    placeholder="Include any relevant dates, amounts, lease clauses, or specific circumstances..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-forest hover:bg-forest-dark disabled:bg-stone-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Generating Letter…
                    </>
                  ) : (
                    <>
                      <span>⚡</span> Generate Letter
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Result View */
              <div ref={resultRef} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-forest">Your Letter</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (resultRef.current) {
                          const letterContent = resultRef.current.querySelector(".letter-paper");
                          if (letterContent) copyToClipboard(letterContent.textContent || "", resultRef.current.querySelector('[data-copy-btn]') as HTMLButtonElement);
                        }
                      }}
                      data-copy-btn
                      className="text-sm bg-forest hover:bg-forest-dark text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={resetForm}
                      className="text-sm border border-stone-300 hover:bg-stone-50 text-ink font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Write Another
                    </button>
                  </div>
                </div>

                <div className="letter-paper p-6 sm:p-8" style={{ paddingTop: "2rem" }}>
                  <div className="relative z-10 whitespace-pre-line text-sm leading-relaxed text-ink font-serif" style={{ minHeight: "200px" }}>
                    {generatedLetter}
                  </div>
                </div>

                <p className="text-xs text-stone-400 text-center">
                  Review the letter before sending. This is a template generator, not legal advice.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 px-4 bg-stone-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl font-bold mb-2 text-ink">Simple Pricing</h2>
            <p className="text-ink-light text-sm mb-8">No tricks. No subscriptions.</p>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 max-w-sm mx-auto">
              <div className="text-4xl mb-2">💚</div>
              <h3 className="font-serif text-xl font-bold text-forest mb-1">Free to Use</h3>
              <p className="text-ink-light text-sm mb-6">
                Generate as many letters as you need, completely free. No account required.
              </p>
              <ul className="text-left text-sm space-y-2 mb-6">
                {[
                  "8 letter types",
                  "Instant generation",
                  "Mobile-friendly",
                  "Copy to clipboard",
                  "No signup required",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-ink-light">
                    <span className="text-forest font-bold">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="#tool"
                className="inline-block bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Try It Now
              </a>
            </div>
          </div>
        </section>

        {/* Letter Types Reference */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-8 text-ink">
              Letter Types We Cover
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LETTER_TYPES.map((type) => (
                <div key={type.id} className="flex gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50/50">
                  <span className="text-xl flex-shrink-0">{type.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm text-forest">{type.label}</h3>
                    <p className="text-xs text-ink-light mt-0.5">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
