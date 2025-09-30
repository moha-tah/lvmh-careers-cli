import { AVAILABLE_LOCALES } from '../utils/constants.js';

export type ConfigSchema = {
  locale: keyof typeof AVAILABLE_LOCALES;
};

export const configSchema = {
  locale: {
    type: 'string',
    enum: Object.keys(AVAILABLE_LOCALES),
  },
} as const;
