import { Router } from 'express';

export const configRouter = Router();

// In-memory config; in production load from .autodoc.json
let config = {
  output: './README.md',
  ai: { provider: 'groq', model: 'llama3-70b-8192' },
  scan: { maxDepth: 8, maxFileSizeKB: 100 },
  watch: { debounceMs: 1500 },
};

configRouter.get('/', (_req, res) => {
  res.json({ success: true, data: config });
});

configRouter.put('/', (req, res) => {
  const updates = req.body;
  config = deepMerge(config, updates);
  res.json({ success: true, data: config });
});

function deepMerge(target: any, source: any): any {
  const out = { ...target };
  for (const key of Object.keys(source ?? {})) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] ?? {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}