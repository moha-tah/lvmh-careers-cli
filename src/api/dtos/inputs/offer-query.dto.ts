import { AVAILABLE_LOCALES } from '../../../utils/constants.js';
import { FilterType } from '../../../utils/types.js';

export interface FullOfferQueryDTO {
  indexName: `PRD-${keyof typeof AVAILABLE_LOCALES}-timestamp-desc`;
  params: {
    filters: 'category:job';
    facets: FilterType[];

    // Must be an array of arrays,
    // each array is a group of filters on the same facet.
    facetFilters: string[][];

    hitsPerPage: number;
    page: number;

    // Textual query
    query: string;
  };
}

// No need to specify indexName and filters since it's always the same
export type OfferQueryDTO = {
  params: Omit<FullOfferQueryDTO['params'], 'filters' | 'facets'>;
};
