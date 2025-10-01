import chalk from 'chalk';
import enquirer from 'enquirer';
import { rmSync } from 'fs';

import { config } from '../config/index.js';
import {
  AVAILABLE_LOCALES,
  AVAILABLE_STORAGE_TYPES,
} from '../utils/constants.js';
import { getConfigDir } from '../utils/functions/get-config-dir.js';
import { displayLogo } from './logo.js';

export async function runSetup(): Promise<void> {
  displayLogo();

  console.log(chalk.bgGrey('You need some configuration to use the CLI.\n'));

  const localeChoices = Object.entries(AVAILABLE_LOCALES).map(
    ([value, label]) => ({
      name: value,
      message: `${label} (${value})`,
    })
  );

  console.log(
    'LVMH uses a search index for each language.\nSelect your preferred language to get the best results.'
  );
  const localeResponse = await enquirer.prompt<{ locale: string }>({
    type: 'select',
    name: 'locale',
    message: 'Your preferred language:',
    choices: localeChoices,
  });

  config.set('locale', localeResponse.locale as keyof typeof AVAILABLE_LOCALES);

  const storageTypeChoices = Object.entries(AVAILABLE_STORAGE_TYPES).map(
    ([value, label]) => ({
      name: value,
      message: label,
    })
  );

  const storageTypeResponse = await enquirer.prompt<{ storageType: string }>({
    type: 'select',
    name: 'storageType',
    message: 'Select your storage type for offers and queries:',
    choices: storageTypeChoices,
  });

  config.set('storageType', storageTypeResponse.storageType as 'json' | 'xml');

  // Delete old favorite offers file (old format)
  ['offers', 'queries'].forEach(type =>
    rmSync(
      getConfigDir() +
        `/favorite-${type}.` +
        storageTypeResponse.storageType ===
        'xml'
        ? 'json'
        : 'xml',
      { force: true } // Don't throw an error if the file doesn't exist
    )
  );

  console.log(chalk.green('\n✓ Configuration saved successfully!\n'));
}
