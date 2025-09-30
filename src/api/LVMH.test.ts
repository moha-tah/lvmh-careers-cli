import { LVMH } from './LVMH.js';
import { LVMH_API_URL } from '../utils/constants.js';
import { OfferQueryDTO } from './dtos/inputs/offer-query.dto.js';
import { SearchOfferResultsDTO } from './dtos/outputs/search-offer-results.dto.js';

describe('LVMH API', () => {
  let lvmhApi: LVMH;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    lvmhApi = new LVMH('en-us');
  });

  describe('constructor', () => {
    it('should create LVMH instance with correct indexName for en-us locale', () => {
      const api = new LVMH('en-us');
      expect(api).toBeInstanceOf(LVMH);
    });

    it('should create LVMH instance with correct indexName for fr-fr locale', () => {
      const api = new LVMH('fr-fr');
      expect(api).toBeInstanceOf(LVMH);
    });
  });

  describe('searchOffers', () => {
    it('should call fetch with correct URL and method', async () => {
      const mockResponse: SearchOfferResultsDTO = {
        results: [
          {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const query: OfferQueryDTO = {
        params: {
          query: 'developer',
          hitsPerPage: 10,
          page: 0,
          facetFilters: [],
        },
      };

      await lvmhApi.searchOffers(query);

      expect(mockFetch).toHaveBeenCalledWith(LVMH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      });
    });

    it('should build query with correct structure', async () => {
      const mockResponse: SearchOfferResultsDTO = {
        results: [
          {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const query: OfferQueryDTO = {
        params: {
          query: 'designer',
          hitsPerPage: 5,
          page: 1,
          facetFilters: [],
        },
      };

      await lvmhApi.searchOffers(query);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs?.[1]?.body as string);

      expect(body).toEqual({
        queries: [
          {
            indexName: 'PRD-en-us-timestamp-desc',
            params: {
              query: 'designer',
              hitsPerPage: 5,
              page: 1,
              facetFilters: [],
              filters: 'category:job',
            },
          },
        ],
      });
    });

    it('should add category:job filter to params', async () => {
      const mockResponse: SearchOfferResultsDTO = {
        results: [
          {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const query: OfferQueryDTO = {
        params: {
          query: '',
          hitsPerPage: 10,
          page: 0,
          facetFilters: [],
        },
      };

      await lvmhApi.searchOffers(query);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs?.[1]?.body as string);

      expect(body.queries[0].params.filters).toBe('category:job');
    });

    it('should return search results', async () => {
      const mockResponse: SearchOfferResultsDTO = {
        results: [
          {
            hits: [
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
            ],
            nbHits: 1,
            nbPages: 1,
            page: 0,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const query: OfferQueryDTO = {
        params: {
          query: 'engineer',
          hitsPerPage: 10,
          page: 0,
          facetFilters: [],
        },
      };

      const result = await lvmhApi.searchOffers(query);

      expect(result).toEqual(mockResponse);
      expect(result.results[0]?.hits).toHaveLength(1);
      expect(result.results[0]?.hits[0]?.name).toBe('Software Engineer');
    });

    it('should use correct indexName for fr-fr locale', async () => {
      const frApi = new LVMH('fr-fr');
      const mockResponse: SearchOfferResultsDTO = {
        results: [
          {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const query: OfferQueryDTO = {
        params: {
          query: 'développeur',
          hitsPerPage: 10,
          page: 0,
          facetFilters: [],
        },
      };

      await frApi.searchOffers(query);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs?.[1]?.body as string);

      expect(body.queries[0].indexName).toBe('PRD-fr-fr-timestamp-desc');
    });

    it('should handle empty query string', async () => {
      const mockResponse: SearchOfferResultsDTO = {
        results: [
          {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const query: OfferQueryDTO = {
        params: {
          query: '',
          hitsPerPage: 10,
          page: 0,
          facetFilters: [],
        },
      };

      const result = await lvmhApi.searchOffers(query);

      expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const query: OfferQueryDTO = {
        params: {
          query: 'test',
          hitsPerPage: 10,
          page: 0,
          facetFilters: [],
        },
      };

      await expect(lvmhApi.searchOffers(query)).rejects.toThrow(
        'Network error'
      );
    });
  });
});
