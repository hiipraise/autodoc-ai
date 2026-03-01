import type { ProjectProfile } from '../core/detector';

const LANG_COLORS: Record<string, string> = {
  TypeScript: 'blue',
  JavaScript: 'yellow',
  Python: '3776AB',
  Go: '00ADD8',
  Rust: 'orange',
  Java: 'red',
};

export function generateBadges(profile: ProjectProfile): string {
  const badges: string[] = [];

  // License badge
  if (profile.license) {
    badges.push(
      `[![License: ${profile.license}](https://img.shields.io/badge/License-${encodeURIComponent(profile.license)}-orange.svg)](LICENSE)`
    );
  }

  // Version badge
  if (profile.projectVersion) {
    badges.push(
      `![Version](https://img.shields.io/badge/version-${encodeURIComponent(profile.projectVersion)}-blue.svg)`
    );
  }

  // Language badges
  for (const lang of profile.languages.slice(0, 2)) {
    const color = LANG_COLORS[lang] ?? 'lightgrey';
    badges.push(
      `![${lang}](https://img.shields.io/badge/${encodeURIComponent(lang)}-${color}.svg)`
    );
  }

  // Framework badges
  for (const fw of profile.frameworks.slice(0, 3)) {
    badges.push(
      `![${fw}](https://img.shields.io/badge/${encodeURIComponent(fw)}-informational.svg)`
    );
  }

  return badges.join(' ');
}