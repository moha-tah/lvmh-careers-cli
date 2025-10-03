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
  console.log(
    chalk.gray(
      'Docs on: https://mohamedtahiri.atlassian.net/wiki/external/MGFlN2M1OWJjMGI4NGJmMDgxYmNlMjMxODM0NWEwNTQ\n'
    )
  );
}
