import { Command } from 'commander';
import enquirer from 'enquirer';

import { LVMH } from '../api/LVMH.js';
import { config } from '../config/index.js';
import { ensureConfigIsValid } from './init.js';

export const searchCommand = new Command()
  .name('search')
  .description('Search for job offers on LVMH Careers')
  .option('-q, --query <query>', 'Query term')
  .action(async command => {
    await ensureConfigIsValid();

    const locale = config.get('locale');
    const lvmhApi = new LVMH(locale);
    let query = command.query;

    if (!query) {
      query = (
        await enquirer.prompt<{ query: string }>({
          type: 'input',
          name: 'query',
          message: 'Enter your search term (leave empty to see all offers):',
          initial: 'software engineer',
        })
      ).query;
    }

    console.log('\n🔍 Searching for job offers...\n');

    try {
      const results = await lvmhApi.searchOffers({
        params: {
          query,
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

      console.log(
        `Found ${hits.length} result${hits.length > 1 ? 's' : ''}:\n`
      );

      hits.forEach((hit, index) => {
        console.log(`${index + 1}. ${hit.name}`);
        console.log(`   Company: ${hit.maison}`);
        console.log(`   Location: ${hit.city}, ${hit.country}`);
        console.log(`   Function: ${hit.function}`);
        console.log(`   Contract type: ${hit.contract}\n`);
      });
    } catch (error) {
      console.error('Error searching for offers:', error);
    }
  });
