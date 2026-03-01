# Configuration

AutoDoc.ai is configured via `.autodoc.json` in your project root.

Run `npx autodoc init` to create one interactively, or copy the template below.

## Full Config Reference

```json
{
  "version": "1",
  "output": "./README.md",
  "ai": {
    "provider": "groq",
    "model": "llama3-70b-8192",
    "fallback": "ollama",
    "ollamaModel": "codellama:7b"
  },
  "scan": {
    "maxDepth": 8,
    "maxFileSizeKB": 100,
    "includeHidden": false,
    "extraIgnore": ["*.test.ts", "coverage/"]
  },
  "readme": {
    "sections": ["header","features","filetree","installation","usage","tech-stack","license"],
    "showBadges": true,
    "treeMaxDepth": 4,
    "license": "MIT"
  },
  "watch": {
    "debounceMs": 1500,
    "triggerOnAdd": true,
    "triggerOnDelete": true,
    "triggerOnChange": true
  }
}
```

## Options

### `ai.provider`
- `"groq"` — Uses Groq cloud API (requires `GROQ_API_KEY`). Fast, free tier.
- `"ollama"` — Uses local Ollama instance. No API key, runs offline.

### `scan.maxDepth`
How deep to recurse into subdirectories. Default: `8`.

### `readme.sections`
Order matters. Remove a section name to exclude it from the output.

### `watch.debounceMs`
Milliseconds to wait after the last file change before regenerating. Default: `1500`.