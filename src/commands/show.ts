import { Command } from 'commander';
import { render } from 'ink';
import { showApp } from '../components/ShowApp.js';

export const showCommand = new Command()
  .name('show')
  .description('Display the LVMH logo')
  .action(() => {
    render(showApp());
  });
