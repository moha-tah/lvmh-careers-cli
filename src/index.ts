#!/usr/bin/env node

import { Command } from 'commander';

import { initCommand, queryCommand } from './commands/index.js';
import { showBaseUI } from './components/base-command.js';

const program = new Command();

program
  .name('lvmh-careers')
  .description('A CLI tool for LVMH Careers platform')
  .version('1.0.0');

program.action(() => {
  showBaseUI();
});

program.addCommand(initCommand);
program.addCommand(queryCommand);

program.parse();
