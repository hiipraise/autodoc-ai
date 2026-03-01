export function generateFeaturesSection(features: string[]): string {
  if (!features.length) return '';
  const lines = ['## ✨ Features', ''];
  features.forEach(f => lines.push(`- ${f}`));
  return lines.join('\n');
}