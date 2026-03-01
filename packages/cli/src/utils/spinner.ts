import ora, { type Ora } from 'ora';
import chalk from 'chalk';

const PUMPKIN = '#FE7F2D';

export function createSpinner(text: string): Ora {
  return ora({ text: chalk.hex(PUMPKIN)(text), color: 'yellow' });
}

export async function withSpinner<T>(
  text: string,
  fn: () => Promise<T>,
  successText?: string
): Promise<T> {
  const spinner = createSpinner(text).start();
  try {
    const result = await fn();
    spinner.succeed(chalk.green(successText ?? text));
    return result;
  } catch (err) {
    spinner.fail(chalk.red(`Failed: ${(err as Error).message}`));
    throw err;
  }
}