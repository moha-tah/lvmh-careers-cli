import { LVMH_API_BASE_INDEX_NAME, LVMH_API_URL } from '../utils/constants.js';
import { IndexName, Locale } from '../utils/types.js';
import {
  FacetQueryDTO,
  FullFacetQueryDTO,
} from './dtos/inputs/facet-query.dto.js';
import {
  FacetPayloadDTO,
  OfferPayloadDTO,
} from './dtos/inputs/offer-payload.dto.js';
import {
  FullOfferQueryDTO,
  OfferQueryDTO,
} from './dtos/inputs/offer-query.dto.js';
import { SearchFacetResultsDTO } from './dtos/outputs/search-facet-results.dto.js';
import { SearchOfferResultsDTO } from './dtos/outputs/search-offer-results.dto.js';

export class LVMH {
  private readonly indexName: IndexName;

  constructor(private readonly locale: Locale) {
    this.indexName = LVMH_API_BASE_INDEX_NAME.replace(
      '{{locale}}',
      this.locale
    ) as IndexName;
  }

  async searchOffers(query: OfferQueryDTO): Promise<SearchOfferResultsDTO> {
    const response = await fetch(LVMH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.buildOfferQuery(query)),
    });

    return response.json();
  }

  async searchFacets(query: FacetQueryDTO): Promise<SearchFacetResultsDTO> {
    const response = await fetch(LVMH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.buildFacetQuery(query)),
    });

    return response.json();
  }

  private buildOfferQuery(query: OfferQueryDTO): OfferPayloadDTO {
    const fullQuery: FullOfferQueryDTO = {
      indexName: this.indexName,
      params: {
        ...query.params,
        filters: 'category:job',
        facets: ['geographicAreaFilter', 'requiredExperienceFilter'],
      },
    };

    return {
      queries: [fullQuery],
    };
  }

  private buildFacetQuery(query: FacetQueryDTO): FacetPayloadDTO {
    const fullQuery: FullFacetQueryDTO = {
      indexName: this.indexName,
      params: {
        ...query.params,
        filters: 'category:job',
        hitsPerPage: 0,
      },
    };

    return {
      queries: [fullQuery],
    };
  }
}
