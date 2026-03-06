# AutoDoc AI

AutoDoc AI is a toolkit for generating and updating project README files.

If you are here to **use the npm CLI package**, start with:
- `packages/cli/README.md` for full user docs.

This root README gives a quick product overview plus the fastest path for CLI users.

---

## CLI package (public npm)

Package: `autodoctools`  
Binary: `autodoc-ai`

Run without global install:

```bash
npx autodoctools --help
```

Common commands:

```bash
npx autodoctools init .
npx autodoctools generate .
npx autodoctools watch .
```

---

## AI provider setup

### Groq

```bash
export GROQ_API_KEY="gsk_your_key_here"
```

### Ollama

```bash
ollama pull codellama:7b
export OLLAMA_BASE_URL="http://localhost:11434"
```

---

## Where users configure AI behavior

Run this once in your repo:

```bash
npx autodoctools init .
```

It creates `.autodoc.json` where users choose provider/model/output.

Minimal example:

```json
{
  "version": "1",
  "output": "./README.md",
  "ai": {
    "provider": "groq",
    "model": "llama3-70b-8192",
    "fallback": "ollama",
    "ollamaModel": "codellama:7b"
  }
}
```

---

## Where AI gets analysis input

Users do not paste code into prompts.

The CLI reads files from the target project directory passed to `generate` or `watch`, applies ignore rules, then sends a compact snapshot to the configured AI provider.

```bash
npx autodoctools generate /path/to/project
```

---

## Workspace layout

- `packages/cli` — published npm CLI package (`autodoctools`)
- `packages/frontend` — web interface
- `server` — API backend for dashboard/watch integrations
- `docs` — additional usage/config references

---

## Development (repo)

```bash
npm install
npm run build
npm test
```

---

## License

MIT