import { OfferHitDTO } from '../../api/dtos/outputs/offer-hit.dto.js';
import { getFavoritesFromFile } from './get-favorites-from-file.js';
import { setFavoritesToFile } from './set-favorites-to-file.js';

export function getOffersFromFile(): OfferHitDTO[] {
  return getFavoritesFromFile('offers') as OfferHitDTO[];
}

export function setOffersToFile(favoriteOffers: OfferHitDTO[]): {
  path: string;
} {
  return setFavoritesToFile(favoriteOffers, 'offers');
}
