import path from 'path';
import { glob } from 'glob';
import fs from 'fs-extra';
import type { GitignoreFilter } from './gitignore.js';

export interface ScannedFile {
  absolutePath: string;
  relativePath: string;
  ext: string;
  size: number;
  content?: string;
}

export interface ScanResult {
  files: ScannedFile[];
  tree: TreeNode;
}

export interface TreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
  path: string;
}

// Extensions whose content we load for AI analysis
const ANALYZE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.go', '.rs', '.java', '.cs', '.rb', '.php', '.swift', '.kt',
  '.vue', '.svelte', '.astro',
  '.md', '.mdx', '.json', '.toml', '.yaml', '.yml',
  '.sh', '.bash', '.zsh', '.env.example',
]);

const DEFAULT_IGNORE = [
  'node_modules/**', '.git/**', 'dist/**', 'build/**',
  '.next/**', 'coverage/**', '*.lock', '.DS_Store',
  '*.min.js', '*.min.css', '*.map',
];

export class Scanner {
  constructor(
    private readonly rootDir: string,
    private readonly filter: GitignoreFilter,
  ) {}

  async scan(): Promise<ScanResult> {
    const allPaths = await glob('**/*', {
      cwd: this.rootDir,
      nodir: false,
      dot: false,
      ignore: DEFAULT_IGNORE,
    });

    const files: ScannedFile[] = [];

    for (const relPath of allPaths) {
      if (!this.filter.accepts(relPath)) continue;

      const absPath = path.join(this.rootDir, relPath);
      try {
        const stat = await fs.stat(absPath);
        if (stat.isDirectory()) continue;

        const ext = path.extname(relPath).toLowerCase();
        const scanned: ScannedFile = {
          absolutePath: absPath,
          relativePath: relPath,
          ext,
          size: stat.size,
        };

        if (ANALYZE_EXTENSIONS.has(ext) && stat.size < 100_000) {
          scanned.content = await fs.readFile(absPath, 'utf-8').catch(() => undefined);
        }

        files.push(scanned);
      } catch {
        // Silently skip unreadable files
      }
    }

    const tree = this.buildTree(files.map((f) => f.relativePath));
    return { files, tree };
  }

  private buildTree(filePaths: string[]): TreeNode {
    const root: TreeNode = {
      name: path.basename(this.rootDir),
      type: 'directory',
      children: [],
      path: this.rootDir,
    };

    for (const filePath of filePaths.sort()) {
      const parts = filePath.split('/');
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;

        if (isLast) {
          current.children!.push({
            name: part,
            type: 'file',
            path: path.join(this.rootDir, filePath),
          });
        } else {
          let dir = current.children!.find((c) => c.name === part && c.type === 'directory');
          if (!dir) {
            dir = {
              name: part,
              type: 'directory',
              children: [],
              path: path.join(this.rootDir, ...parts.slice(0, i + 1)),
            };
            current.children!.push(dir);
          }
          current = dir;
        }
      }
    }

    return root;
  }
}