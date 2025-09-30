import { jest } from '@jest/globals';

import { isConfigValid } from './is-config-valid.function.js';

// Mock config module
jest.mock('./index.js', () => ({
  config: {
    has: jest.fn(),
    get: jest.fn(),
  },
}));

import { config } from './index.js';

const mockConfigHas = config.has as jest.MockedFunction<typeof config.has>;
const mockConfigGet = config.get as jest.MockedFunction<typeof config.get>;

describe('isConfigValid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when locale exists and is defined', () => {
    mockConfigHas.mockReturnValue(true);
    mockConfigGet.mockReturnValue('en-us');

    const result = isConfigValid();

    expect(result).toBe(true);
    expect(mockConfigHas).toHaveBeenCalledWith('locale');
    expect(mockConfigGet).toHaveBeenCalledWith('locale');
  });

  it('should return false when locale does not exist', () => {
    mockConfigHas.mockReturnValue(false);
    mockConfigGet.mockReturnValue(undefined);

    const result = isConfigValid();

    expect(result).toBe(false);
    expect(mockConfigHas).toHaveBeenCalledWith('locale');
  });

  it('should return false when locale is undefined', () => {
    mockConfigHas.mockReturnValue(true);
    mockConfigGet.mockReturnValue(undefined);

    const result = isConfigValid();

    expect(result).toBe(false);
    expect(mockConfigGet).toHaveBeenCalledWith('locale');
  });

  it('should return true with fr-fr locale', () => {
    mockConfigHas.mockReturnValue(true);
    mockConfigGet.mockReturnValue('fr-fr');

    const result = isConfigValid();

    expect(result).toBe(true);
  });

  it('should return false and catch exceptions', () => {
    mockConfigHas.mockImplementation(() => {
      throw new Error('Config error');
    });

    const result = isConfigValid();

    expect(result).toBe(false);
  });

  it('should return false when config.get throws error', () => {
    mockConfigHas.mockReturnValue(true);
    mockConfigGet.mockImplementation(() => {
      throw new Error('Get error');
    });

    const result = isConfigValid();

    expect(result).toBe(false);
  });

  it('should handle null locale value', () => {
    mockConfigHas.mockReturnValue(true);
    mockConfigGet.mockReturnValue(null);

    const result = isConfigValid();

    expect(result).toBe(false);
  });

  it('should handle empty string locale', () => {
    mockConfigHas.mockReturnValue(true);
    mockConfigGet.mockReturnValue('');

    const result = isConfigValid();

    expect(result).toBe(false);
  });
});
