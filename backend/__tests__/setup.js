// Set up test environment variables
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.MONGODB_URI = 'mongodb://localhost:27017/pahinga_test';
process.env.PORT = '5001';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: () => {},
  error: () => {},
};
