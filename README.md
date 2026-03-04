<div align="center">

```
     ___       __        ____
    /   | __  __/ /_____/ __ \____  _____   ____ _(_)
   / /| |/ / / / __/ __ / / / / __ \/ ___/  / __ `/ /
  / ___ / /_/ / /_/ /_/ /_/ / /_/ / /__   / /_/ / /
 /_/  |_|\__,_/\__/\____/_____/\____/\___/   \__,_/_/
```

**Your codebase. Documented. Automatically.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://typescriptlang.org)
[![AI: Groq](https://img.shields.io/badge/AI-Groq%20Free%20Tier-purple.svg)](https://console.groq.com)

</div>

---

## Overview

AutoDoc.ai scans a repository, understands its structure, and generates a production-ready README template that teams can ship with confidence. The platform combines deterministic file analysis with AI-assisted feature extraction to create docs that are accurate, maintainable, and readable.

## Core Capabilities

- Automated README generation from real project files
- Intelligent file tree modeling with `.gitignore` awareness
- Framework and package manager detection for setup instructions
- Watch mode for continuous documentation updates during development
- Web dashboard with live preview and regeneration controls
- Local-first or hosted AI provider support (Groq + Ollama)

## Quick Start

```bash
git clone https://github.com/your-org/autodoc-ai.git
cd autodoc-ai
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- API server: `http://localhost:4000`

## Platform Architecture

```
autodoc-ai/
├── packages/
│   ├── cli/          # CLI scanner, detectors, and README generators
│   └── frontend/     # React dashboard for configuration and preview
├── server/           # Express API routes for scan, config, and README state
├── docs/             # User-facing guides and platform documentation
├── tests/            # Generator and scanner test suites
└── scripts/          # Build, release, and development scripts
```

## How README Generation Works

1. **Scan** — Collects source files while respecting ignore rules.
2. **Analyze** — Detects language, framework, and runtime signals.
3. **Synthesize** — Produces sections for features, architecture, structure, setup, and license.
4. **Refine** — Supports iterative regeneration through watch mode and dashboard actions.

Generated README output now includes an architecture overview that explains the top-level file tree, helping users understand how the project is organized before they dive into code.

## Documentation

- [Getting Started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [AI Providers](docs/ai-providers.md)
- [Watch Mode](docs/watch-mode.md)

## License

MIT © 2026 AutoDoc.ai
