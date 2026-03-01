# Getting Started with AutoDoc.ai

## Prerequisites

- **Node.js** 20+ — [download](https://nodejs.org)
- **npm** 9+ (comes with Node.js)
- A **FREE Groq API key** — [get one in 30 seconds](https://console.groq.com)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/autodoc-ai.git
cd autodoc-ai

# Install all workspace dependencies
npm install

# Copy environment config
cp .env.example .env
```

Edit `.env` and paste your Groq key:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

## Your First README

```bash
# Generate README for any project
npx autodoc generate /path/to/your/project

# Or for the current directory
npx autodoc generate .
```

Within seconds, a `README.md` will be created (or updated) in your project root.

## Watch Mode

Keep your README up to date as you code:

```bash
npx autodoc watch /path/to/your/project
```

Any time you save a file, AutoDoc.ai will debounce and regenerate the README automatically.

## Web Dashboard

Launch the visual dashboard for live preview:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Next Steps

- [Configuration Guide](configuration.md) — customize AutoDoc's behavior
- [AI Providers](ai-providers.md) — switch between Groq and Ollama
- [Watch Mode Deep Dive](watch-mode.md) — advanced watch mode options