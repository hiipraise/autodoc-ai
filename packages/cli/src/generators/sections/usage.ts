import type { ProjectProfile } from '../../core/detector';

export function generateUsageSection(profile: ProjectProfile): string {
  const lines = ['## 💡 Usage', ''];
  const pm = profile.packageManagers[0];

  if (!pm) {
    lines.push('See documentation for usage instructions.');
    return lines.join('\n');
  }

  lines.push('```bash');
  if (pm.name === 'npm' || pm.name === 'yarn' || pm.name === 'pnpm' || pm.name === 'bun') {
    lines.push(`# Development`);
    lines.push(`${pm.runCommand} dev`);
    lines.push('');
    lines.push(`# Build for production`);
    lines.push(`${pm.runCommand} build`);
    lines.push('');
    lines.push(`# Run tests`);
    lines.push(`${pm.runCommand} test`);
  } else if (pm.name === 'pip' || pm.name === 'poetry') {
    lines.push(`${pm.runCommand} main.py`);
  } else if (pm.name === 'cargo') {
    lines.push('cargo run');
    lines.push('cargo test');
    lines.push('cargo build --release');
  } else if (pm.name === 'go') {
    lines.push('go run .');
    lines.push('go test ./...');
    lines.push('go build -o app .');
  }
  lines.push('```');

  return lines.join('\n');
}