import { Command } from 'commander';

import { config } from '../config/index.js';
import { displayLogo } from '../utils/logo.js';
import { navigateOffers } from '../utils/offer-navigation.js';
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

      await navigateOffers(favoriteOffers, config.get('hitsPerPage'));
    } catch (error) {
      console.error('Error loading favorite offers:', error);
    }
  });
