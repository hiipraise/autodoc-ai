import type { ScannedFile } from './scanner';
import type { AutoDocConfig } from '../utils/config';
import { routeAI } from '../ai/router';
import { FEATURE_EXTRACTION_PROMPT } from '../ai/prompts';

const MAX_CONTENT_CHARS = 12_000;

export async function analyzeCode(
  files: ScannedFile[],
  config: AutoDocConfig
): Promise<string[]> {
  // Gather the most relevant files for analysis
  const relevantFiles = files
    .filter(f => f.content && f.content.trim().length > 50)
    .sort((a, b) => {
      // Prioritize entry points and config files
      const priority = (f: ScannedFile) => {
        if (/index\.(ts|js|tsx|jsx)$/.test(f.relativePath)) return 0;
        if (/main\.(ts|js|tsx|jsx)$/.test(f.relativePath)) return 1;
        if (/app\.(ts|js|tsx|jsx)$/i.test(f.relativePath)) return 2;
        if (f.ext === '.json') return 3;
        return 4;
      };
      return priority(a) - priority(b);
    })
    .slice(0, 20);

  if (relevantFiles.length === 0) return [];

  // Build a compact code snapshot
  let snapshot = '';
  for (const file of relevantFiles) {
    const excerpt = (file.content ?? '').slice(0, 1000);
    snapshot += `\n### ${file.relativePath}\n\`\`\`\n${excerpt}\n\`\`\`\n`;
    if (snapshot.length > MAX_CONTENT_CHARS) break;
  }

  const prompt = `Analyze this codebase and extract features:\n${snapshot}`;

  try {
    const raw = await routeAI(prompt, FEATURE_EXTRACTION_PROMPT, config);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed.slice(0, 10).map(String);
  } catch {
    // Fallback: return heuristic features
    return deriveHeuristicFeatures(files);
  }

  return [];
}

function deriveHeuristicFeatures(files: ScannedFile[]): string[] {
  const features: string[] = [];
  const paths = files.map(f => f.relativePath.toLowerCase());

  if (paths.some(p => p.includes('auth'))) features.push('Provides user authentication and authorization');
  if (paths.some(p => p.includes('api'))) features.push('Exposes a RESTful API interface');
  if (paths.some(p => p.includes('dashboard'))) features.push('Includes an interactive dashboard UI');
  if (paths.some(p => p.includes('watch'))) features.push('Supports real-time file watching');
  if (paths.some(p => p.includes('test'))) features.push('Includes automated test suites');
  if (paths.some(p => p.includes('docker'))) features.push('Supports containerized deployment with Docker');
  if (paths.some(p => p.includes('config'))) features.push('Offers flexible configuration options');
  if (paths.some(p => p.includes('cli'))) features.push('Provides a command-line interface');

  return features;
}