import { AVAILABLE_LOCALES } from './constants.js';

export type Locale = keyof typeof AVAILABLE_LOCALES;

export type IndexName = `PRD-${Locale}-timestamp-desc`;

export type OfferSourceType = 'search' | 'fav-offers' | 'fav-queries';

export type FavoriteType = 'offers' | 'queries';
