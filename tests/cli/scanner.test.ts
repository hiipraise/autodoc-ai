import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import { Scanner } from '../../packages/cli/src/core/scanner';
import { GitignoreFilter } from '../../packages/cli/src/core/gitignore';

const FIXTURE_DIR = path.join(__dirname, '../fixtures/sample-project');

describe('Scanner', () => {
  let filter: GitignoreFilter;

  beforeAll(async () => {
    filter = await GitignoreFilter.fromDirectory(FIXTURE_DIR);
  });

  it('should scan files recursively', async () => {
    const scanner = new Scanner(FIXTURE_DIR, filter);
    const { files } = await scanner.scan();
    expect(files.length).toBeGreaterThan(0);
  });

  it('should not include node_modules', async () => {
    const scanner = new Scanner(FIXTURE_DIR, filter);
    const { files } = await scanner.scan();
    const hasNodeModules = files.some(f => f.relativePath.includes('node_modules'));
    expect(hasNodeModules).toBe(false);
  });

  it('should return a tree with root node', async () => {
    const scanner = new Scanner(FIXTURE_DIR, filter);
    const { tree } = await scanner.scan();
    expect(tree.type).toBe('directory');
    expect(tree.children).toBeDefined();
  });

  it('should load content for TypeScript files', async () => {
    const scanner = new Scanner(FIXTURE_DIR, filter);
    const { files } = await scanner.scan();
    const tsFiles = files.filter(f => f.ext === '.ts');
    if (tsFiles.length > 0) {
      expect(tsFiles[0].content).toBeDefined();
    }
  });
});