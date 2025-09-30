#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';

import {
  clearCommand,
  favOffersCommand,
  favQueriesCommand,
  initCommand,
  searchCommand,
} from './commands/index.js';

// Handle Ctrl+C gracefully (cross-platform)
process.on('SIGINT', () => {
  console.log('\n' + chalk.yellow('Interrupted. Goodbye!'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n' + chalk.yellow('Terminated. Goodbye!'));
  process.exit(0);
});

// Handle unhandled promise rejections (e.g., from enquirer when interrupted)
process.on('unhandledRejection', (reason: unknown) => {
  // Empty string rejection comes from enquirer when user presses Ctrl+C
  if (reason === '') {
    console.log('\n' + chalk.yellow('Interrupted. Goodbye!'));
    process.exit(0);
  }
  // Re-throw other unhandled rejections
  throw reason;
});

const program = new Command();

program
  .name('lvmh-careers')
  .description('A CLI tool for LVMH Careers platform')
  .version('1.0.0');

program.addCommand(initCommand);
program.addCommand(searchCommand);
program.addCommand(favOffersCommand);
program.addCommand(favQueriesCommand);
program.addCommand(clearCommand);

program.parse();
