import { jest } from '@jest/globals';

describe('Service Model', () => {
  it('should import without errors', async () => {
    const { default: Service } = await import('../../models/Service.js');
    expect(Service).toBeDefined();
  });

  it('should have modelName as Service', async () => {
    const { default: Service } = await import('../../models/Service.js');
    expect(Service.modelName).toBe('Service');
  });
});
