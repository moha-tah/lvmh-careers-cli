import { OfferHitDTO } from './offer-hit.dto.js';

export interface SearchOfferResultsDTO {
  results: {
    hits: OfferHitDTO[];
    nbHits: number;
    nbPages: number;
  }[];
}
