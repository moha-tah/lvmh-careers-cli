import { SavedQueryDTO } from '../../api/dtos/saved-query.dto.js';
import { config } from '../../config/index.js';
import { getFavoritesFromFile } from './get-favorites-from-file.js';
import { setFavoritesToFile } from './set-favorites-to-file.js';

export function getQueriesFromFile(): SavedQueryDTO[] {
  const queries = getFavoritesFromFile('queries') as SavedQueryDTO[];

  if (config.get('storageType') === 'json') {
    return queries;
  }

  return queries.map(query => ({
    ...query,
    queryParams: {
      ...query.queryParams,
      facetFilters: formatFacetFilters(
        query.queryParams.facetFilters as unknown as Record<string, string>[]
      ),
    },
  }));
}
export function setQueriesToFile(queries: SavedQueryDTO[]): {
  path: string;
} {
  return setFavoritesToFile(queries, 'queries');
}

function formatFacetFilters(
  facetFilters: Record<string, string>[]
): string[][] {
  return facetFilters.map(obj => Object.values(obj));
}
