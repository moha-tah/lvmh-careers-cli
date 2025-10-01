import chalk from 'chalk';
import enquirer from 'enquirer';

import { OfferQueryDTO } from '../../api/dtos/inputs/offer-query.dto.js';
import { OfferHitDTO } from '../../api/dtos/outputs/offer-hit.dto.js';
import { getOffersFromFile } from '../../utils/functions/offers-from-file.js';
import { OfferSourceType } from '../../utils/types.js';
import { displayOffers, displayResultsCount } from './display-offers.js';
import { selectOfferOrNavigate } from './offer-selection.js';

type OfferProvider = (page: number) => Promise<{
  hits: OfferHitDTO[];
  nbPages: number;
}>;

async function handleOfferNavigation(
  source: OfferSourceType,
  provider: OfferProvider,
  currentQueryParams?: OfferQueryDTO['params']
): Promise<void> {
  let page = 0;
  let continueNavigation = true;

  while (continueNavigation) {
    const { hits, nbPages } = await provider(page);

    if (hits.length === 0) {
      console.log('No results found.\n');
      return;
    }

    displayOffers(hits, source);
    displayResultsCount(hits.length);

    console.log();

    const selection = await selectOfferOrNavigate(
      hits,
      page,
      nbPages,
      source,
      currentQueryParams
    );

    if (selection.type === 'previous') {
      page--;
    } else if (selection.type === 'next') {
      page++;
    } else if (selection.type === 'quit') {
      console.log('\n' + chalk.green('✓ Goodbye!'));
      process.exit(0);
    } else if (selection.type === 'save_query') {
      // Continue browsing after saving query
      continue;
    } else if (selection.type === 'offer') {
      const answer = await enquirer.prompt<{ toggle: boolean }>({
        type: 'toggle',
        name: 'toggle',
        message: 'Do you want to continue browsing?',
        enabled: 'Yes',
        disabled: 'No',
      });

      if (!answer.toggle) {
        continueNavigation = false;
        console.log('\n');
        console.log(chalk.green('✓ Goodbye!'));
      }
    }
  }
}

export async function navigateLocalOffers(hitsPerPage: number): Promise<void> {
  await handleOfferNavigation('fav-offers', async page => {
    const allHits = getOffersFromFile();
    const nbPages = Math.ceil(allHits.length / hitsPerPage) - 1;

    const startIndex = page * hitsPerPage;
    const endIndex = startIndex + hitsPerPage;
    const hits = allHits.slice(startIndex, endIndex);

    return { hits, nbPages };
  });
}

export async function navigateRemoteOffers(
  provider: OfferProvider,
  currentQueryParams?: OfferQueryDTO['params']
): Promise<void> {
  await handleOfferNavigation('search', provider, currentQueryParams);
}
