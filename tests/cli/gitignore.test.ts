import { describe, it, expect } from 'vitest';
import path from 'path';
import { GitignoreFilter } from '../../packages/cli/src/core/gitignore';

const FIXTURE_DIR = path.join(__dirname, '../fixtures/sample-project');

describe('GitignoreFilter', () => {
  it('should always reject node_modules', async () => {
    const filter = await GitignoreFilter.fromDirectory(FIXTURE_DIR);
    expect(filter.accepts('node_modules/react/index.js')).toBe(false);
  });

  it('should always reject .git paths', async () => {
    const filter = await GitignoreFilter.fromDirectory(FIXTURE_DIR);
    expect(filter.accepts('.git/HEAD')).toBe(false);
  });

  it('should accept regular source files', async () => {
    const filter = await GitignoreFilter.fromDirectory(FIXTURE_DIR);
    expect(filter.accepts('src/index.ts')).toBe(true);
    expect(filter.accepts('README.md')).toBe(true);
  });

  it('should handle empty path gracefully', async () => {
    const filter = await GitignoreFilter.fromDirectory(FIXTURE_DIR);
    expect(filter.accepts('')).toBe(true);
  });
});