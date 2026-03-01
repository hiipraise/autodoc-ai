import type { ProjectProfile } from '../../core/detector';

const LICENSE_LINKS: Record<string, string> = {
  'MIT': 'https://opensource.org/licenses/MIT',
  'Apache-2.0': 'https://opensource.org/licenses/Apache-2.0',
  'GPL-3.0': 'https://opensource.org/licenses/GPL-3.0',
  'BSD-2-Clause': 'https://opensource.org/licenses/BSD-2-Clause',
  'ISC': 'https://opensource.org/licenses/ISC',
};

export function generateLicenseSection(profile: ProjectProfile): string {
  const license = profile.license ?? 'MIT';
  const year = new Date().getFullYear();
  const link = LICENSE_LINKS[license];

  const lines = ['## 📄 License', ''];
  if (link) {
    lines.push(`This project is licensed under the [${license} License](${link}).`);
  } else {
    lines.push(`This project is licensed under the ${license} License.`);
  }
  lines.push('');
  lines.push(`Copyright © ${year}`);
  return lines.join('\n');
}