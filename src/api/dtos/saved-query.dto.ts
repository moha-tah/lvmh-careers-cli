import { OfferQueryDTO } from './inputs/offer-query.dto.js';

export interface SavedQueryDTO {
  title: string;
  queryParams: OfferQueryDTO['params'];
}
