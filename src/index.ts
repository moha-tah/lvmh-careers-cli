#!/usr/bin/env node

import { Command } from 'commander';

import { clearCommand, initCommand, searchCommand } from './commands/index.js';

const program = new Command();

program
  .name('lvmh-careers')
  .description('A CLI tool for LVMH Careers platform')
  .version('1.0.0');

program.addCommand(initCommand);
program.addCommand(searchCommand);
program.addCommand(clearCommand);

program.parse();
