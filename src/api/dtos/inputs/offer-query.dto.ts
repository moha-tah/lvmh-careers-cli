import { AVAILABLE_LOCALES } from '../../../utils/constants.js';

export interface FullOfferQueryDTO {
  indexName: `PRD-${keyof typeof AVAILABLE_LOCALES}-timestamp-desc`;
  params: {
    filters: 'category:job';

    // Must be an array of arrays,
    // each array is a group of filters on the same facet.
    facetFilters: string[][];

    hitsPerPage: number;
    page: number;

    // Textual query
    query: string;
  };
}

export type OfferQueryDTO = Omit<
  FullOfferQueryDTO,
  'indexName' | 'params.filters'
>;
