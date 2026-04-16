import { jest } from '@jest/globals';

describe('Booking Model', () => {
  it('should import without errors', async () => {
    const { default: Booking } = await import('../../models/Booking.js');
    expect(Booking).toBeDefined();
  });

  it('should have modelName as Booking', async () => {
    const { default: Booking } = await import('../../models/Booking.js');
    expect(Booking.modelName).toBe('Booking');
  });
});
