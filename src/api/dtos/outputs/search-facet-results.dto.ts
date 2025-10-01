import { FilterType } from '../../../utils/types.js';

export interface SearchFacetResultsDTO {
  results: {
    facets: {
      [key in FilterType]: {
        [key: string]: number;
      }[];
    };
  }[];
}
