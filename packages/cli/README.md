# autodoctools
> AI-powered README generator CLI
[![License: Custom](https://img.shields.io/badge/License-Custom-orange.svg)](LICENSE) ![Version](https://img.shields.io/badge/version-1.0.2-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg) ![Vite](https://img.shields.io/badge/Vite-informational.svg)
---
## Features

- Supports real-time file watching
- Offers flexible configuration options
---
## Architecture Overview

This repository is organized around clear top-level modules so new contributors can identify where runtime code, configuration, and docs live.

- `README.md`: top-level project file used for configuration, docs, or entrypoint logic.
- `package.json`: top-level project file used for configuration, docs, or entrypoint logic.
- `src\ai\groq.ts`: top-level project file used for configuration, docs, or entrypoint logic.
- `src\ai\ollama.ts`: top-level project file used for configuration, docs, or entrypoint logic.
- `src\ai\prompts.ts`: top-level project file used for configuration, docs, or entrypoint logic.
- `src\ai\router.ts`: top-level project file used for configuration, docs, or entrypoint logic.
- `src\commands\generate.ts`: top-level project file used for configuration, docs, or entrypoint logic.
- `src\commands\init.ts`: top-level project file used for configuration, docs, or entrypoint logic.
---
## Project Structure
```
cli/
├── package.json
├── README.md
├── src\ai\groq.ts
├── src\ai\ollama.ts
├── src\ai\prompts.ts
├── src\ai\router.ts
├── src\commands\generate.ts
├── src\commands\init.ts
├── src\commands\watch.ts
├── src\core\analyzer.ts
├── src\core\detector.ts
├── src\core\gitignore.ts
├── src\core\scanner.ts
├── src\core\tree.ts
├── src\core\watcher.ts
├── src\generators\badges.ts
├── src\generators\readme.ts
├── src\generators\sections\features.ts
├── src\generators\sections\filetree.ts
├── src\generators\sections\header.ts
├── src\generators\sections\install.ts
├── src\generators\sections\license.ts
├── src\generators\sections\usage.ts
├── src\index.ts
├── src\utils\config.ts
├── src\utils\hash.ts
├── src\utils\logger.ts
├── src\utils\spinner.ts
└── tsconfig.json
```
---
## Installation

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/your-repo.git
cd your-repo


# Copy and configure environment
cp .env.example .env
# → Edit .env with your values
```

---
## Tech Stack

- <img src="https://skillicons.dev/icons?i=vite" alt="Vite" height="16" /> Vite
- <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" height="16" /> TypeScript
---
## License

This project is licensed under the Custom License.

Copyright © 2026
---
> Generated with [AutoDoc.ai](https://github.com/autodoc-ai/autodoc) — professional documentation from your source tree.