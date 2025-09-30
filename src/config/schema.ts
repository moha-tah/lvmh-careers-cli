import {
  AVAILABLE_LOCALES,
  DEFAULT_HITS_PER_PAGE,
} from '../utils/constants.js';

export type ConfigSchema = {
  locale: keyof typeof AVAILABLE_LOCALES;
  hitsPerPage: number;
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
} as const;
