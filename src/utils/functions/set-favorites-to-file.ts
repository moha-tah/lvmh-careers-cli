import { XMLBuilder } from 'fast-xml-parser';
import { writeFileSync } from 'fs';

import { OfferHitDTO } from '../../api/dtos/outputs/offer-hit.dto.js';
import { SavedQueryDTO } from '../../api/dtos/saved-query.dto.js';
import { config } from '../../config/index.js';
import { FavoriteType } from '../../utils/types.js';
import { getConfigDir } from './get-config-dir.js';

export function setFavoritesToFile(
  favoriteOffers: OfferHitDTO[] | SavedQueryDTO[],
  type: FavoriteType
): {
  path: string;
} {
  const storageType = config.get('storageType');
  const path = getConfigDir() + `/favorite-${type}.` + storageType;

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
