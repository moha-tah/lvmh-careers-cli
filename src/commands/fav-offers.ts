import { Command } from 'commander';

import { displayLogo } from '../components/logo.js';
import { navigateLocalOffers } from '../components/offers/offer-navigation.js';
import { config } from '../config/index.js';
import { ensureConfigIsValid } from './init.js';

export const favOffersCommand = new Command()
  .name('fav-offers')
  .description('View your favorite job offers')
  .action(async () => {
    await ensureConfigIsValid();

    displayLogo();

    console.log('\n⭐ Your favorite offers...\n');

    try {
      const favoriteOffers = config.get('favoriteOffers') || [];

      if (favoriteOffers.length === 0) {
        console.log('You have no favorite offers yet.\n');
        return;
      }

      await navigateLocalOffers(favoriteOffers, 5);
    } catch (error) {
      console.error('Error loading favorite offers:', error);
    }
  });
