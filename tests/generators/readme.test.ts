import { describe, it, expect } from 'vitest';
import { generateAsciiTree } from '../../packages/cli/src/core/tree';
import { generateFeaturesSection } from '../../packages/cli/src/generators/sections/features';
import { generateLicenseSection } from '../../packages/cli/src/generators/sections/license';
import type { ProjectProfile } from '../../packages/cli/src/core/detector';
import type { TreeNode } from '../../packages/cli/src/core/scanner';

const MOCK_PROFILE: ProjectProfile = {
  packageManagers: [],
  frameworks: ['React', 'Vite'],
  languages: ['TypeScript'],
  testFrameworks: [],
  buildTools: [],
  hasDockerfile: false,
  license: 'MIT',
  projectName: 'test-app',
  projectVersion: '1.0.0',
  description: 'A test application',
};

describe('README generators', () => {
  it('features section should list all features', () => {
    const features = ['Supports X', 'Provides Y', 'Enables Z'];
    const section = generateFeaturesSection(features);
    expect(section).toContain('Supports X');
    expect(section).toContain('Provides Y');
    expect(section).toContain('## ✨ Features');
  });

  it('features section should return empty string with no features', () => {
    const section = generateFeaturesSection([]);
    expect(section).toBe('');
  });

  it('license section should include license type', () => {
    const section = generateLicenseSection(MOCK_PROFILE);
    expect(section).toContain('MIT');
    expect(section).toContain('## 📄 License');
  });

  it('ascii tree should render properly', () => {
    const tree: TreeNode = {
      name: 'root',
      type: 'directory',
      path: '/',
      children: [
        { name: 'index.ts', type: 'file', path: '/index.ts' },
      ],
    };
    const ascii = generateAsciiTree(tree);
    expect(ascii).toContain('root');
    expect(ascii).toContain('index.ts');
  });
});