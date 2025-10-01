import { XMLParser } from 'fast-xml-parser';
import { existsSync, readFileSync } from 'fs';

import { OfferHitDTO } from '../../api/dtos/outputs/offer-hit.dto.js';
import { SavedQueryDTO } from '../../api/dtos/saved-query.dto.js';
import { config } from '../../config/index.js';
import { FavoriteType } from '../../utils/types.js';
import { getConfigDir } from './get-config-dir.js';

export function getFavoritesFromFile(
  type: FavoriteType
): OfferHitDTO[] | SavedQueryDTO[] {
  const storageType = config.get('storageType');
  const filePath = getConfigDir() + `/favorite-${type}.` + storageType;

  // Return empty array if file doesn't exist
  if (!existsSync(filePath)) {
    return [];
  }

  const rawFavorite = readFileSync(filePath).toString();

  if (storageType === 'xml') {
    const parser = new XMLParser({
      isArray: (tagName: string): boolean =>
        tagName === 'data' || tagName === 'facetFilters',
    });
    return parser.parse(rawFavorite).data ?? [];
  } else {
    return JSON.parse(rawFavorite).data ?? [];
  }
}
