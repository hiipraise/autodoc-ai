# AI Providers

AutoDoc.ai supports two AI providers, both free.

## Groq (Recommended)

**Free tier:** 6,000 requests/day with `llama3-70b-8192`.

1. Create an account at [console.groq.com](https://console.groq.com)
2. Generate an API key
3. Add to `.env`: `GROQ_API_KEY=gsk_...`

```json
{
  "ai": { "provider": "groq", "model": "llama3-70b-8192" }
}
```

Available models: `llama3-70b-8192`, `llama3-8b-8192`, `mixtral-8x7b-32768`

## Ollama (Local, Offline)

Runs entirely on your machine. No API key, no rate limits, completely private.

1. Install Ollama: [ollama.ai](https://ollama.ai)
2. Pull a model: `ollama pull codellama:7b`
3. Configure:

```json
{
  "ai": { "provider": "ollama", "ollamaModel": "codellama:7b" }
}
```

Recommended models: `codellama:7b` (fast), `codellama:13b` (better quality), `deepseek-coder:6.7b`

## Fallback Chain

If the primary provider fails, AutoDoc.ai falls back gracefully:
```
Groq → Ollama → Heuristic (no AI, uses file structure patterns)
```