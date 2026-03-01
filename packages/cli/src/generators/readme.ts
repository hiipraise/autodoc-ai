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

export async function generateReadme(opts: ReadmeOptions): Promise<string> {
  const { targetDir, files, tree, features, config } = opts;
  const profile = await detectProjectProfile(targetDir, files);
  const projectName = profile.projectName || path.basename(targetDir);

  const badges = generateBadges(profile);
  const asciiTree = generateAsciiTree(tree, { maxDepth: 4, showIcons: false });
  const installSection = generateInstallSection(profile);
  const featuresSection = generateFeaturesSection(features);
  const licenseSection = generateLicenseSection(profile);

  const sections: string[] = [
    // Header
    `# ${projectName}`,
    '',
    profile.description ? `> ${profile.description}` : '',
    '',
    badges,
    '',
    '---',
    '',

    // Features
    featuresSection,
    '',
    '---',
    '',

    // File Tree
    '## 📁 Project Structure',
    '',
    '```',
    asciiTree,
    '```',
    '',
    '---',
    '',

    // Installation
    installSection,
    '',
    '---',
    '',

    // Tech Stack
    '## 🛠 Tech Stack',
    '',
    profile.frameworks.length > 0
      ? profile.frameworks.map(f => `- **${f}**`).join('\n')
      : '_No frameworks detected_',
    '',
    '---',
    '',

    // License
    licenseSection,
    '',

    // Footer
    '---',
    '',
    `> 📖 Generated with [AutoDoc.ai](https://github.com/autodoc-ai/autodoc) — *Your codebase. Documented. Automatically.*`,
  ];

  return sections.filter(s => s !== null).join('\n');
}