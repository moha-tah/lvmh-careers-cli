import chalk from 'chalk';
import { Command } from 'commander';
import enquirer from 'enquirer';

import { LVMH } from '../api/LVMH.js';
import { config } from '../config/index.js';
import { PRIMARY_COLOR } from '../utils/constants.js';
import { displayLogo } from '../utils/logo.js';
import { ensureConfigIsValid } from './init.js';

export const searchCommand = new Command()
  .name('search')
  .description('Search for job offers on LVMH Careers')
  .option('-q, --query <query>', 'Query term')
  .option('-n, --number <number>', 'Number of results per page')
  .option('-r, --raw', 'Raw offers in a JSON array', false)
  .action(async command => {
    await ensureConfigIsValid();

    displayLogo();

    const locale = config.get('locale');
    const lvmhApi = new LVMH(locale);
    let query = command.query;

    let page = 0;

    if (!query) {
      query = (
        await enquirer.prompt<{ query: string }>({
          type: 'input',
          name: 'query',
          message: 'Enter your search term (leave empty to see all offers):',
        })
      ).query;
    }

    if (!command.raw) {
      console.log('\n🔍 Searching for job offers...\n');
    }

    try {
      const results = await lvmhApi.searchOffers({
        params: {
          query,
          hitsPerPage: command.number || config.get('hitsPerPage'),
          page,
          facetFilters: [],
        },
      });

      const hits = results.results?.[0]?.hits || [];
      const nbPages = results.results?.[0]?.nbPages || 0;

      if (command.raw) {
        console.log(JSON.stringify(hits, null, 2));
        return;
      }

      if (hits.length === 0) {
        console.log('No results found.\n');
        return;
      }

      hits.forEach((hit, index) => {
        console.log(
          chalk.hex(PRIMARY_COLOR).bold(`${index + 1}. `) +
            chalk.white.bold(hit.name)
        );
        console.log(chalk.gray('   🏢 Company: ') + chalk.cyan(hit.maison));
        console.log(
          chalk.gray('   📍 Location: ') +
            chalk.green(`${hit.city ?? 'N/A'}, ${hit.country ?? 'N/A'}`)
        );
        console.log(
          chalk.gray('   💼 Function: ') + chalk.magenta(hit.function)
        );
        console.log(
          chalk.gray('   📄 Contract: ') + chalk.yellow(hit.contract)
        );
        console.log();
      });
      console.log(`📄 Page ${page + 1} of ${nbPages + 1}\n`);
      console.log(
        chalk
          .hex(PRIMARY_COLOR)
          .bold(`✨ Found ${hits.length} result${hits.length > 1 ? 's' : ''}`)
      );
    } catch (error) {
      console.error('Error searching for offers:', error);
    }
  });
