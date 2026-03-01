import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { Scanner } from '../core/scanner';
import { GitignoreFilter } from '../core/gitignore';
import { generateReadme } from '../generators/readme';
import { loadConfig } from '../utils/config';
import fs from 'fs-extra';

export const generateCommand = new Command('generate')
  .alias('gen')
  .description('Scan a directory and generate README.md')
  .argument('[dir]', 'Target directory', '.')
  .option('-o, --output <path>', 'Output path for README.md', './README.md')
  .option('--no-ai', 'Skip AI analysis, use heuristics only')
  .option('--model <model>', 'AI model to use', 'llama3-70b-8192')
  .option('--dry-run', 'Preview output without writing files')
  .action(async (dir: string, options) => {
    const config = await loadConfig(dir);
    const targetDir = path.resolve(dir);

    const spinner = ora({
      text: chalk.hex('#FE7F2D')('Scanning directory...'),
      color: 'yellow',
    }).start();

    try {
      // Step 1: Build gitignore filter
      spinner.text = 'Loading .gitignore rules...';
      const filter = await GitignoreFilter.fromDirectory(targetDir);

      // Step 2: Recursive scan
      spinner.text = 'Scanning files...';
      const scanner = new Scanner(targetDir, filter);
      const { files, tree } = await scanner.scan();
      spinner.succeed(`Scanned ${files.length} files`);

      // Step 3: AI Analysis
      let features: string[] = [];
      if (options.ai) {
        const aiSpinner = ora(chalk.hex('#FE7F2D')('AI analyzing codebase...')).start();
        const { analyzeCode } = await import('../core/analyzer');
        features = await analyzeCode(files, config);
        aiSpinner.succeed(`Extracted ${features.length} features`);
      }

      // Step 4: Generate README
      const buildSpinner = ora(chalk.hex('#FE7F2D')('Building README.md...')).start();
      const readme = await generateReadme({ targetDir, files, tree, features, config });
      buildSpinner.succeed('README.md built');

      // Step 5: Write output
      if (!options.dryRun) {
        await fs.writeFile(path.resolve(options.output), readme, 'utf-8');
        console.log(chalk.hex('#FE7F2D')(`\n✅ README.md written to ${options.output}`));
      } else {
        console.log('\n--- DRY RUN PREVIEW ---\n');
        console.log(readme.slice(0, 2000) + '\n...(truncated)');
      }
    } catch (err) {
      spinner.fail(chalk.red(`Error: ${(err as Error).message}`));
      process.exit(1);
    }
  });