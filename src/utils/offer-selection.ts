import chalk from 'chalk';
import clipboardy from 'clipboardy';
import enquirer from 'enquirer';
import open from 'open';

import { OfferHitDTO } from '../api/dtos/outputs/offer-hit.dto.js';
import { config } from '../config/index.js';
import { LVMH_OFFER_BASE_URL } from './constants.js';
import { displayOffer } from './display-offers.js';

const PREVIOUS_PAGE_VALUE = '__PREVIOUS_PAGE__';
const NEXT_PAGE_VALUE = '__NEXT_PAGE__';
const QUIT_VALUE = '__QUIT__';

type SelectionResult =
  | {
      type: 'offer';
      offerId: string;
      offerName: string;
    }
  | {
      type: 'previous' | 'next' | 'quit';
    };

export async function selectOfferOrNavigate(
  hits: OfferHitDTO[],
  page: number,
  nbPages: number
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

  const selectedOffer = hits.find(hit => hit.objectID === response.selection)!;

  // Display selected offer
  console.log('\n' + chalk.bold('Selected offer:'));
  displayOffer(selectedOffer);
  console.log();

  // Show action menu
  await showOfferActions(selectedOffer);

  return {
    type: 'offer',
    offerId: response.selection,
    offerName: selectedOffer.name,
  };
}

async function showOfferActions(offer: OfferHitDTO): Promise<void> {
  const offerUrl = LVMH_OFFER_BASE_URL + offer.objectID;

  const actionResponse = await enquirer.prompt<{ action: string }>({
    type: 'select',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { message: '📋 Copy offer link', name: 'copy' },
      { message: '🌐 Open in browser', name: 'open' },
      { message: '⭐ Add to favorites', name: 'favorite' },
    ],
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
  }
}

function toggleFavorite(offer: OfferHitDTO): void {
  const favoriteOffers = config.get('favoriteOffers') || [];
  const existingIndex = favoriteOffers.findIndex(
    fav => fav.objectID === offer.objectID
  );

  if (existingIndex !== -1) {
    // Remove old and add new
    favoriteOffers.splice(existingIndex, 1);
  }

  // Add to favorites
  favoriteOffers.push(offer);
  config.set('favoriteOffers', favoriteOffers);

  console.log(chalk.green('✓ Offer added to favorites!'));
}
