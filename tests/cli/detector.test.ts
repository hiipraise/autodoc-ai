import { describe, it, expect } from 'vitest';
import { detectProjectProfile } from '../../packages/cli/src/core/detector';
import type { ScannedFile } from '../../packages/cli/src/core/scanner';

const makeFile = (relativePath: string, content?: string): ScannedFile => ({
  absolutePath: `/tmp/${relativePath}`,
  relativePath,
  ext: relativePath.includes('.') ? `.${relativePath.split('.').pop()}` : '',
  size: content?.length ?? 0,
  content,
});

describe('detectProjectProfile', () => {
  it('should detect npm from package-lock.json', async () => {
    const files = [makeFile('package-lock.json'), makeFile('package.json', '{"name":"test","version":"1.0.0"}')];
    const profile = await detectProjectProfile('/tmp', files);
    expect(profile.packageManagers.map(p => p.name)).toContain('npm');
  });

  it('should detect React from package.json dependencies', async () => {
    const pkg = JSON.stringify({ dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' } });
    const files = [makeFile('package.json', pkg)];
    const profile = await detectProjectProfile('/tmp', files);
    expect(profile.frameworks).toContain('React');
  });

  it('should detect TypeScript from .ts files', async () => {
    const files = [makeFile('src/index.ts', 'const x = 1;'), makeFile('src/app.ts')];
    const profile = await detectProjectProfile('/tmp', files);
    expect(profile.languages).toContain('TypeScript');
  });

  it('should detect MIT license', async () => {
    const files = [makeFile('LICENSE', 'MIT License\nCopyright (c) 2025')];
    const profile = await detectProjectProfile('/tmp', files);
    expect(profile.license).toBe('MIT');
  });
});