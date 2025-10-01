import { FullFacetQueryDTO } from './facet-query.dto.js';
import { FullOfferQueryDTO } from './offer-query.dto.js';

export interface OfferPayloadDTO {
  queries: [FullOfferQueryDTO];
}

export interface FacetPayloadDTO {
  queries: [FullFacetQueryDTO];
}
