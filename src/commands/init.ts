import { Command } from 'commander';

import { runSetup } from '../components/setup.js';
import { isConfigValid } from '../config/is-config-valid.function.js';

export const initCommand = new Command()
  .name('init')
  .description('Initialize or reconfigure the CLI settings')
  .action(async () => {
    await runSetup();
  });

export async function ensureConfigIsValid(): Promise<void> {
  if (!isConfigValid()) {
    await runSetup();
  }
}
