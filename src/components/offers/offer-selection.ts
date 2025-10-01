import chalk from 'chalk';
import clipboardy from 'clipboardy';
import enquirer from 'enquirer';
import open from 'open';

import { OfferQueryDTO } from '../../api/dtos/inputs/offer-query.dto.js';
import { OfferHitDTO } from '../../api/dtos/outputs/offer-hit.dto.js';
import { LVMH_OFFER_BASE_URL } from '../../utils/constants.js';
import { getOffersFromFile } from '../../utils/functions/offers-from-file.js';
import {
  getQueriesFromFile,
  setQueriesToFile,
} from '../../utils/functions/queries-from-file.js';
import { setFavoritesToFile } from '../../utils/functions/set-favorites-to-file.js';
import { OfferSourceType } from '../../utils/types.js';
import { displayOffer } from './display-offers.js';

const PREVIOUS_PAGE_VALUE = '__PREVIOUS_PAGE__';
const NEXT_PAGE_VALUE = '__NEXT_PAGE__';
export const QUIT_VALUE = '__QUIT__';
const SAVE_QUERY_VALUE = '__SAVE_QUERY__';

type SelectionResult =
  | {
      type: 'offer';
      offerId: string;
      offerName: string;
    }
  | {
      type: 'previous' | 'next' | 'quit' | 'save_query';
    };

export async function selectOfferOrNavigate(
  hits: OfferHitDTO[],
  page: number,
  nbPages: number,
  source: OfferSourceType,
  currentQueryParams?: OfferQueryDTO['params']
): Promise<SelectionResult> {
  const choices: { message: string; name: string }[] = [];

  // Add "Previous page" option if not on first page
  if (page > 0) {
    choices.push({
      message: `⬅️  Previous page (${page}/${nbPages + 1})`,
      name: PREVIOUS_PAGE_VALUE,
    });
  }

  // Add all offers
  hits.forEach(hit => {
    choices.push({
      message: hit.name,
      name: hit.objectID,
    });
  });

  // Add "Next page" option if not on last page
  if (page < nbPages) {
    choices.push({
      message: `➡️  Next page (${page + 2}/${nbPages + 1})`,
      name: NEXT_PAGE_VALUE,
    });
  }

  if (source === 'search' || source === 'fav-queries') {
    choices.push({
      message: '💾 Save search to favorite queries',
      name: SAVE_QUERY_VALUE,
    });
  }

  // Add "Quit" option at the end
  choices.push({
    message: '❌ Quit',
    name: QUIT_VALUE,
  });

  const response = await enquirer.prompt<{ selection: string }>({
    type: 'select',
    name: 'selection',
    message: 'Select an offer or navigate:',
    choices,
  });

  if (response.selection === PREVIOUS_PAGE_VALUE) {
    return { type: 'previous' };
  }

  if (response.selection === NEXT_PAGE_VALUE) {
    return { type: 'next' };
  }

  if (response.selection === QUIT_VALUE) {
    return { type: 'quit' };
  }

  if (response.selection === SAVE_QUERY_VALUE) {
    await saveQueryToFavorites(currentQueryParams!);
    return { type: 'save_query' };
  }

  const selectedOffer = hits.find(hit => hit.objectID === response.selection)!;

  // Display selected offer
  console.log('\n' + chalk.bold('Selected offer:'));
  displayOffer(selectedOffer, '   ', source);
  console.log();

  // Show action menu
  await showOfferActions(selectedOffer, source);

  return {
    type: 'offer',
    offerId: response.selection,
    offerName: selectedOffer.name,
  };
}

async function showOfferActions(
  offer: OfferHitDTO,
  source: OfferSourceType
): Promise<void> {
  const offerUrl = LVMH_OFFER_BASE_URL + offer.objectID;

  const choices = [
    { message: '📋 Copy offer link', name: 'copy' },
    { message: '🌐 Open in browser', name: 'open' },
  ];
  if (source === 'search' || source === 'fav-queries') {
    choices.push({ message: '⭐ Add to favorites', name: 'favorite' });
  }
  if (source === 'fav-offers') {
    choices.push({ message: '🗑️  Remove from favorites', name: 'remove' });
  }

  const actionResponse = await enquirer.prompt<{ action: string }>({
    type: 'select',
    name: 'action',
    message: 'What would you like to do?',
    choices,
  });

  switch (actionResponse.action) {
    case 'copy':
      await clipboardy.write(offerUrl);
      console.log(chalk.green('✓ Link copied to clipboard!'));
      break;

    case 'open':
      await open(offerUrl);
      console.log(chalk.green('✓ Opening in browser...'));
      break;

    case 'favorite':
      toggleFavorite(offer);
      break;

    case 'remove':
      removeFavorite(offer);
      break;
  }
}

function toggleFavorite(offer: OfferHitDTO): void {
  const favoriteOffers = getOffersFromFile();

  const existingIndex = favoriteOffers.findIndex(
    fav => fav.objectID === offer.objectID
  );

  if (existingIndex !== -1) {
    // Remove old and add new
    favoriteOffers.splice(existingIndex, 1);
  }

  // Add to favorites
  favoriteOffers.push(offer);

  const { path } = setFavoritesToFile(favoriteOffers, 'offers');

  console.log(chalk.green('✓ Offer added to favorites! Saved to: ' + path));
}

function removeFavorite(offer: OfferHitDTO): void {
  const favoriteOffers = getOffersFromFile();
  const existingIndex = favoriteOffers.findIndex(
    fav => fav.objectID === offer.objectID
  );
  favoriteOffers.splice(existingIndex, 1);
  const { path } = setFavoritesToFile(favoriteOffers, 'offers');

  console.log(
    chalk.green('✓ Offer removed from favorites! Saved to: ' + path + '\n')
  );
}

async function saveQueryToFavorites(
  queryParams: OfferQueryDTO['params']
): Promise<void> {
  const titleResponse = await enquirer.prompt<{ title: string }>({
    type: 'input',
    name: 'title',
    message: 'Enter a title for this search:',
    validate: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'Title cannot be empty';
      }
      return true;
    },
  });

  const queries = getQueriesFromFile();

  // Check if query with same title exists
  const existingIndex = queries.findIndex(q => q.title === titleResponse.title);
  if (existingIndex !== -1) {
    queries.splice(existingIndex, 1);
  }

  queries.push({
    title: titleResponse.title,
    queryParams,
  });

  const { path } = setQueriesToFile(queries);

  console.log(chalk.green('✓ Search saved to favorites! Saved to: ' + path));

  const shouldContinue = await enquirer.prompt<{ continue: boolean }>({
    type: 'toggle',
    name: 'continue',
    message: 'Do you want to continue browsing?',
    enabled: 'Yes',
    disabled: 'No',
  });

  if (!shouldContinue.continue) {
    console.log('\n' + chalk.green('✓ Goodbye!'));
    process.exit(0);
  }
}
