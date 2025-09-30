import { jest } from '@jest/globals';
import { getFavoritesFromFile } from './get-favorites-from-file.js';
import { OfferHitDTO } from '../api/dtos/outputs/offer-hit.dto.js';
import { SavedQueryDTO } from '../api/dtos/saved-query.dto.js';

// Mock modules
jest.mock('fs');
jest.mock('../config/index.js', () => ({
  config: {
    get: jest.fn(),
  },
}));
jest.mock('./get-config-dir.js', () => ({
  getConfigDir: jest.fn(() => '/test/config/dir'),
}));

import { existsSync, readFileSync } from 'fs';
import { config } from '../config/index.js';

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<
  typeof readFileSync
>;
const mockConfigGet = config.get as jest.MockedFunction<typeof config.get>;

describe('getFavoritesFromFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('with JSON storage', () => {
    beforeEach(() => {
      mockConfigGet.mockReturnValue('json');
    });

    it('should return empty array if file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const result = getFavoritesFromFile('offers');

      expect(result).toEqual([]);
      expect(mockExistsSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-offers.json'
      );
    });

    it('should parse and return offers from JSON file', () => {
      mockExistsSync.mockReturnValue(true);

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

      const jsonContent = JSON.stringify({ data: mockOffers });
      mockReadFileSync.mockReturnValue(Buffer.from(jsonContent));

      const result = getFavoritesFromFile('offers');

      expect(result).toEqual(mockOffers);
      expect(mockReadFileSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-offers.json'
      );
    });

    it('should parse and return queries from JSON file', () => {
      mockExistsSync.mockReturnValue(true);

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

      const jsonContent = JSON.stringify({ data: mockQueries });
      mockReadFileSync.mockReturnValue(Buffer.from(jsonContent));

      const result = getFavoritesFromFile('queries');

      expect(result).toEqual(mockQueries);
      expect(mockReadFileSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-queries.json'
      );
    });

    it('should return empty array if JSON data property is missing', () => {
      mockExistsSync.mockReturnValue(true);

      const jsonContent = JSON.stringify({});
      mockReadFileSync.mockReturnValue(Buffer.from(jsonContent));

      const result = getFavoritesFromFile('offers');

      expect(result).toEqual([]);
    });

    it('should handle multiple offers in JSON file', () => {
      mockExistsSync.mockReturnValue(true);

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

      const jsonContent = JSON.stringify({ data: mockOffers });
      mockReadFileSync.mockReturnValue(Buffer.from(jsonContent));

      const result = getFavoritesFromFile('offers');

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockOffers);
    });
  });

  describe('with XML storage', () => {
    beforeEach(() => {
      mockConfigGet.mockReturnValue('xml');
    });

    it('should return empty array if file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const result = getFavoritesFromFile('offers');

      expect(result).toEqual([]);
      expect(mockExistsSync).toHaveBeenCalledWith(
        '/test/config/dir/favorite-offers.xml'
      );
    });

    it('should parse and return offers from XML file', () => {
      mockExistsSync.mockReturnValue(true);

      // Simulate XML format that XMLBuilder creates with an array
      const xmlContent = `<data><objectID>1</objectID><name>Software Engineer</name><isNew>true</isNew><maison>Louis Vuitton</maison><city>Paris</city><country>France</country><function>IT</function><salary>50000</salary><contract>CDI</contract><requiredExperience>3 years</requiredExperience><workingMode>Hybrid</workingMode><fullTimePartTime>Full-time</fullTimePartTime></data>`;
      mockReadFileSync.mockReturnValue(Buffer.from(xmlContent));

      const result = getFavoritesFromFile('offers');

      // Result should be an array (isArray configured for 'data' tag)
      expect(Array.isArray(result)).toBe(true);
    });

    it('should parse and return queries from XML file', () => {
      mockExistsSync.mockReturnValue(true);

      // Simulate XML format that XMLBuilder creates
      const xmlContent = `<data><title>My Search</title></data>`;
      mockReadFileSync.mockReturnValue(Buffer.from(xmlContent));

      const result = getFavoritesFromFile('queries');

      // Result should be an array
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array if XML data is missing', () => {
      mockExistsSync.mockReturnValue(true);

      const xmlContent = '<?xml version="1.0" encoding="UTF-8"?><root></root>';
      mockReadFileSync.mockReturnValue(Buffer.from(xmlContent));

      const result = getFavoritesFromFile('offers');

      expect(result).toEqual([]);
    });
  });
});
