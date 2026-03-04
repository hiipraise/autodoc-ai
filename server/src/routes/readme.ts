import { Router } from 'express';
import path from 'path';
import fs from 'fs-extra';
import { sseManager } from '../sse';

export const readmeRouter = Router();

// In-memory store (persists while server is running)
const history: Array<{ id: string; content: string; generatedAt: string; fileCount: number }> = [];
let currentContent: string | null = null;
let generatedAt: string | null    = null;

readmeRouter.get('/', (_req, res) => {
  if (!currentContent) {
    return res.json({ success: false, error: 'No README generated yet. Run a scan first.' });
  }
  res.json({ success: true, data: { content: currentContent, generatedAt } });
});

readmeRouter.post('/regenerate', async (req, res) => {
  const { dir = '.' } = req.body as { dir: string };
  try {
    const readmePath = path.join(path.resolve(dir), 'README.md');
    if (await fs.pathExists(readmePath)) {
      const content  = await fs.readFile(readmePath, 'utf-8');
      generatedAt    = new Date().toISOString();
      currentContent = content;
      const id = Date.now().toString(36);
      history.unshift({ id, content, generatedAt, fileCount: 0 });
      if (history.length > 50) history.pop();
      sseManager.broadcast({ type: 'readme-updated', timestamp: new Date().toLocaleTimeString(), file: readmePath });
      res.json({ success: true, data: { content, generatedAt } });
    } else {
      // Generate a basic README if none exists
      const basicReadme = await generateBasicReadme(path.resolve(dir));
      generatedAt    = new Date().toISOString();
      currentContent = basicReadme;
      await fs.writeFile(readmePath, basicReadme, 'utf-8');
      history.unshift({ id: Date.now().toString(36), content: basicReadme, generatedAt, fileCount: 0 });
      sseManager.broadcast({ type: 'readme-updated', timestamp: new Date().toLocaleTimeString(), file: readmePath });
      res.json({ success: true, data: { content: basicReadme, generatedAt } });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

readmeRouter.get('/history', (_req, res) => {
  res.json({ success: true, data: history });
});

// Called by CLI watch mode to push new README content in real time
readmeRouter.post('/push', async (req, res) => {
  const { content, fileCount = 0 } = req.body as { content: string; fileCount?: number };
  if (!content) return res.status(400).json({ success: false, error: 'content required' });
  generatedAt    = new Date().toISOString();
  currentContent = content;
  history.unshift({ id: Date.now().toString(36), content, generatedAt, fileCount });
  if (history.length > 50) history.pop();
  sseManager.broadcast({ type: 'readme-updated', timestamp: new Date().toLocaleTimeString() });
  res.json({ success: true });
});

// ── Basic README fallback (no AI needed) ──────────────────────────────────────
async function generateBasicReadme(dir: string): Promise<string> {
  let name = path.basename(dir);
  let description = '';
  let installCmd = 'npm install';
  let startCmd = 'npm start';
  let license = 'MIT';

  const pkgPath = path.join(dir, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    try {
      const pkg = await fs.readJSON(pkgPath);
      name        = pkg.name ?? name;
      description = pkg.description ?? '';
      license     = pkg.license ?? 'MIT';
      const hasDev = (s: string) => !!pkg.devDependencies?.[s];
      const hasDep = (s: string) => !!pkg.dependencies?.[s];
      if (hasDev('vite') || hasDep('vite')) startCmd = 'npm run dev';
      if (await fs.pathExists(path.join(dir, 'yarn.lock'))) installCmd = 'yarn install';
      if (await fs.pathExists(path.join(dir, 'pnpm-lock.yaml'))) installCmd = 'pnpm install';
    } catch { /* ignore */ }
  }

  return [
    `# ${name}`,
    '',
    description ? `> ${description}` : '',
    '',
    '## Platform Overview',
    '',
    'This README was generated from discovered project files and package metadata.',
    'Use it as a baseline and refine section details for your specific workflows.',
    '',
    '## Project Structure Guidance',
    '',
    '- Keep source code in clearly named directories (for example `src/`, `packages/`, or `app/`).',
    '- Group infrastructure files (`Dockerfile`, CI configs, lint settings) near repository root.',
    '- Place end-user documentation under `docs/` so AutoDoc can include it in future runs.',
    '',
    '## Installation',
    '',
    '```bash',
    'git clone <your-repo-url>',
    `cd ${name}`,
    installCmd,
    '```',
    '',
    '## Usage',
    '',
    '```bash',
    startCmd,
    '```',
    '',
    '## License',
    '',
    `${license}`,
    '',
    '---',
    '',
    '> Generated with [AutoDoc.ai](https://github.com/autodoc-ai/autodoc)',
  ].filter(Boolean).join('\n');
}