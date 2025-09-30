import chalk from 'chalk';

import { CLI_NAME, PRIMARY_COLOR } from '../utils/constants.js';
import { displayLogo } from '../utils/logo.js';

export function showBaseUI(): void {
  displayLogo();
  console.log(
    `Try to make a query with ${chalk.hex(PRIMARY_COLOR).bold(`\`${CLI_NAME} query\``)} or ${chalk.hex(PRIMARY_COLOR).bold(`\`${CLI_NAME} help\``)} to get more information.\n`
  );
}