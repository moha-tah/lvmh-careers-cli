import chalk from 'chalk';
import enquirer from 'enquirer';

import { config } from '../config/index.js';
import {
  AVAILABLE_LOCALES,
  AVAILABLE_STORAGE_TYPES,
} from '../utils/constants.js';
import { displayLogo } from './logo.js';

export async function runSetup(): Promise<void> {
  displayLogo();

  const localeChoices = Object.entries(AVAILABLE_LOCALES).map(
    ([value, label]) => ({
      name: value,
      message: `${label} (${value})`,
    })
  );

  const localeResponse = await enquirer.prompt<{ locale: string }>({
    type: 'select',
    name: 'locale',
    message: 'Select your search language:',
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

  console.log(chalk.green('\n✓ Configuration saved successfully!\n'));
}
