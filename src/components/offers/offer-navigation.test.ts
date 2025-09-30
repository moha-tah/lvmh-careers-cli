import { jest } from '@jest/globals';
import { navigateLocalOffers } from './offer-navigation.js';
import { OfferHitDTO } from '../../api/dtos/outputs/offer-hit.dto.js';

// Mock modules
jest.mock('../../utils/offers-from-file.js', () => ({
  getOffersFromFile: jest.fn(),
}));
jest.mock('./display-offers.js', () => ({
  displayOffers: jest.fn(),
  displayResultsCount: jest.fn(),
}));
jest.mock('./offer-selection.js', () => ({
  selectOfferOrNavigate: jest.fn(),
}));
jest.mock('enquirer');

import { getOffersFromFile } from '../../utils/offers-from-file.js';
import { displayOffers, displayResultsCount } from './display-offers.js';
import { selectOfferOrNavigate } from './offer-selection.js';
import enquirer from 'enquirer';

const mockGetOffersFromFile = getOffersFromFile as jest.MockedFunction<
  typeof getOffersFromFile
>;
const mockDisplayOffers = displayOffers as jest.MockedFunction<
  typeof displayOffers
>;
const mockDisplayResultsCount = displayResultsCount as jest.MockedFunction<
  typeof displayResultsCount
>;
const mockSelectOfferOrNavigate = selectOfferOrNavigate as jest.MockedFunction<
  typeof selectOfferOrNavigate
>;
const mockEnquirerPrompt = enquirer.prompt as jest.MockedFunction<
  typeof enquirer.prompt
>;

describe('offer-navigation', () => {
  const createMockOffer = (id: string, name: string): OfferHitDTO => ({
    objectID: id,
    name,
    isNew: false,
    maison: 'Test Maison',
    city: 'Paris',
    country: 'France',
    function: 'IT',
    salary: null,
    contract: 'CDI',
    requiredExperience: '3 years',
    workingMode: 'Hybrid',
    fullTimePartTime: 'Full-time',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    // Mock process.exit
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('navigateLocalOffers', () => {
    it('should display no results message when no offers exist', async () => {
      mockGetOffersFromFile.mockReturnValue([]);
      mockSelectOfferOrNavigate.mockResolvedValue({ type: 'quit' });

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      expect(console.log).toHaveBeenCalledWith('No results found.\n');
    });

    it('should calculate correct number of pages', async () => {
      const mockOffers = [
        createMockOffer('1', 'Offer 1'),
        createMockOffer('2', 'Offer 2'),
        createMockOffer('3', 'Offer 3'),
        createMockOffer('4', 'Offer 4'),
        createMockOffer('5', 'Offer 5'),
        createMockOffer('6', 'Offer 6'),
      ];

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate.mockResolvedValue({ type: 'quit' });

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      expect(mockDisplayOffers).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ objectID: '1' }),
          expect.objectContaining({ objectID: '2' }),
          expect.objectContaining({ objectID: '3' }),
          expect.objectContaining({ objectID: '4' }),
          expect.objectContaining({ objectID: '5' }),
        ]),
        'fav-offers'
      );
    });

    it('should paginate offers correctly', async () => {
      const mockOffers = Array.from({ length: 15 }, (_, i) =>
        createMockOffer(`${i + 1}`, `Offer ${i + 1}`)
      );

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate
        .mockResolvedValueOnce({ type: 'next' })
        .mockResolvedValueOnce({ type: 'quit' });

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      // First page should show offers 1-5
      expect(mockDisplayOffers).toHaveBeenNthCalledWith(
        1,
        expect.arrayContaining([
          expect.objectContaining({ objectID: '1' }),
          expect.objectContaining({ objectID: '5' }),
        ]),
        'fav-offers'
      );

      // Second page should show offers 6-10
      expect(mockDisplayOffers).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          expect.objectContaining({ objectID: '6' }),
          expect.objectContaining({ objectID: '10' }),
        ]),
        'fav-offers'
      );
    });

    it('should handle previous navigation', async () => {
      const mockOffers = Array.from({ length: 15 }, (_, i) =>
        createMockOffer(`${i + 1}`, `Offer ${i + 1}`)
      );

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate
        .mockResolvedValueOnce({ type: 'next' }) // Go to page 2
        .mockResolvedValueOnce({ type: 'previous' }) // Go back to page 1
        .mockResolvedValueOnce({ type: 'quit' }); // Quit

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      // Should display page 1 twice (initial + after going back)
      expect(mockDisplayOffers).toHaveBeenCalledTimes(3);
    });

    it('should display correct results count', async () => {
      const mockOffers = [
        createMockOffer('1', 'Offer 1'),
        createMockOffer('2', 'Offer 2'),
        createMockOffer('3', 'Offer 3'),
      ];

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate.mockResolvedValue({ type: 'quit' });

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      expect(mockDisplayResultsCount).toHaveBeenCalledWith(3);
    });

    it('should handle offer selection and continue browsing', async () => {
      const mockOffers = [createMockOffer('1', 'Offer 1')];

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate.mockResolvedValueOnce({
        type: 'offer',
        offerId: mockOffers[0]?.objectID ?? '1',
        offerName: mockOffers[0]?.name ?? 'Offer 1',
      });
      mockEnquirerPrompt.mockResolvedValueOnce({ toggle: true });
      mockSelectOfferOrNavigate.mockResolvedValueOnce({ type: 'quit' });

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      expect(mockEnquirerPrompt).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Do you want to continue browsing?',
        })
      );
      expect(mockDisplayOffers).toHaveBeenCalledTimes(2);
    });

    it('should exit when user chooses not to continue browsing', async () => {
      const mockOffers = [createMockOffer('1', 'Offer 1')];

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate.mockResolvedValueOnce({
        type: 'offer',
        offerId: mockOffers[0]?.objectID ?? '1',
        offerName: mockOffers[0]?.name ?? 'Offer 1',
      });
      mockEnquirerPrompt.mockResolvedValueOnce({ toggle: false });

      await navigateLocalOffers(5);

      expect(mockEnquirerPrompt).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Goodbye!')
      );
    });

    it('should handle save_query selection and continue', async () => {
      const mockOffers = [createMockOffer('1', 'Offer 1')];

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate
        .mockResolvedValueOnce({ type: 'save_query' })
        .mockResolvedValueOnce({ type: 'quit' });

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      // Should continue browsing without prompting
      expect(mockDisplayOffers).toHaveBeenCalledTimes(2);
    });

    it('should slice offers correctly for last page with fewer items', async () => {
      const mockOffers = Array.from({ length: 7 }, (_, i) =>
        createMockOffer(`${i + 1}`, `Offer ${i + 1}`)
      );

      mockGetOffersFromFile.mockReturnValue(mockOffers);
      mockSelectOfferOrNavigate
        .mockResolvedValueOnce({ type: 'next' })
        .mockResolvedValueOnce({ type: 'quit' });

      try {
        await navigateLocalOffers(5);
      } catch (error) {
        // Expected: process.exit is called
      }

      // Second page should only have 2 offers (offers 6-7)
      expect(mockDisplayOffers).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([
          expect.objectContaining({ objectID: '6' }),
          expect.objectContaining({ objectID: '7' }),
        ]),
        'fav-offers'
      );
      expect(mockDisplayResultsCount).toHaveBeenNthCalledWith(2, 2);
    });
  });
});
