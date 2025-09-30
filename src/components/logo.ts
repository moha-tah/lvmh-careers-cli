import chalk from 'chalk';

import { PRIMARY_COLOR } from '../utils/constants.js';

export function displayLogo(): void {
  console.log(
    chalk.hex(PRIMARY_COLOR).bold(`
░██         ░██    ░██ ░███     ░███ ░██     ░██
░██         ░██    ░██ ░████   ░████ ░██     ░██
░██         ░██    ░██ ░██░██ ░██░██ ░██     ░██
░██         ░██    ░██ ░██ ░████ ░██ ░██████████
░██          ░██  ░██  ░██  ░██  ░██ ░██     ░██
░██           ░██░██   ░██       ░██ ░██     ░██
░██████████    ░███    ░██       ░██ ░██     ░██
`)
  );
  console.log(chalk.gray('Luxury • Fashion • Perfumes • Jewelry\n'));
}
