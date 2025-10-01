import chalk from 'chalk';
import { Command } from 'commander';
import { rmSync } from 'fs';

import { config } from '../config/index.js';
import { getConfigDir } from '../utils/functions/get-config-dir.js';

export const clearCommand = new Command()
  .name('clear')
  .description('Clear the CLI settings')
  .action(async () => {
    rmSync(getConfigDir() + '/favorite-offers.' + config.get('storageType'));
    config.clear();
    console.log(chalk.green('✓ Configuration cleared successfully!\n'));
  });
