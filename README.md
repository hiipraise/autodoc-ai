# AutoDocTools CLI

AutoDocTools is a command-line tool that scans your project and generates a README for you.

This guide is focused on **how to use the CLI with AI** after installing with `npx autodoctools`.

---

## 1) Run the CLI (no install required)

From inside your project folder:

```bash
npx autodoctools --help
```

You can also run specific commands directly:

```bash
npx autodoctools init .
npx autodoctools generate .
npx autodoctools watch .
```

---

## 2) Choose your AI provider

AutoDocTools supports:

- **Groq** (cloud API key required)
- **Ollama** (local model, no cloud key)

### Option A: Groq (recommended for most users)

1. Create a free Groq key at: <https://console.groq.com>
2. Set the key in your shell before running the CLI:

```bash
export GROQ_API_KEY="gsk_your_key_here"
```

Then run generation:

```bash
npx autodoctools generate .
```

### Option B: Ollama (local AI)

1. Install and run Ollama locally.
2. Pull a model (example):

```bash
ollama pull codellama:7b
```

3. (Optional) Set a custom Ollama URL:

```bash
export OLLAMA_BASE_URL="http://localhost:11434"
```

Then run generation with config set to Ollama (see next section).

---

## 3) Create your project config (`.autodoc.json`)

Run:

```bash
npx autodoctools init .
```

This creates a `.autodoc.json` file in your project root.

That file is where you define AI behavior like:

- provider (`groq` or `ollama`)
- model name
- fallback provider
- README output path

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

## 4) Where does AI analysis input come from?

You do **not** paste code into the AI manually.

AutoDocTools automatically:

1. Scans your project directory.
2. Respects ignore rules (like `.gitignore`).
3. Selects relevant files.
4. Sends compact code excerpts to the selected AI provider.
5. Uses returned insights to generate README sections.

So the required “input for analysis” is simply your project files in the folder you run against:

```bash
npx autodoctools generate /path/to/your/project
```

---

## 5) Typical user workflow

```bash
# inside your repository
npx autodoctools init .

# set provider key once per terminal session (Groq)
export GROQ_API_KEY="gsk_your_key_here"

# generate README now
npx autodoctools generate .

# keep README auto-updated while you code
npx autodoctools watch .
```

---

## 6) Useful command options

Generate once:

```bash
npx autodoctools generate . --output ./README.md
```

Generate without AI (heuristics only):

```bash
npx autodoctools generate . --no-ai
```

Preview without writing file:

```bash
npx autodoctools generate . --dry-run
```

Watch mode with custom debounce:

```bash
npx autodoctools watch . --debounce 2000
```

---

## 7) If AI is not configured

- If `GROQ_API_KEY` is missing, Groq cannot run.
- If Ollama is unavailable, local fallback cannot run.
- In these cases, use:

```bash
npx autodoctools generate . --no-ai
```

You will still get a generated README from non-AI project analysis.

---

## 8) Quick FAQ

**Where do I put my Groq key?**  
Set it as an environment variable in your terminal:

```bash
export GROQ_API_KEY="gsk_..."
```

**Do I put my key inside `.autodoc.json`?**  
No. Keep secrets in environment variables, not project config files.

**Where do I put files for AI analysis?**  
In your project folder. AutoDocTools reads files from the directory you pass to `generate` or `watch`.

**Can I run without cloud AI?**  
Yes. Use Ollama locally or run with `--no-ai`.
