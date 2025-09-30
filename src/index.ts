#!/usr/bin/env node

import { Command } from 'commander';
import { render } from 'ink';
import { showBaseUI } from './components/BaseCommand.js';

const program = new Command();

program.action(() => {
  render(showBaseUI());
});

program
  .name('lvmh-careers')
  .description('A CLI tool for LVMH Careers platform')
  .version('1.0.0');

program.parse();
