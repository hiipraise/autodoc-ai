# AutoDocTools CLI (`autodoctools`)

AutoDocTools helps you generate and maintain a `README.md` from your project files using AI-assisted analysis.

This README is for **npm users of the CLI package**.

---

## Install / run

Use it directly with `npx`:

```bash
npx autodoctools --help
```

After install, the executable name is:

```bash
autodoc-ai
```

So these are equivalent patterns:

```bash
npx autodoctools generate .
autodoc-ai generate .
```

---

## Commands you will use

Initialize config in your project:

```bash
autodoc-ai init .
```

Generate README once:

```bash
autodoc-ai generate .
```

Keep README updated while you code:

```bash
autodoc-ai watch .
```

---

## AI setup

AutoDocTools supports:

- **Groq** (cloud API)
- **Ollama** (local runtime)

### Option A: Groq

1. Create an API key at <https://console.groq.com>.
2. Export it in your shell:

```bash
export GROQ_API_KEY="gsk_your_key_here"
```

3. Run generation:

```bash
autodoc-ai generate .
```

### Option B: Ollama

1. Start Ollama locally.
2. Pull a model:

```bash
ollama pull codellama:7b
```

3. (Optional) set host if not default:

```bash
export OLLAMA_BASE_URL="http://localhost:11434"
```

4. Set provider to `ollama` in `.autodoc.json` (example below), then generate.

---

## Where to put AI requirements

### API keys / endpoints

- Put secrets in environment variables:
  - `GROQ_API_KEY`
  - `OLLAMA_BASE_URL` (optional)
- Do **not** commit keys into `.autodoc.json`.

### AI behavior config

Run:

```bash
autodoc-ai init .
```

This creates `.autodoc.json` in your project root.

Example AI config:

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

## How AI analysis works

You do not paste your code manually.

When you run `generate` or `watch`, AutoDocTools:

1. scans the target directory,
2. applies ignore rules,
3. builds a compact project snapshot,
4. sends that snapshot to the configured provider,
5. uses returned insights to build README sections.

So the "input" for AI is simply your project files in the directory you pass:

```bash
autodoc-ai generate /path/to/project
```

---

## Useful options

Generate to custom output:

```bash
autodoc-ai generate . --output ./README.md
```

Disable AI:

```bash
autodoc-ai generate . --no-ai
```

Preview without writing:

```bash
autodoc-ai generate . --dry-run
```

Set watch debounce:

```bash
autodoc-ai watch . --debounce 2000
```

---

## Quick start (copy/paste)

```bash
# from your repository root
npx autodoctools init .
export GROQ_API_KEY="gsk_your_key_here"
npx autodoctools generate .
npx autodoctools watch .
```

---

## License

MIT