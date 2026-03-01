import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { createInterface } from 'readline';

const PUMPKIN = '#FE7F2D';

function prompt(rl: ReturnType<typeof createInterface>, question: string, defaultVal = ''): Promise<string> {
  return new Promise((resolve) => {
    const q = defaultVal
      ? `  ${chalk.hex(PUMPKIN)(question)} ${chalk.dim(`(${defaultVal})`)} › `
      : `  ${chalk.hex(PUMPKIN)(question)} › `;
    rl.question(q, (answer) => resolve(answer.trim() || defaultVal));
  });
}

export const initCommand = new Command('init')
  .description('Interactive configuration wizard — creates .autodoc.json')
  .argument('[dir]', 'Directory to initialise in', '.')
  .action(async (dir: string) => {
    const targetDir = path.resolve(dir);
    const configPath = path.join(targetDir, '.autodoc.json');

    console.log('');
    console.log(chalk.hex(PUMPKIN).bold('  🔧 AutoDoc Init Wizard'));
    console.log(chalk.dim('  Creates .autodoc.json in your project root\n'));

    if (await fs.pathExists(configPath)) {
      console.log(chalk.yellow('  ⚠️  .autodoc.json already exists.'));
      console.log(chalk.dim('     Delete it first or edit it manually.\n'));
      process.exit(0);
    }

    const rl = createInterface({ input: process.stdin, output: process.stdout });

    const aiProvider = await prompt(rl, 'AI provider (groq/ollama)', 'groq');
    const groqModel = aiProvider === 'groq'
      ? await prompt(rl, 'Groq model', 'llama3-70b-8192')
      : 'llama3-70b-8192';
    const outputPath = await prompt(rl, 'README output path', './README.md');
    const license = await prompt(rl, 'License (MIT/Apache-2.0/GPL-3.0)', 'MIT');
    const treeDepth = await prompt(rl, 'File tree max depth', '4');
    const debounceMs = await prompt(rl, 'Watch mode debounce (ms)', '1500');

    rl.close();

    const config = {
      $schema: 'https://autodoc.ai/schema/config.json',
      version: '1',
      output: outputPath,
      ai: {
        provider: aiProvider,
        model: groqModel,
        fallback: 'ollama',
        ollamaModel: 'codellama:7b',
      },
      scan: {
        maxDepth: 8,
        maxFileSizeKB: 100,
        includeHidden: false,
        extraIgnore: ['*.test.ts', '*.spec.ts', 'coverage/', '*.log'],
      },
      readme: {
        sections: ['header', 'features', 'filetree', 'installation', 'usage', 'tech-stack', 'license'],
        showBadges: true,
        showFileIcons: false,
        treeMaxDepth: parseInt(treeDepth),
        license,
      },
      watch: {
        debounceMs: parseInt(debounceMs),
        triggerOnAdd: true,
        triggerOnDelete: true,
        triggerOnChange: true,
      },
      branding: {
        footer: true,
        footerText: 'Generated with AutoDoc.ai',
      },
    };

    await fs.writeJSON(configPath, config, { spaces: 2 });

    console.log('');
    console.log(chalk.green('  ✅ .autodoc.json created!'));
    console.log('');
    console.log(chalk.dim('  Next steps:'));
    console.log(chalk.hex(PUMPKIN)('    $ autodoc generate .'));
    console.log(chalk.hex(PUMPKIN)('    $ autodoc watch .'));
    console.log('');

    if (aiProvider === 'groq') {
      console.log(chalk.yellow('  💡 Don\'t forget to add your Groq API key:'));
      console.log(chalk.dim('     GROQ_API_KEY=gsk_... in your .env file'));
      console.log(chalk.dim('     Get a free key at https://console.groq.com\n'));
    }
  });