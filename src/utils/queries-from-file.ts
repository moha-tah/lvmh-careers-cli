import { SavedQueryDTO } from '../api/dtos/saved-query.dto.js';
import { getFavoritesFromFile } from './get-favorites-from-file.js';
import { setFavoritesToFile } from './set-favorites-to-file.js';

export function getQueriesFromFile(): SavedQueryDTO[] {
  return getFavoritesFromFile('queries') as SavedQueryDTO[];
}
export function setQueriesToFile(queries: SavedQueryDTO[]): {
  path: string;
} {
  return setFavoritesToFile(queries, 'queries');
}
