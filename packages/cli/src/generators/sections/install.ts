import type { ProjectProfile } from '../../core/detector';

export function generateInstallSection(profile: ProjectProfile): string {
  const lines: string[] = ['## Installation', ''];

  // Prerequisites
  lines.push('### Prerequisites', '');
  if (profile.languages.includes('TypeScript') || profile.languages.includes('JavaScript')) {
    lines.push('- **Node.js** 18+ ([download](https://nodejs.org))');
  }
  if (profile.languages.includes('Python')) {
    lines.push('- **Python** 3.10+ ([download](https://python.org))');
  }
  if (profile.languages.includes('Go')) {
    lines.push('- **Go** 1.21+ ([download](https://go.dev))');
  }
  if (profile.languages.includes('Rust')) {
    lines.push('- **Rust** ([install](https://rustup.rs))');
  }
  if (profile.hasDockerfile) {
    lines.push('- **Docker** ([download](https://docker.com))');
  }
  lines.push('');

  // Clone
  lines.push('### Setup', '');
  lines.push('```bash');
  lines.push('# Clone the repository');
  lines.push('git clone https://github.com/your-org/your-repo.git');
  lines.push('cd your-repo');
  lines.push('');

  // Install per detected package manager
  for (const pm of profile.packageManagers) {
    lines.push(`# Install dependencies`);
    lines.push(pm.installCommand);
    break; // Only show primary
  }

  lines.push('');
  lines.push('# Copy and configure environment');
  lines.push('cp .env.example .env');
  lines.push('# → Edit .env with your values');
  lines.push('```');
  lines.push('');

  // Run commands
  if (profile.packageManagers.length > 0) {
    const pm = profile.packageManagers[0];
    lines.push('### Start Development', '');
    lines.push('```bash');
    if (profile.frameworks.includes('Next.js') || profile.frameworks.includes('Vite')) {
      lines.push(`${pm.runCommand} dev`);
    } else {
      lines.push(`${pm.runCommand} start`);
    }
    lines.push('```');
  }

  return lines.join('\n');
}