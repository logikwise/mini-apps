# ThanksMaker

Elegant thank-you notes for every occasion — powered by AI.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Minimax AI** for note generation

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment template and add your API key
cp .env.local.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
NEXT_PUBLIC_MINIMAX_API_KEY=your_api_key_here
```

If no API key is provided, the app runs in demo mode with sample output.
