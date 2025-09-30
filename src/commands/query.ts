import { Command } from 'commander';
import enquirer from 'enquirer';

import { LVMH } from '../api/LVMH.js';
import { config } from '../config/index.js';
import { ensureConfigIsValid } from './init.js';

export const queryCommand = new Command()
  .name('query')
  .description('Search for job offers on LVMH Careers')
  .action(async () => {
    await ensureConfigIsValid();

    const locale = config.get('locale');
    const lvmhApi = new LVMH(locale);

    const { searchTerm } = await enquirer.prompt<{ searchTerm: string }>({
      type: 'input',
      name: 'searchTerm',
      message: 'Enter your search term:',
    });

    console.log('\n🔍 Searching for job offers...\n');

    try {
      const results = await lvmhApi.searchOffers({
        params: {
          query: searchTerm,
          hitsPerPage: 10,
          page: 0,
          facetFilters: [],
        },
      });

      const hits = results.results?.[0]?.hits || [];

      if (hits.length === 0) {
        console.log('No results found.\n');
        return;
      }

      console.log(`Found ${hits.length} results:\n`);

      hits.forEach((hit, index) => {
        console.log(`${index + 1}. ${hit.name}`);
        console.log(`   Company: ${hit.maison}`);
        console.log(`   Location: ${hit.city}, ${hit.country}`);
        console.log(`   Function: ${hit.function}`);
        console.log(`   Contract: ${hit.contract}\n`);
      });
    } catch (error) {
      console.error('Error searching for offers:', error);
    }
  });
