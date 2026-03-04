import path from 'path';
import type { ScannedFile, TreeNode } from '../core/scanner';
import type { AutoDocConfig } from '../utils/config';
import { detectProjectProfile } from '../core/detector';
import { generateAsciiTree } from '../core/tree';
import { generateInstallSection } from './sections/install';
import { generateFeaturesSection } from './sections/features';
import { generateLicenseSection } from './sections/license';
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

  const important = children.slice(0, 8).map((node) => {
    if (node.type === 'directory') {
      const childCount = node.children?.length ?? 0;
      return `- \`${node.name}/\`: primary module directory with ${childCount} immediate item${childCount === 1 ? '' : 's'}.`;
    }
    return `- \`${node.name}\`: top-level project file used for configuration, docs, or entrypoint logic.`;
  });

  return [
    '## Architecture Overview',
    '',
    'This repository is organized around clear top-level modules so new contributors can identify where runtime code, configuration, and docs live.',
    '',
    ...important,
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

export async function generateReadme(opts: ReadmeOptions): Promise<string> {
  const { targetDir, files, tree, features } = opts;
  const profile = await detectProjectProfile(targetDir, files);
  const projectName = profile.projectName || path.basename(targetDir);

  const badges = generateBadges(profile);
  const asciiTree = generateAsciiTree(tree, { maxDepth: 4, showIcons: false });
  const installSection = generateInstallSection(profile);
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
    techStackSection,
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
