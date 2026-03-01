import path from 'path';
import fs from 'fs-extra';
import type { ScannedFile } from './scanner';

export interface ProjectProfile {
  packageManagers: PackageManager[];
  frameworks: string[];
  languages: string[];
  testFrameworks: string[];
  buildTools: string[];
  hasDockerfile: boolean;
  license: string | null;
  projectName: string | null;
  projectVersion: string | null;
  description: string | null;
}

export interface PackageManager {
  name: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'pip' | 'poetry' | 'cargo' | 'go' | 'maven' | 'gradle';
  installCommand: string;
  devInstallCommand?: string;
  runCommand: string;
  lockFile: string;
}

const PACKAGE_MANAGERS: Record<string, PackageManager> = {
  'package-lock.json': {
    name: 'npm', lockFile: 'package-lock.json',
    installCommand: 'npm install',
    devInstallCommand: 'npm install --save-dev',
    runCommand: 'npm run',
  },
  'yarn.lock': {
    name: 'yarn', lockFile: 'yarn.lock',
    installCommand: 'yarn install',
    runCommand: 'yarn',
  },
  'pnpm-lock.yaml': {
    name: 'pnpm', lockFile: 'pnpm-lock.yaml',
    installCommand: 'pnpm install',
    runCommand: 'pnpm',
  },
  'bun.lockb': {
    name: 'bun', lockFile: 'bun.lockb',
    installCommand: 'bun install',
    runCommand: 'bun run',
  },
  'requirements.txt': {
    name: 'pip', lockFile: 'requirements.txt',
    installCommand: 'pip install -r requirements.txt',
    runCommand: 'python',
  },
  'pyproject.toml': {
    name: 'poetry', lockFile: 'pyproject.toml',
    installCommand: 'poetry install',
    runCommand: 'poetry run',
  },
  'Cargo.toml': {
    name: 'cargo', lockFile: 'Cargo.toml',
    installCommand: 'cargo build',
    runCommand: 'cargo run',
  },
  'go.mod': {
    name: 'go', lockFile: 'go.mod',
    installCommand: 'go mod download',
    runCommand: 'go run .',
  },
};

const FRAMEWORK_SIGNATURES: Record<string, string[]> = {
  'React': ['react', 'react-dom'],
  'Next.js': ['next'],
  'Vue.js': ['vue'],
  'Nuxt': ['nuxt'],
  'Svelte': ['svelte', '@sveltejs/kit'],
  'Angular': ['@angular/core'],
  'Express': ['express'],
  'Fastify': ['fastify'],
  'NestJS': ['@nestjs/core'],
  'Vite': ['vite'],
  'Django': ['django'],
  'FastAPI': ['fastapi'],
  'Flask': ['flask'],
  'Tailwind CSS': ['tailwindcss'],
  'Prisma': ['prisma', '@prisma/client'],
  'tRPC': ['@trpc/server'],
  'GraphQL': ['graphql', 'apollo-server'],
  'Socket.io': ['socket.io'],
};

export async function detectProjectProfile(
  rootDir: string,
  files: ScannedFile[]
): Promise<ProjectProfile> {
  const fileNames = new Set(files.map(f => path.basename(f.relativePath)));
  const fileRelPaths = new Set(files.map(f => f.relativePath));

  // Detect package managers
  const packageManagers: PackageManager[] = [];
  for (const [lockFile, pm] of Object.entries(PACKAGE_MANAGERS)) {
    if (fileNames.has(lockFile)) packageManagers.push(pm);
  }

  // Parse package.json for frameworks
  const frameworks: string[] = [];
  const pkgJsonFile = files.find(f => f.relativePath === 'package.json');
  let projectName: string | null = null;
  let projectVersion: string | null = null;
  let description: string | null = null;

  if (pkgJsonFile?.content) {
    try {
      const pkg = JSON.parse(pkgJsonFile.content);
      projectName = pkg.name || null;
      projectVersion = pkg.version || null;
      description = pkg.description || null;

      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
      };

      for (const [framework, pkgs] of Object.entries(FRAMEWORK_SIGNATURES)) {
        if (pkgs.some((p: string) => p in allDeps)) {
          frameworks.push(framework);
        }
      }
    } catch { /* ignore */ }
  }

  // Detect languages from file extensions
  const extCounts = new Map<string, number>();
  for (const file of files) {
    const count = extCounts.get(file.ext) || 0;
    extCounts.set(file.ext, count + 1);
  }

  const EXT_TO_LANG: Record<string, string> = {
    '.ts': 'TypeScript', '.tsx': 'TypeScript',
    '.js': 'JavaScript', '.jsx': 'JavaScript',
    '.py': 'Python', '.go': 'Go',
    '.rs': 'Rust', '.java': 'Java',
    '.cs': 'C#', '.cpp': 'C++',
    '.rb': 'Ruby', '.php': 'PHP',
    '.swift': 'Swift', '.kt': 'Kotlin',
  };

  const languages = [...new Set(
    [...extCounts.entries()]
      .filter(([, count]) => count > 0)
      .map(([ext]) => EXT_TO_LANG[ext])
      .filter(Boolean)
  )];

  // Test frameworks
  const testFrameworks: string[] = [];
  if (fileRelPaths.has('jest.config.ts') || fileRelPaths.has('jest.config.js')) testFrameworks.push('Jest');
  if (fileRelPaths.has('vitest.config.ts')) testFrameworks.push('Vitest');
  if (fileRelPaths.has('cypress.config.ts')) testFrameworks.push('Cypress');
  if (fileRelPaths.has('playwright.config.ts')) testFrameworks.push('Playwright');

  // Build tools
  const buildTools: string[] = [];
  if (fileRelPaths.has('vite.config.ts') || fileRelPaths.has('vite.config.js')) buildTools.push('Vite');
  if (fileRelPaths.has('webpack.config.js')) buildTools.push('Webpack');
  if (fileRelPaths.has('turbo.json')) buildTools.push('Turborepo');
  if (fileRelPaths.has('Makefile')) buildTools.push('Make');
  if (fileRelPaths.has('Dockerfile')) buildTools.push('Docker');

  // License detection
  let license: string | null = null;
  const licenseFile = files.find(f => /^license/i.test(path.basename(f.relativePath)));
  if (licenseFile?.content) {
    if (licenseFile.content.includes('MIT License')) license = 'MIT';
    else if (licenseFile.content.includes('Apache License')) license = 'Apache-2.0';
    else if (licenseFile.content.includes('GNU GENERAL PUBLIC')) license = 'GPL-3.0';
    else license = 'Custom';
  }

  return {
    packageManagers,
    frameworks,
    languages,
    testFrameworks,
    buildTools,
    hasDockerfile: fileNames.has('Dockerfile'),
    license,
    projectName,
    projectVersion,
    description,
  };
}