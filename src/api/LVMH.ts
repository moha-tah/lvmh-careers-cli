import {
  AVAILABLE_LOCALES,
  LVMH_API_BASE_INDEX_NAME,
  LVMH_API_URL,
} from '../utils/constants.js';
import { IndexName, Locale } from '../utils/types.js';
import { OfferPayloadDTO } from './dtos/inputs/offer-payload.dto.js';
import {
  FullOfferQueryDTO,
  OfferQueryDTO,
} from './dtos/inputs/offer-query.dto.js';
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
      body: JSON.stringify(this.buildQuery(query)),
    });

    return response.json();
  }

  private buildQuery(query: OfferQueryDTO): OfferPayloadDTO {
    const fullQuery: FullOfferQueryDTO = {
      indexName: this.indexName,
      params: {
        ...query.params,
        filters: 'category:job',
      },
    };

    return {
      queries: [fullQuery],
    };
  }
}
