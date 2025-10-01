import { AVAILABLE_LOCALES } from '../../../utils/constants.js';
import { FilterType } from '../../../utils/types.js';

export interface FullFacetQueryDTO {
  indexName: `PRD-${keyof typeof AVAILABLE_LOCALES}-timestamp-desc`;
  params: {
    filters: 'category:job';
    hitsPerPage: 0;
    facets: FilterType[];
  };
}

export type FacetQueryDTO = {
  params: Omit<FullFacetQueryDTO['params'], 'filters' | 'hitsPerPage'>;
};
