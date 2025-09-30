#!/usr/bin/env node

import { Command } from 'commander';
import { showCommand } from './commands/show.js';

const program = new Command();

program
  .name('lvmh-careers')
  .description('A CLI tool for LVMH Careers platform')
  .version('1.0.0');

program.addCommand(showCommand);

program.parse();
