import { Command } from 'commander';
import enquirer from 'enquirer';

import { LVMH } from '../api/LVMH.js';
import { config } from '../config/index.js';
import {
  displayOffers,
  displayPageInfo,
  displayResultsCount,
} from '../utils/display-offers.js';
import { displayLogo } from '../utils/logo.js';
import { selectOfferOrNavigate } from '../utils/offer-selection.js';
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
      let continueNavigation = true;

      while (continueNavigation) {
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

        displayOffers(hits);
        displayPageInfo(page, nbPages);
        displayResultsCount(hits.length);

        console.log();

        const selection = await selectOfferOrNavigate(hits, page, nbPages);

        if (selection.type === 'previous') {
          page--;
        } else if (selection.type === 'next') {
          page++;
        } else if (selection.type === 'offer') {
          const answer = await enquirer.prompt<{ yes: boolean }>({
            type: 'confirm',
            name: 'yes',
            message: 'Do you want to search for another offer?',
          });

          if (!answer.yes) {
            continueNavigation = false;
          }
        }
      }
    } catch (error) {
      console.error('Error searching for offers:', error);
    }
  });
