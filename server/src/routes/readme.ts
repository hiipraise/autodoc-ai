import { Router } from 'express';
import path from 'path';
import ignore from 'ignore';
import { glob } from 'glob';
import fs from 'fs-extra';
import { sseManager } from '../sse';

export const readmeRouter = Router();

// In-memory store (persists while server is running)
const history: Array<{ id: string; content: string; generatedAt: string; fileCount: number }> = [];
let currentContent: string | null = null;
let generatedAt: string | null = null;

readmeRouter.get('/', (_req, res) => {
  if (!currentContent) {
    return res.json({ success: false, error: 'No README generated yet. Run a scan first.' });
  }
  res.json({ success: true, data: { content: currentContent, generatedAt } });
});

readmeRouter.post('/regenerate', async (req, res) => {
  const { dir = '.' } = req.body as { dir: string };
  const targetDir = path.resolve(dir);

  try {
    const snapshot = await scanProjectSnapshot(targetDir);
    const generated = await generateProfessionalReadme(targetDir, snapshot.paths, snapshot.tree);
    const readmePath = path.join(targetDir, 'README.md');

    await fs.writeFile(readmePath, generated, 'utf-8');

    generatedAt = new Date().toISOString();
    currentContent = generated;
    const id = Date.now().toString(36);
    history.unshift({ id, content: generated, generatedAt, fileCount: snapshot.fileCount });
    if (history.length > 50) history.pop();

    sseManager.broadcast({
      type: 'readme-updated',
      timestamp: new Date().toLocaleTimeString(),
      file: readmePath,
    });

    res.json({ success: true, data: { content: generated, generatedAt } });
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
  generatedAt = new Date().toISOString();
  currentContent = content;
  history.unshift({ id: Date.now().toString(36), content, generatedAt, fileCount });
  if (history.length > 50) history.pop();
  sseManager.broadcast({ type: 'readme-updated', timestamp: new Date().toLocaleTimeString() });
  res.json({ success: true });
});

interface TreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
}

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

async function scanProjectSnapshot(rootDir: string): Promise<{ paths: string[]; tree: TreeNode; fileCount: number }> {
  const filter = await buildIgnoreFilter(rootDir);
  const allPaths = await glob('**/*', {
    cwd: rootDir,
    nodir: false,
    dot: true,
    ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', 'coverage/**'],
  });

  const files: string[] = [];

  for (const relPath of allPaths) {
    if (!filter.accepts(relPath)) continue;
    const absPath = path.join(rootDir, relPath);
    try {
      const stat = await fs.stat(absPath);
      if (!stat.isDirectory()) files.push(relPath);
    } catch {
      // skip unreadable paths
    }
  }

  const root: TreeNode = { name: path.basename(rootDir), type: 'directory', children: [] };
  for (const relPath of files.sort()) {
    const parts = relPath.split(/[\\/]/);
    let current = root;
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      if (isLast) {
        current.children!.push({ name: part, type: 'file' });
      } else {
        let node = current.children!.find((c) => c.type === 'directory' && c.name === part);
        if (!node) {
          node = { name: part, type: 'directory', children: [] };
          current.children!.push(node);
        }
        current = node;
      }
    });
  }

  return { paths: files, tree: root, fileCount: files.length };
}

function renderTree(node: TreeNode, prefix = '', isLast = true, depth = 0, maxDepth = 5): string[] {
  if (depth > maxDepth) return [];

  const lines: string[] = [];
  if (depth === 0) {
    lines.push(`${node.name}/`);
  } else {
    lines.push(`${prefix}${isLast ? '└──' : '├──'} ${node.name}${node.type === 'directory' ? '/' : ''}`);
  }

  if (!node.children?.length || depth >= maxDepth) return lines;

  const sorted = [...node.children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  sorted.forEach((child, idx) => {
    const childIsLast = idx === sorted.length - 1;
    const childPrefix = depth === 0 ? '' : `${prefix}${isLast ? '    ' : '│   '}`;
    lines.push(...renderTree(child, childPrefix, childIsLast, depth + 1, maxDepth));
  });

  return lines;
}

function detectFeatures(paths: string[]): string[] {
  const lower = paths.map((p) => p.toLowerCase());
  const has = (rx: RegExp) => lower.some((p) => rx.test(p));

  const features: string[] = [];
  if (has(/src\/commands\//)) features.push('Provides a CLI for generating and updating README documentation workflows.');
  if (has(/src\/ai\//) || has(/groq|ollama/)) features.push('Supports AI provider routing for context-aware README section generation.');
  if (has(/watch/) || has(/sse/)) features.push('Enables watch mode and live update broadcasting for iterative documentation updates.');
  if (has(/server\/src\/routes\//) || has(/api/)) features.push('Exposes API endpoints for scan, config, watch, and README generation flows.');
  if (has(/packages\/frontend\/src\/components\//)) features.push('Includes a frontend dashboard with file-tree, preview, and diff interfaces.');
  if (has(/tests\//) || has(/\.test\./)) features.push('Contains automated tests covering scanner and README generation behavior.');

  return features.slice(0, 8);
}

function summarizeTopLevel(tree: TreeNode): string[] {
  const children = tree.children ?? [];
  const dirs = children.filter((c) => c.type === 'directory');
  const files = children.filter((c) => c.type === 'file');

  const lines = [
    `- Top-level layout: **${dirs.length} directories** and **${files.length} files** detected.`,
  ];

  dirs
    .sort((a, b) => (b.children?.length ?? 0) - (a.children?.length ?? 0))
    .slice(0, 6)
    .forEach((dir) => {
      lines.push(`- \`${dir.name}/\` contains ${dir.children?.length ?? 0} immediate items.`);
    });

  return lines;
}

async function generateProfessionalReadme(dir: string, paths: string[], tree: TreeNode): Promise<string> {
  let name = path.basename(dir);
  let description = 'Documentation generated from repository structure and detected project capabilities.';
  let license = 'MIT';
  const install = ['npm install'];
  const usage = ['npm run dev', 'npm run build'];

  const pkgPath = path.join(dir, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    try {
      const pkg = await fs.readJSON(pkgPath);
      name = pkg.name ?? name;
      description = pkg.description || description;
      license = pkg.license ?? license;

      const scripts = pkg.scripts ?? {};
      if (scripts.dev) usage[0] = 'npm run dev';
      if (scripts.build) usage[1] = 'npm run build';

      if (await fs.pathExists(path.join(dir, 'pnpm-lock.yaml'))) install[0] = 'pnpm install';
      else if (await fs.pathExists(path.join(dir, 'yarn.lock'))) install[0] = 'yarn install';
    } catch {
      // ignore invalid package json
    }
  }

  const features = detectFeatures(paths);
  const structure = renderTree(tree, '', true, 0, 6).join('\n');

  return [
    `# ${name}`,
    '',
    `> ${description}`,
    '',
    '## Table of Contents',
    '',
    '- [Features](#features)',
    '- [Architecture Overview](#architecture-overview)',
    '- [Project Structure](#project-structure)',
    '- [Installation](#installation)',
    '- [Usage](#usage)',
    '- [License](#license)',
    '',
    '## Features',
    '',
    ...(features.length ? features.map((f) => `- ${f}`) : ['- Core project capabilities could not be inferred automatically.']),
    '',
    '## Architecture Overview',
    '',
    ...summarizeTopLevel(tree),
    '',
    '## Project Structure',
    '',
    '```text',
    structure,
    '```',
    '',
    '## Installation',
    '',
    '```bash',
    ...install,
    '```',
    '',
    '## Usage',
    '',
    '```bash',
    ...usage,
    '```',
    '',
    '## License',
    '',
    license,
    '',
    '---',
    '',
    '> Generated with [AutoDoc.ai](https://github.com/autodoc-ai/autodoc)',
  ].join('\n');
}
