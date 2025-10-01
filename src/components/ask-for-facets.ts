import enquirer from 'enquirer';

import { LVMH } from '../api/LVMH.js';
import { getFilterNameFromRaw } from '../utils/functions/get-filter-name-from-raw.js';

export async function askForFacets(lvmhApi: LVMH): Promise<string[][]> {
  const facets = await lvmhApi.searchFacets({
    params: {
      facets: ['geographicAreaFilter', 'requiredExperienceFilter'],
    },
  });

  const selectedFilters: string[][] = [];
  for (const [facetName, facetValues] of Object.entries(
    facets.results[0]!.facets
  )) {
    const facetValuesArray = Object.entries(facetValues) as unknown as [
      string,
      number,
    ][];
    await askForFacet(facetName, facetValuesArray, selectedFilters);
  }

  return selectedFilters;
}

export async function askForFacet(
  facetName: string,
  facetValues: [string, number][],
  selectedFilters: string[][]
): Promise<void> {
  const choices = facetValues.map(facet => {
    const facetKey = facet[0]!;
    const facetValue = facet[1]!;
    return {
      name: facetKey,
      message: `${facetKey} (${facetValue} offers)`,
    };
  });

  console.log('⚠️ Space to select, enter to confirm, leave empty to skip');
  const response = await enquirer.prompt<{ selected: string[] }>({
    type: 'multiselect',
    name: 'selected',
    message: `Select ${getFilterNameFromRaw(facetName)} filters:`,
    choices,
  });
  const facetsForCurrentFilter: string[] = [];
  if (response.selected.length > 0) {
    response.selected.forEach(selected => {
      facetsForCurrentFilter.push(`${facetName}:${selected}`);
    });
  }
  selectedFilters.push(facetsForCurrentFilter);
}
