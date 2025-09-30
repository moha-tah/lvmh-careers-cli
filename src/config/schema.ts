import { OfferHitDTO } from '../api/dtos/outputs/offer-hit.dto.js';
import {
  AVAILABLE_LOCALES,
  DEFAULT_HITS_PER_PAGE,
} from '../utils/constants.js';

export type ConfigSchema = {
  locale: keyof typeof AVAILABLE_LOCALES;
  hitsPerPage: number;
  favoriteOffers: OfferHitDTO[];
};

export const configSchema = {
  locale: {
    type: 'string',
    enum: Object.keys(AVAILABLE_LOCALES),
  },
  hitsPerPage: {
    type: 'number',
    default: DEFAULT_HITS_PER_PAGE,
  },
  favoriteOffers: {
    type: 'array',
    default: [],
  },
} as const;
