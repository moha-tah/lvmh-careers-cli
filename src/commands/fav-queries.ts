import chalk from 'chalk';
import { Command } from 'commander';
import enquirer from 'enquirer';

import { LVMH } from '../api/LVMH.js';
import { displayLogo } from '../components/logo.js';
import { navigateRemoteOffers } from '../components/offers/offer-navigation.js';
import { QUIT_VALUE } from '../components/offers/offer-selection.js';
import { config } from '../config/index.js';
import { CLI_NAME, PRIMARY_COLOR } from '../utils/constants.js';
import { getQueriesFromFile } from '../utils/functions/queries-from-file.js';
import { ensureConfigIsValid } from './init.js';

export const favQueriesCommand = new Command()
  .name('queries')
  .description('View and execute your favorite search queries')
  .action(async () => {
    await ensureConfigIsValid();

    displayLogo();

    console.log('\n⭐ Your favorite queries...\n');

    try {
      const queries = getQueriesFromFile();

      if (queries.length === 0) {
        console.log('You have no favorite queries yet.\n');
        console.log(
          'Use the ' +
            chalk.hex(PRIMARY_COLOR).bold(`\`${CLI_NAME} search\``) +
            chalk.reset() +
            ' command and select "💾 Save search to favorite queries" to save a search.\n'
        );
        return;
      }

      // Display queries and let user select one
      const choices = queries.map(query => ({
        message: query.title,
        name: query.title,
      }));

      choices.push({
        message: '❌ Quit',
        name: QUIT_VALUE,
      });

      const response = await enquirer.prompt<{ selection: string }>({
        type: 'select',
        name: 'selection',
        message: 'Select a query to execute:',
        choices,
      });

      if (response.selection === QUIT_VALUE) {
        console.log('\n' + chalk.green('✓ Goodbye!'));
        return;
      }

      const selectedQuery = queries.find(q => q.title === response.selection)!;

      console.log('\n🔍 Executing query: ' + chalk.bold(selectedQuery.title));
      console.log();

      // Execute the query using navigateRemoteOffers
      const locale = config.get('locale');
      const lvmhApi = new LVMH(locale);

      await navigateRemoteOffers(async page => {
        const results = await lvmhApi.searchOffers({
          params: {
            ...selectedQuery.queryParams,
            page,
          },
        });

        const hits = results.results?.[0]?.hits || [];
        const nbPages = results.results?.[0]?.nbPages || 0;

        return { hits, nbPages };
      }, selectedQuery.queryParams);
    } catch (error) {
      if (!error) {
        console.error(chalk.yellow('Interrupted. Goodbye!'));
        return;
      }
      console.error('Error loading favorite queries:', error);
    }
  });
