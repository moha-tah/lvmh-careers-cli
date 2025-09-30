import { XMLBuilder } from 'fast-xml-parser';
import { writeFileSync } from 'fs';

import { OfferHitDTO } from '../api/dtos/outputs/offer-hit.dto.js';
import { config } from '../config/index.js';
import { getConfigDir } from './get-config-dir.js';

export function setFavoritesToFile(favoriteOffers: OfferHitDTO[]): {
  path: string;
} {
  const storageType = config.get('storageType');
  const path = getConfigDir() + '/favorite-offers.' + storageType;

  const data = { data: favoriteOffers };

  let output: string;
  if (storageType === 'xml') {
    const builder = new XMLBuilder();
    output = builder.build(data);
  } else {
    output = JSON.stringify(data);
  }

  writeFileSync(path, output);

  return { path };
}
