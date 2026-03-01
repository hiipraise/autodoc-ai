<div align="center">

```
     ___       __        ____
    /   | __  __/ /_____/ __ \____  _____   ____ _(_)
   / /| |/ / / / __/ __ / / / / __ \/ ___/  / __ `/ /
  / ___ / /_/ / /_/ /_/ /_/ / /_/ / /__   / /_/ / /
 /_/  |_\__,_/\__/\____/_____/\____/\___/   \__,_/_/
```

**Your codebase. Documented. Automatically.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://typescriptlang.org)
[![AI: Groq](https://img.shields.io/badge/AI-Groq%20Free%20Tier-purple.svg)](https://console.groq.com)

</div>

---

## ✨ Features

- **🌳 ASCII File Tree** — Recursively scans any directory and renders a beautiful tree
- **🙈 .gitignore Aware** — Automatically respects all `.gitignore` rules up the directory tree
- **🤖 AI-Powered Analysis** — Extracts features and descriptions using Groq (free) or local Ollama
- **📦 Package Manager Detection** — Auto-detects npm, yarn, pnpm, bun, pip, poetry, cargo, go
- **👁 Watch Mode** — Incrementally regenerates README as you save files via Chokidar
- **🖥 Web Dashboard** — React + Vite + TailwindCSS live preview with SSE real-time updates
- **🆓 100% Free AI** — Groq free tier (6k req/day) + Ollama local fallback

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/autodoc-ai.git
cd autodoc-ai
npm install

# Configure (takes 30 seconds)
cp .env.example .env
# → Add your FREE Groq key from https://console.groq.com

# Generate README for any project
npx autodoc generate /path/to/your/project

# Enable live watch mode
npx autodoc watch /path/to/your/project

# Launch the web dashboard
npm run dev   # → http://localhost:3000
```

## 📁 Project Structure

```
autodoc-ai/
├── packages/
│   ├── cli/          # Node.js CLI engine
│   └── frontend/     # React + Vite dashboard
├── server/           # Express API + SSE bridge
├── docs/             # Documentation
├── tests/            # Test suites
└── scripts/          # Build & release scripts
```

## 🛠 Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| CLI | Node.js + Commander.js + Chokidar | Free |
| Frontend | React + Vite + TailwindCSS + TypeScript | Free |
| AI Primary | Groq API (llama3-70b-8192) | Free 6k/day |
| AI Fallback | Ollama (local codellama:7b) | Free |
| Gitignore | `ignore` npm package | Free |
| Server | Express.js + SSE | Free |

## 📖 Documentation

- [Getting Started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [AI Providers](docs/ai-providers.md)
- [Watch Mode](docs/watch-mode.md)

## 📄 License

MIT © 2026 AutoDoc.ai

---

> 📖 *This README was generated with AutoDoc.ai itself.*