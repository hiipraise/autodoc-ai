import { Router } from 'express';
import path from 'path';
import ignore from 'ignore';
import { glob } from 'glob';
import fs from 'fs-extra';
import { sseManager } from '../sse';

export const scanRouter = Router();

// ── Inline Scanner (no dependency on CLI build output) ────────────────────────

async function buildIgnoreFilter(dir: string) {
  const ig = ignore();
  ig.add(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '*.lock', '.DS_Store']);

  let current = dir;
  while (true) {
    const candidate = path.join(current, '.gitignore');
    if (await fs.pathExists(candidate)) {
      ig.add(await fs.readFile(candidate, 'utf-8'));
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return { accepts: (p: string) => !ig.ignores(p.replace(/^\//, '')) };
}

interface TreeNode { name: string; type: 'file' | 'directory'; children?: TreeNode[] }

function extractFeatures(paths: string[]): string[] {
  const lowerPaths = paths.map((p) => p.toLowerCase());
  const has = (pattern: RegExp) => lowerPaths.some((p) => pattern.test(p));

  const features: string[] = [];

  if (has(/src\/commands\//) || has(/bin\//) || has(/cli/)) {
    features.push('Provides a command-line workflow for generating and maintaining project documentation.');
  }
  if (has(/src\/ai\//) || has(/ollama|groq/)) {
    features.push('Supports AI-assisted content generation through pluggable provider integrations.');
  }
  if (has(/watch/) || has(/sse/)) {
    features.push('Includes real-time watch/update flows to keep documentation synchronized with source changes.');
  }
  if (has(/routes\//) || has(/api\//) || has(/server\/src/)) {
    features.push('Exposes HTTP endpoints for scanning repositories and serving generated README content.');
  }
  if (has(/frontend/) || has(/components\//) || has(/pages\//)) {
    features.push('Ships a web dashboard for project scanning, previews, and documentation lifecycle management.');
  }
  if (has(/tests\//) || has(/\.test\./)) {
    features.push('Contains automated tests to validate scanner and README generation behavior.');
  }

  return features.slice(0, 8);
}

async function scanDirectory(rootDir: string) {
  const filter = await buildIgnoreFilter(rootDir);
  const allPaths = await glob('**/*', {
    cwd: rootDir,
    nodir: false,
    dot: true,
    ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', 'coverage/**'],
  });

  const files: Array<{ relativePath: string; ext: string; size: number }> = [];

  for (const relPath of allPaths) {
    if (!filter.accepts(relPath)) continue;
    try {
      const stat = await fs.stat(path.join(rootDir, relPath));
      if (!stat.isDirectory()) {
        files.push({ relativePath: relPath, ext: path.extname(relPath).toLowerCase(), size: stat.size });
      }
    } catch {
      /* skip */
    }
  }

  // Build tree
  const root: TreeNode = { name: path.basename(rootDir), type: 'directory', children: [] };
  for (const { relativePath } of files.sort((a, b) => a.relativePath.localeCompare(b.relativePath))) {
    const parts = relativePath.split(/[\\/]/);
    let cur = root;
    parts.forEach((part, i) => {
      const last = i === parts.length - 1;
      if (last) {
        cur.children!.push({ name: part, type: 'file' });
      } else {
        let d = cur.children!.find((c) => c.name === part && c.type === 'directory');
        if (!d) {
          d = { name: part, type: 'directory', children: [] };
          cur.children!.push(d);
        }
        cur = d;
      }
    });
  }

  const features = extractFeatures(files.map((f) => f.relativePath));
  return { files, tree: root, features, fileCount: files.length };
}

// ── Routes ────────────────────────────────────────────────────────────────────

let latestScan: any = null;

scanRouter.post('/', async (req, res) => {
  const { dir = '.' } = req.body as { dir: string };
  const targetDir = path.resolve(dir);

  try {
    if (!await fs.pathExists(targetDir)) {
      return res.status(400).json({ success: false, error: `Directory not found: ${targetDir}` });
    }

    sseManager.broadcast({ type: 'scan-started', timestamp: new Date().toLocaleTimeString() });

    const result = await scanDirectory(targetDir);
    latestScan = { ...result, scannedAt: new Date().toISOString() };

    sseManager.broadcast({
      type: 'file-changed',
      timestamp: new Date().toLocaleTimeString(),
      message: `Scanned ${result.fileCount} files`,
    });

    res.json({ success: true, data: latestScan });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

scanRouter.get('/latest', (_req, res) => {
  if (!latestScan) return res.json({ success: false, error: 'No scan yet' });
  res.json({ success: true, data: latestScan });
});
