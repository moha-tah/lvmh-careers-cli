import chalk from 'chalk';
import { Command } from 'commander';

import { config } from '../config/index.js';

export const clearCommand = new Command()
  .name('clear')
  .description('Clear the CLI settings')
  .action(async () => {
    config.clear();
    console.log(chalk.green('✓ Configuration cleared successfully!\n'));
  });
