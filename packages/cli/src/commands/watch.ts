import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import { Scanner } from '../core/scanner';
import { GitignoreFilter } from '../core/gitignore';
import { generateReadme } from '../generators/readme';
import { loadConfig } from '../utils/config';
import { FileHashCache } from '../utils/hash';
import fs from 'fs-extra';

const PUMPKIN = '#FE7F2D';

export const watchCommand = new Command('watch')
  .description('Watch directory and auto-update README.md on changes')
  .argument('[dir]', 'Target directory', '.')
  .option('-o, --output <path>', 'README output path', './README.md')
  .option('--debounce <ms>', 'Debounce delay in ms', '1500')
  .action(async (dir: string, options) => {
    const targetDir = path.resolve(dir);
    const config = await loadConfig(targetDir);
    const hashCache = new FileHashCache();
    let isGenerating = false;

    console.log(chalk.hex(PUMPKIN)('👁  AutoDoc Watch Mode Active'));
    console.log(chalk.gray(`   Watching: ${targetDir}`));
    console.log(chalk.gray('   Press Ctrl+C to stop\n'));

    const filter = await GitignoreFilter.fromDirectory(targetDir);

    // Debounced regeneration to avoid thrashing
    const regenerate = debounce(async (changedFile: string) => {
      if (isGenerating) return;
      isGenerating = true;

      const timestamp = new Date().toLocaleTimeString();
      console.log(chalk.hex(PUMPKIN)(`[${timestamp}] 🔄 Change detected: ${path.relative(targetDir, changedFile)}`));

      try {
        const scanner = new Scanner(targetDir, filter);
        const { files, tree } = await scanner.scan();
        const { analyzeCode } = await import('../core/analyzer');
        const features = await analyzeCode(files, config);
        const readme = await generateReadme({ targetDir, files, tree, features, config });
        await fs.writeFile(path.resolve(options.output), readme, 'utf-8');
        console.log(chalk.green(`[${timestamp}] ✅ README.md updated`));

        // Emit SSE event if server is running
        process.send?.({ type: 'readme-updated', timestamp, file: changedFile });
      } catch (err) {
        console.error(chalk.red(`[${timestamp}] ❌ Error: ${(err as Error).message}`));
      } finally {
        isGenerating = false;
      }
    }, parseInt(options.debounce));

    const watcher = chokidar.watch(targetDir, {
      ignored: (filePath: string) => {
        // Ignore hidden dirs, node_modules, dist, the output README itself
        if (filePath.includes('node_modules')) return true;
        if (filePath.includes('/.git')) return true;
        if (filePath === path.resolve(options.output)) return true;
        return !filter.accepts(path.relative(targetDir, filePath));
      },
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
    });

    watcher
      .on('add', (p) => regenerate(p))
      .on('change', (p) => regenerate(p))
      .on('unlink', (p) => regenerate(p))
      .on('error', (err) => console.error(chalk.red('Watcher error:'), err));

    // Progress bar pulse animation
    const pulse = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
    let i = 0;
    setInterval(() => {
      process.stdout.write(`\r${chalk.hex(PUMPKIN)(pulse[i++ % pulse.length])} Watching for changes...`);
    }, 100);
  });