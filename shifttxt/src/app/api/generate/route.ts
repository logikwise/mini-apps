import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { situation, name, details, model } = await req.json()

    if (!situation || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.MINIMAX_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 500 })
    }

    const prompt = `You are writing a text message from an hourly worker to their manager or workplace. 
Write a professional, warm, and concise text message based on the following situation.

Context:
- Situation: ${situation}
- Worker's name: ${name}
- Additional details: ${details || 'None provided'}

Rules:
- Keep it short (2-4 sentences max)
- Sound like a real person — not robotic, not corporate
- Be honest and direct
- Include a basic apology or acknowledgment where appropriate
- Do NOT use placeholder brackets like [Manager Name] — just write "Hey" or "Hi"
- Do NOT add emoji
- Return ONLY the message text, nothing else`

    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'minimax/MiniMax-M2.7',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Minimax API error:', response.status, errText)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const message = data.choices?.[0]?.message?.content?.trim() || 'Sorry, something went wrong. Please try again.'

    return NextResponse.json({ message })
  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
