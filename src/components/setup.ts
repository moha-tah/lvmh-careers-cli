import enquirer from 'enquirer';

import { config } from '../config/index.js';
import { AVAILABLE_LOCALES } from '../utils/constants.js';
import { displayLogo } from '../utils/logo.js';

export async function runSetup(): Promise<void> {
  displayLogo();

  const localeChoices = Object.entries(AVAILABLE_LOCALES).map(
    ([value, label]) => ({
      name: value,
      message: `${label} (${value})`,
    })
  );

  const response = await enquirer.prompt<{ locale: string }>({
    type: 'select',
    name: 'locale',
    message: 'Select your search language:',
    choices: localeChoices,
  });

  config.set('locale', response.locale as keyof typeof AVAILABLE_LOCALES);
  console.log('\n✓ Configuration saved successfully!\n');
}