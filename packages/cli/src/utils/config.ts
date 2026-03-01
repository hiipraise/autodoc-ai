import { cosmiconfig } from 'cosmiconfig';
import path from 'path';
import fs from 'fs-extra';

export interface AutoDocConfig {
  version: string;
  output: string;
  ai: {
    provider: 'groq' | 'ollama';
    model: string;
    fallback: 'ollama' | 'none';
    ollamaModel: string;
  };
  scan: {
    maxDepth: number;
    maxFileSizeKB: number;
    includeHidden: boolean;
    extraIgnore: string[];
  };
  readme: {
    sections: string[];
    showBadges: boolean;
    showFileIcons: boolean;
    treeMaxDepth: number;
    license: string;
  };
  watch: {
    debounceMs: number;
    triggerOnAdd: boolean;
    triggerOnDelete: boolean;
    triggerOnChange: boolean;
  };
  branding: {
    footer: boolean;
    footerText: string;
  };
}

const DEFAULT_CONFIG: AutoDocConfig = {
  version: '1',
  output: './README.md',
  ai: {
    provider: 'groq',
    model: 'llama3-70b-8192',
    fallback: 'ollama',
    ollamaModel: 'codellama:7b',
  },
  scan: {
    maxDepth: 8,
    maxFileSizeKB: 100,
    includeHidden: false,
    extraIgnore: [],
  },
  readme: {
    sections: ['header', 'features', 'filetree', 'installation', 'usage', 'tech-stack', 'license'],
    showBadges: true,
    showFileIcons: false,
    treeMaxDepth: 4,
    license: 'MIT',
  },
  watch: {
    debounceMs: 1500,
    triggerOnAdd: true,
    triggerOnDelete: true,
    triggerOnChange: true,
  },
  branding: {
    footer: true,
    footerText: 'Generated with AutoDoc.ai',
  },
};

export async function loadConfig(searchFrom: string): Promise<AutoDocConfig> {
  const explorer = cosmiconfig('autodoc', {
    searchPlaces: [
      '.autodoc.json',
      '.autodoc.yaml',
      '.autodoc.yml',
      'autodoc.config.js',
      'autodoc.config.ts',
      'package.json',
    ],
  });

  try {
    const result = await explorer.search(searchFrom);
    if (result?.config) {
      return deepMerge(DEFAULT_CONFIG, result.config) as AutoDocConfig;
    }
  } catch {
    // Use defaults if config not found
  }

  return DEFAULT_CONFIG;
}

export async function writeDefaultConfig(dir: string): Promise<void> {
  const configPath = path.join(dir, '.autodoc.json');
  await fs.writeJSON(configPath, DEFAULT_CONFIG, { spaces: 2 });
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] ?? {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}