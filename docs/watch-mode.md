# Watch Mode

Watch mode monitors your project directory and automatically regenerates README.md whenever files change.

## Basic Usage

```bash
npx autodoc watch /path/to/project
```

## Options

```bash
npx autodoc watch . --debounce 2000    # Wait 2s after last change
npx autodoc watch . -o ./docs/README.md  # Custom output path
```

## How It Works

1. AutoDoc starts a Chokidar watcher on your project directory
2. `.gitignore` rules are respected — ignored files don't trigger regeneration
3. Changes are **debounced** (default 1.5s) to avoid thrashing on rapid saves
4. On trigger: scan → AI analysis → README assembly → write to disk
5. If the Express server is running, a Server-Sent Event is broadcast to all connected dashboard clients

## Excluded from Watching

- `node_modules/`
- `.git/`
- `dist/`, `build/`
- The output `README.md` itself (prevents infinite loops)
- Any path matching `.gitignore` rules

## Live Dashboard Integration

Start both the watcher and the dashboard together:

```bash
# Terminal 1
npx autodoc watch .

# Terminal 2
npm run dev:server  # Start Express server on port 4000
npm run dev:frontend  # Start React dashboard on port 3000
```

The dashboard will show live events in the Watch Status panel as files change.