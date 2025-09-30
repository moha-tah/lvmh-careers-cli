import { Command } from 'commander';
import enquirer from 'enquirer';

import { LVMH } from '../api/LVMH.js';
import { config } from '../config/index.js';
import { displayLogo } from '../utils/logo.js';
import { navigateOffers } from '../utils/offer-navigation.js';
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
          hitsPerPage: 1000,
          page: 0,
          facetFilters: [],
        },
      });

      const hits = results.results?.[0]?.hits || [];

      if (command.raw) {
        console.log(JSON.stringify(hits, null, 2));
        return;
      }

      if (hits.length === 0) {
        console.log('No results found.\n');
        return;
      }

      const hitsPerPage = command.number || config.get('hitsPerPage');
      await navigateOffers(hits, hitsPerPage);
    } catch (error) {
      console.error('Error searching for offers:', error);
    }
  });
