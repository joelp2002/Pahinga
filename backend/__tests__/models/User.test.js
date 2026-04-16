import { jest } from '@jest/globals';

describe('User Model', () => {
  it('should import without errors', async () => {
    const { default: User } = await import('../../models/User.js');
    expect(User).toBeDefined();
  });

  it('should have modelName as User', async () => {
    const { default: User } = await import('../../models/User.js');
    expect(User.modelName).toBe('User');
  });
});
