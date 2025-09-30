// Global test setup
// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
