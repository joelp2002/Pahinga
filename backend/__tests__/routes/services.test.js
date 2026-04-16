import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Create mock functions
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockBookingFind = jest.fn();
const mockRequireAuth = jest.fn((req, res, next) => {
  req.user = { id: 'test-user', role: 'admin' };
  next();
});
const mockRequireRole = jest.fn((role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ message: 'Insufficient permissions' });
  }
});

// Mock modules
jest.unstable_mockModule('../../models/Service.js', () => ({
  default: {
    find: mockFind,
    findOne: mockFindOne,
  },
}));

jest.unstable_mockModule('../../models/Booking.js', () => ({
  default: {
    find: mockBookingFind,
  },
}));

jest.unstable_mockModule('../../middleware/auth.js', () => ({
  requireAuth: mockRequireAuth,
  requireRole: mockRequireRole,
}));

// Import mocked modules
const { default: Service } = await import('../../models/Service.js');
const { default: Booking } = await import('../../models/Booking.js');
const { default: serviceRoutes } = await import('../../routes/services.js');

const app = express();
app.use(express.json());
app.use('/api/services', serviceRoutes);

describe('Services Routes', () => {
  const mockServices = [
    {
      id: 'pool-1',
      name: 'Main Swimming Pool',
      type: 'swimming_pool',
      capacity: 50,
      pricePerDay: 3500,
      available: true,
      amenities: ['Lifeguard', 'Pool Toys'],
    },
    {
      id: 'cottage-1',
      name: 'Cabana',
      type: 'cottage',
      capacity: 8,
      pricePerDay: 400,
      available: true,
      amenities: ['Tables & Chairs'],
    },
    {
      id: 'hall-1',
      name: 'Grand Event Hall',
      type: 'event_hall',
      capacity: 150,
      pricePerDay: 5500,
      available: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    delete global.simpleDB;
    // Reset middleware mocks to default behavior
    mockRequireAuth.mockImplementation((req, res, next) => {
      req.user = { id: 'test-user', role: 'admin' };
      next();
    });
    mockRequireRole.mockImplementation((role) => (req, res, next) => {
      if (req.user && req.user.role === role) {
        next();
      } else {
        res.status(403).json({ message: 'Insufficient permissions' });
      }
    });
  });

  // Helper to mock Service.find with sort chain
  const mockServiceFind = (returnValue) => {
    mockFind.mockReturnValue({
      sort: jest.fn().mockResolvedValue(returnValue),
    });
  };

  // Helper to mock Service.find with rejected sort
  const mockServiceFindRejected = (error) => {
    mockFind.mockReturnValue({
      sort: jest.fn().mockRejectedValue(error),
    });
  };

  describe('GET /api/services', () => {
    it('should return all services sorted by name', async () => {
      mockServiceFind(mockServices);

      const response = await request(app).get('/api/services');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockServices);
    });

    it('should return 500 when database error occurs', async () => {
      mockServiceFindRejected(new Error('Database error'));

      const response = await request(app).get('/api/services');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to load services');
    });

    it('should work with SimpleDB fallback', async () => {
      const mockSimpleFindServices = jest.fn().mockReturnValue(mockServices);
      global.simpleDB = {
        findServices: mockSimpleFindServices,
      };

      const response = await request(app).get('/api/services');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockServices);
    });
  });

  describe('GET /api/services/available', () => {
    it('should return available services for given date range', async () => {
      mockServiceFind(mockServices);
      mockBookingFind.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/services/available')
        .query({ checkIn: '2026-03-10', checkOut: '2026-03-11' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockServices);
    });

    it('should return 400 when checkIn or checkOut is missing', async () => {
      const response = await request(app)
        .get('/api/services/available')
        .query({ checkIn: '2026-03-10' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('checkIn and checkOut query parameters are required');
    });

    it('should filter by service type when provided', async () => {
      mockFind.mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockServices[0]]),
      });
      mockBookingFind.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/services/available')
        .query({ checkIn: '2026-03-10', checkOut: '2026-03-11', serviceType: 'swimming_pool' });

      expect(response.status).toBe(200);
      expect(mockFind).toHaveBeenCalledWith({ available: true, type: 'swimming_pool' });
    });

    it('should filter out booked services', async () => {
      mockServiceFind(mockServices);
      mockBookingFind.mockResolvedValue([
        {
          service: 'Cabana',
          checkIn: '2026-03-10',
          checkOut: '2026-03-11',
          status: 'confirmed',
        },
      ]);

      const response = await request(app)
        .get('/api/services/available')
        .query({ checkIn: '2026-03-10', checkOut: '2026-03-11' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.find(s => s.name === 'Cabana')).toBeUndefined();
    });

    it('should filter out cancelled bookings when querying', async () => {
      // The implementation filters out cancelled bookings from the query
      // So we need to mock the Booking.find to NOT return cancelled bookings
      mockServiceFind(mockServices);
      mockBookingFind.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/services/available')
        .query({ checkIn: '2026-03-10', checkOut: '2026-03-11' });

      expect(response.status).toBe(200);
      // Verify the query excludes cancelled bookings
      expect(mockBookingFind).toHaveBeenCalledWith({ status: { $ne: 'cancelled' } });
    });

    it('should work with SimpleDB fallback', async () => {
      const mockSimpleFindServices = jest.fn().mockReturnValue(mockServices);
      const mockSimpleFindBookings = jest.fn().mockReturnValue([]);
      global.simpleDB = {
        findServices: mockSimpleFindServices,
        findBookings: mockSimpleFindBookings,
      };

      const response = await request(app)
        .get('/api/services/available')
        .query({ checkIn: '2026-03-10', checkOut: '2026-03-11' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockServices);
    });
  });

  describe('PUT /api/services/:id', () => {
    it('should update service availability', async () => {
      const updatedService = { ...mockServices[0], available: false };
      mockFindOne.mockResolvedValue({
        ...mockServices[0],
        save: jest.fn().mockResolvedValue(updatedService),
      });

      const response = await request(app)
        .put('/api/services/pool-1')
        .send({ available: false });

      expect(response.status).toBe(200);
      expect(response.body.available).toBe(false);
    });

    it('should return 404 when service is not found', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/services/nonexistent')
        .send({ available: false });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Service not found');
    });

    it('should require admin role', async () => {
      mockRequireAuth.mockImplementation((req, res, next) => {
        req.user = { id: 'test-user', role: 'employee' };
        next();
      });
      mockRequireRole.mockImplementation((role) => (req, res, next) => {
        if (req.user && req.user.role === role) {
          next();
        } else {
          res.status(403).json({ message: 'Insufficient permissions' });
        }
      });

      const response = await request(app)
        .put('/api/services/pool-1')
        .send({ available: false });

      expect(response.status).toBe(403);
    });

    it('should work with SimpleDB fallback', async () => {
      const updatedService = { ...mockServices[0], available: false };
      const mockSimpleFindServices = jest.fn().mockReturnValue([mockServices[0]]);
      const mockSimpleUpdateService = jest.fn().mockReturnValue(updatedService);
      global.simpleDB = {
        findServices: mockSimpleFindServices,
        updateService: mockSimpleUpdateService,
      };

      const response = await request(app)
        .put('/api/services/pool-1')
        .send({ available: false });

      expect(response.status).toBe(200);
      expect(response.body.available).toBe(false);
    });
  });
});
