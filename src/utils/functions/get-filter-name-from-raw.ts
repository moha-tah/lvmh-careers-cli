import { FILTERS_MAPPING } from '../constants.js';

export function getFilterNameFromRaw(raw: string): string {
  return raw in FILTERS_MAPPING
    ? FILTERS_MAPPING[raw as keyof typeof FILTERS_MAPPING]
    : raw.replace('Filter', '');
}
