import { describe, it, expect } from 'vitest';
import { generateAsciiTree } from '../../packages/cli/src/core/tree';
import type { TreeNode } from '../../packages/cli/src/core/scanner';

const SAMPLE_TREE: TreeNode = {
  name: 'my-project',
  type: 'directory',
  path: '/tmp/my-project',
  children: [
    { name: 'src', type: 'directory', path: '/tmp/my-project/src', children: [
      { name: 'index.ts', type: 'file', path: '/tmp/my-project/src/index.ts' },
    ]},
    { name: 'package.json', type: 'file', path: '/tmp/my-project/package.json' },
    { name: 'README.md',    type: 'file', path: '/tmp/my-project/README.md' },
  ],
};

describe('generateAsciiTree', () => {
  it('should include root directory name', () => {
    const output = generateAsciiTree(SAMPLE_TREE);
    expect(output).toContain('my-project');
  });

  it('should include nested files', () => {
    const output = generateAsciiTree(SAMPLE_TREE);
    expect(output).toContain('index.ts');
    expect(output).toContain('package.json');
  });

  it('should respect maxDepth', () => {
    const output = generateAsciiTree(SAMPLE_TREE, { maxDepth: 0 });
    expect(output).not.toContain('index.ts');
  });

  it('should show directories before files', () => {
    const output = generateAsciiTree(SAMPLE_TREE);
    const srcIdx     = output.indexOf('src');
    const pkgIdx     = output.indexOf('package.json');
    expect(srcIdx).toBeLessThan(pkgIdx);
  });
});