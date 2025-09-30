import chalk from 'chalk';
import enquirer from 'enquirer';

import { OfferHitDTO } from '../api/dtos/outputs/offer-hit.dto.js';
import { displayOffers, displayResultsCount } from './display-offers.js';
import { selectOfferOrNavigate } from './offer-selection.js';

export async function navigateOffers(
  allHits: OfferHitDTO[],
  hitsPerPage: number
): Promise<void> {
  let page = 0;
  const nbPages = Math.ceil(allHits.length / hitsPerPage) - 1;
  let continueNavigation = true;

  while (continueNavigation) {
    const startIndex = page * hitsPerPage;
    const endIndex = startIndex + hitsPerPage;
    const hits = allHits.slice(startIndex, endIndex);

    if (hits.length === 0) {
      console.log('No results found.\n');
      return;
    }

    displayOffers(hits);
    displayResultsCount(hits.length);

    console.log();

    const selection = await selectOfferOrNavigate(hits, page, nbPages);

    if (selection.type === 'previous') {
      page--;
    } else if (selection.type === 'next') {
      page++;
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
