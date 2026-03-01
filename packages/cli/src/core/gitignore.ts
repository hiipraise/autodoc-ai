import ignore, { type Ignore } from 'ignore';
import path from 'path';
import fs from 'fs-extra';

export class GitignoreFilter {
  private ig: Ignore;

  private constructor(ig: Ignore) {
    this.ig = ig;
  }

  static async fromDirectory(dir: string): Promise<GitignoreFilter> {
    const ig = ignore();

    // Always ignore these
    ig.add(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '*.lock', '.DS_Store']);

    // Walk up directory tree looking for .gitignore files
    let current = dir;
    const gitignoreFiles: string[] = [];

    while (true) {
      const candidate = path.join(current, '.gitignore');
      if (await fs.pathExists(candidate)) {
        gitignoreFiles.push(candidate);
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }

    // Load all .gitignore files (closest first wins)
    for (const gitignorePath of gitignoreFiles.reverse()) {
      const content = await fs.readFile(gitignorePath, 'utf-8');
      ig.add(content);
    }

    return new GitignoreFilter(ig);
  }

  accepts(relativePath: string): boolean {
    if (!relativePath) return true;
    // Remove leading slash if present
    const normalized = relativePath.replace(/^\//, '');
    return !this.ig.ignores(normalized);
  }
}