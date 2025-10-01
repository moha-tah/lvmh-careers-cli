import { jest } from '@jest/globals';

import { OfferHitDTO } from '../../api/dtos/outputs/offer-hit.dto.js';
import { SavedQueryDTO } from '../../api/dtos/saved-query.dto.js';
import { setFavoritesToFile } from './set-favorites-to-file.js';

// Mock modules
jest.mock('fs');
jest.mock('../../config/index.js', () => ({
  config: {
    get: jest.fn(),
  },
}));
jest.mock('./get-config-dir.js', () => ({
  getConfigDir: jest.fn(() => '/test/config/dir'),
}));

import { writeFileSync } from 'fs';

import { config } from '../../config/index.js';

const mockWriteFileSync = writeFileSync as jest.MockedFunction<
  typeof writeFileSync
>;
const mockConfigGet = config.get as jest.MockedFunction<typeof config.get>;

describe('setFavoritesToFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('with JSON storage', () => {
    beforeEach(() => {
      mockConfigGet.mockReturnValue('json');
    });

    it('should write offers to JSON file with correct structure', () => {
      const mockOffers: OfferHitDTO[] = [
        {
          objectID: '1',
          name: 'Software Engineer',
          isNew: true,
          maison: 'Louis Vuitton',
          city: 'Paris',
          country: 'France',
          function: 'IT',
          salary: '50000',
          contract: 'CDI',
          requiredExperience: '3 years',
          workingMode: 'Hybrid',
          fullTimePartTime: 'Full-time',
        },
      ];

      const result = setFavoritesToFile(mockOffers, 'offers');

      expect(result.path).toBe('/test/config/dir/favorite-offers.json');
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-offers.json',
        JSON.stringify({ data: mockOffers })
      );
    });

    it('should write queries to JSON file with correct structure', () => {
      const mockQueries: SavedQueryDTO[] = [
        {
          title: 'My Search',
          queryParams: {
            query: 'developer',
            hitsPerPage: 10,
            page: 0,
            facetFilters: [],
          },
        },
      ];

      const result = setFavoritesToFile(mockQueries, 'queries');

      expect(result.path).toBe('/test/config/dir/favorite-queries.json');
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-queries.json',
        JSON.stringify({ data: mockQueries })
      );
    });

    it('should handle empty array', () => {
      const result = setFavoritesToFile([], 'offers');

      expect(result.path).toBe('/test/config/dir/favorite-offers.json');
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-offers.json',
        JSON.stringify({ data: [] })
      );
    });

    it('should handle multiple offers', () => {
      const mockOffers: OfferHitDTO[] = [
        {
          objectID: '1',
          name: 'Software Engineer',
          isNew: true,
          maison: 'Louis Vuitton',
          city: 'Paris',
          country: 'France',
          function: 'IT',
          salary: '50000',
          contract: 'CDI',
          requiredExperience: '3 years',
          workingMode: 'Hybrid',
          fullTimePartTime: 'Full-time',
        },
        {
          objectID: '2',
          name: 'Designer',
          isNew: false,
          maison: 'Dior',
          city: 'Milan',
          country: 'Italy',
          function: 'Design',
          salary: null,
          contract: 'CDD',
          requiredExperience: '5 years',
          workingMode: 'On-site',
          fullTimePartTime: 'Full-time',
        },
      ];

      setFavoritesToFile(mockOffers, 'offers');

      const writtenData = mockWriteFileSync.mock.calls[0]?.[1] as string;
      const parsedData = JSON.parse(writtenData);

      expect(parsedData.data).toHaveLength(2);
      expect(parsedData.data).toEqual(mockOffers);
    });

    it('should handle offers with null values', () => {
      const mockOffers: OfferHitDTO[] = [
        {
          objectID: '1',
          name: 'Software Engineer',
          isNew: true,
          maison: 'Louis Vuitton',
          function: 'IT',
          salary: null,
          contract: 'CDI',
          requiredExperience: '3 years',
          workingMode: 'Hybrid',
          fullTimePartTime: 'Full-time',
        },
      ];

      setFavoritesToFile(mockOffers, 'offers');

      const writtenData = mockWriteFileSync.mock.calls[0]?.[1] as string;
      const parsedData = JSON.parse(writtenData);

      expect(parsedData.data[0].salary).toBeNull();
    });
  });

  describe('with XML storage', () => {
    beforeEach(() => {
      mockConfigGet.mockReturnValue('xml');
    });

    it('should write offers to XML file', () => {
      const mockOffers: OfferHitDTO[] = [
        {
          objectID: '1',
          name: 'Software Engineer',
          isNew: true,
          maison: 'Louis Vuitton',
          city: 'Paris',
          country: 'France',
          function: 'IT',
          salary: '50000',
          contract: 'CDI',
          requiredExperience: '3 years',
          workingMode: 'Hybrid',
          fullTimePartTime: 'Full-time',
        },
      ];

      const result = setFavoritesToFile(mockOffers, 'offers');

      expect(result.path).toBe('/test/config/dir/favorite-offers.xml');
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-offers.xml',
        expect.stringContaining('<data>')
      );
    });

    it('should write queries to XML file', () => {
      const mockQueries: SavedQueryDTO[] = [
        {
          title: 'My Search',
          queryParams: {
            query: 'developer',
            hitsPerPage: 10,
            page: 0,
            facetFilters: [],
          },
        },
      ];

      const result = setFavoritesToFile(mockQueries, 'queries');

      expect(result.path).toBe('/test/config/dir/favorite-queries.xml');
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-queries.xml',
        expect.stringContaining('<data>')
      );
    });

    it('should handle empty array in XML format', () => {
      const result = setFavoritesToFile([], 'offers');

      expect(result.path).toBe('/test/config/dir/favorite-offers.xml');
      expect(mockWriteFileSync).toHaveBeenCalled();
    });

    it('should write XML with proper structure', () => {
      const mockOffers: OfferHitDTO[] = [
        {
          objectID: '1',
          name: 'Software Engineer',
          isNew: true,
          maison: 'Louis Vuitton',
          city: 'Paris',
          country: 'France',
          function: 'IT',
          salary: '50000',
          contract: 'CDI',
          requiredExperience: '3 years',
          workingMode: 'Hybrid',
          fullTimePartTime: 'Full-time',
        },
      ];

      setFavoritesToFile(mockOffers, 'offers');

      const writtenData = mockWriteFileSync.mock.calls[0]?.[1] as string;

      expect(writtenData).toContain('<data>');
      expect(writtenData).toContain('<objectID>1</objectID>');
      expect(writtenData).toContain('<name>Software Engineer</name>');
    });
  });

  describe('return value', () => {
    it('should return correct path for JSON offers', () => {
      mockConfigGet.mockReturnValue('json');

      const result = setFavoritesToFile([], 'offers');

      expect(result).toEqual({
        path: '/test/config/dir/favorite-offers.json',
      });
    });

    it('should return correct path for XML queries', () => {
      mockConfigGet.mockReturnValue('xml');

      const result = setFavoritesToFile([], 'queries');

      expect(result).toEqual({
        path: '/test/config/dir/favorite-queries.xml',
      });
    });
  });
});
