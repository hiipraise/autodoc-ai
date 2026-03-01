#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { generateCommand } from './commands/generate';
import { watchCommand } from './commands/watch';
import { initCommand } from './commands/init';

const PUMPKIN = '#FE7F2D';
const CHARCOAL = '#233D4D';

const program = new Command();

// ASCII Banner
console.log(chalk.hex(PUMPKIN)(`
  ___       __        ____
 /   | __  __/ /_____/ __ \\____  _____   ____ _(_)
/ /| |/ / / / __/ __ / / / / __ \\/ ___/  / __ \`/ /
/ ___ / /_/ / /_/ /_/ /_/ / /_/ / /__   / /_/ / /
/_/  |_\\__,_/\\__/\\____/_____/\\____/\\___/   \\__,_/_/
`));

console.log(chalk.hex(CHARCOAL)('  Your codebase. Documented. Automatically.\n'));

program
  .name('autodoc')
  .description('AI-powered README generator with live watch mode')
  .version('1.0.0');

program.addCommand(generateCommand);
program.addCommand(watchCommand);
program.addCommand(initCommand);

program.parse(process.argv);