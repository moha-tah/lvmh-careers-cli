import { XMLParser } from 'fast-xml-parser';
import { existsSync, readFileSync } from 'fs';

import { OfferHitDTO } from '../api/dtos/outputs/offer-hit.dto.js';
import { config } from '../config/index.js';
import { getConfigDir } from './get-config-dir.js';

export function getFavoritesFromFile(): OfferHitDTO[] {
  const storageType = config.get('storageType');
  const filePath = getConfigDir() + '/favorite-offers.' + storageType;

  // Return empty array if file doesn't exist
  if (!existsSync(filePath)) {
    return [];
  }

  const rawFavorite = readFileSync(filePath).toString();

  if (storageType === 'xml') {
    const parser = new XMLParser({
      isArray: (tagName: string): boolean => tagName === 'data',
    });
    return parser.parse(rawFavorite).data ?? [];
  } else {
    return JSON.parse(rawFavorite).data ?? [];
  }
}
