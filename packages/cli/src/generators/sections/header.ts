import type { ProjectProfile } from '../../core/detector';

export function generateHeaderSection(
  projectName: string,
  profile: ProjectProfile
): string {
  const lines: string[] = [];
  lines.push(`# ${projectName}`);
  lines.push('');
  if (profile.description) {
    lines.push(`> ${profile.description}`);
    lines.push('');
  }
  return lines.join('\n');
}