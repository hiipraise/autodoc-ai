import path from 'path';
import type { ScannedFile, TreeNode } from '../core/scanner';
import type { AutoDocConfig } from '../utils/config';
import { detectProjectProfile } from '../core/detector';
import { generateAsciiTree } from '../core/tree';
import { generateInstallSection } from './sections/install';
import { generateFeaturesSection } from './sections/features';
import { generateLicenseSection } from './sections/license';
import { generateUsageSection } from './sections/usage';
import { generateBadges } from './badges';

interface ReadmeOptions {
  targetDir: string;
  files: ScannedFile[];
  tree: TreeNode;
  features: string[];
  config: AutoDocConfig;
}

const ICON_MAP: Record<string, string> = {
  'TypeScript': 'ts',
  'JavaScript': 'js',
  'Python': 'py',
  'Go': 'go',
  'Rust': 'rust',
  'React': 'react',
  'Next.js': 'nextjs',
  'Vite': 'vite',
  'Node.js': 'nodejs',
  'Express': 'express',
  'Docker': 'docker',
};

function generateArchitectureSection(tree: TreeNode): string {
  const children = tree.children ?? [];
  if (!children.length) {
    return ['## Architecture Overview', '', '- Project appears empty at scan time.'].join('\n');
  }

  const directories = children.filter((node) => node.type === 'directory');
  const files = children.filter((node) => node.type === 'file');

  const importantDirs = directories
    .sort((a, b) => (b.children?.length ?? 0) - (a.children?.length ?? 0))
    .slice(0, 6)
    .map((dir) => {
      const nested = dir.children?.length ?? 0;
      return `- \`${dir.name}/\` — major module area containing ${nested} top-level item${nested === 1 ? '' : 's'}.`;
    });

  const keyFiles = files
    .slice(0, 5)
    .map((file) => `- \`${file.name}\` — top-level config or orchestration file.`);

  return [
    '## Architecture Overview',
    '',
    `The codebase is split into **${directories.length} primary directories** and **${files.length} top-level files**, making it easier to locate runtime code, tooling, and docs quickly.`,
    '',
    '### Primary modules',
    ...(importantDirs.length ? importantDirs : ['- _No top-level module directories detected during scan._']),
    '',
    '### Key top-level files',
    ...(keyFiles.length ? keyFiles : ['- _No top-level files detected during scan._']),
  ].join('\n');
}

function generateTechStackSection(frameworks: string[], languages: string[]): string {
  const items = [...new Set([...frameworks, ...languages])];
  if (!items.length) {
    return ['## Tech Stack', '', '_No frameworks or languages detected_'].join('\n');
  }

  const withIcons = items.map((item) => {
    const slug = ICON_MAP[item];
    if (!slug) return `- ${item}`;
    return `- <img src="https://skillicons.dev/icons?i=${slug}" alt="${item}" height="16" /> ${item}`;
  });

  return ['## Tech Stack', '', ...withIcons].join('\n');
}

function generateContributingSection(): string {
  return [
    '## Contributing',
    '',
    'Contributions are welcome. Before opening a pull request:',
    '',
    '1. Create a focused branch for your change.',
    '2. Run local quality checks (lint/tests/build).',
    '3. Update docs when behavior or APIs change.',
  ].join('\n');
}

export async function generateReadme(opts: ReadmeOptions): Promise<string> {
  const { targetDir, files, tree, features, config } = opts;
  const profile = await detectProjectProfile(targetDir, files);
  const projectName = profile.projectName || path.basename(targetDir);

  const badges = generateBadges(profile);
  const asciiTree = generateAsciiTree(tree, {
    maxDepth: config.readme.treeMaxDepth || config.scan.maxDepth || 8,
    showIcons: config.readme.showFileIcons,
  });
  const installSection = generateInstallSection(profile);
  const usageSection = generateUsageSection(profile);
  const featuresSection = generateFeaturesSection(features);
  const licenseSection = generateLicenseSection(profile);
  const architectureSection = generateArchitectureSection(tree);
  const techStackSection = generateTechStackSection(profile.frameworks, profile.languages);

  const sections: string[] = [
    `# ${projectName}`,
    '',
    profile.description ? `> ${profile.description}` : '',
    '',
    badges,
    '',
    '---',
    '',
    '## Table of Contents',
    '',
    '- [Features](#features)',
    '- [Architecture Overview](#architecture-overview)',
    '- [Project Structure](#project-structure)',
    '- [Installation & Setup](#installation--setup)',
    '- [Usage](#-usage)',
    '- [Tech Stack](#tech-stack)',
    '- [Contributing](#contributing)',
    '- [License](#license)',
    '',
    '---',
    '',
    featuresSection,
    '',
    '---',
    '',
    architectureSection,
    '',
    '---',
    '',
    '## Project Structure',
    '',
    '```',
    asciiTree,
    '```',
    '',
    '---',
    '',
    installSection,
    '',
    '---',
    '',
    usageSection,
    '',
    '---',
    '',
    techStackSection,
    '',
    '---',
    '',
    generateContributingSection(),
    '',
    '---',
    '',
    licenseSection,
    '',
    '---',
    '',
    '> Generated with [AutoDoc.ai](https://github.com/autodoc-ai/autodoc) — professional documentation from your source tree.',
  ];

  return sections.filter(Boolean).join('\n');
}
