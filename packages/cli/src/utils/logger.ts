import chalk from 'chalk';

const PUMPKIN = '#FE7F2D';
const CHARCOAL = '#233D4D';

export const logger = {
  info:    (msg: string) => console.log(chalk.hex(PUMPKIN)('ℹ ') + msg),
  success: (msg: string) => console.log(chalk.green('✅ ') + msg),
  warn:    (msg: string) => console.log(chalk.yellow('⚠  ') + msg),
  error:   (msg: string) => console.error(chalk.red('❌ ') + msg),
  dim:     (msg: string) => console.log(chalk.gray(msg)),
  step:    (n: number, total: number, msg: string) =>
    console.log(chalk.hex(PUMPKIN)(`[${n}/${total}]`) + ' ' + msg),
  banner: () => {
    console.log(chalk.hex(PUMPKIN)(`
  ___       __        ____
 /   | __  __/ /_____/ __ \\____  _____   ____ _(_)
/ /| |/ / / / __/ __ / / / / __ \\/ ___/  / __ \`/ /
/ ___ / /_/ / /_/ /_/ /_/ / /_/ / /__   / /_/ / /
/_/  |_\\__,_/\\__/\\____/_____/\\____/\\___/   \\__,_/_/
`));
    console.log(chalk.hex(CHARCOAL)('  Your codebase. Documented. Automatically.\n'));
  },
};