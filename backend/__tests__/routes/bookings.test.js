import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Create mock functions
const mockBookingFind = jest.fn();
const mockBookingFindOne = jest.fn();
const mockBookingFindOneAndUpdate = jest.fn();
const mockBookingFindOneAndDelete = jest.fn();
const mockBookingCreate = jest.fn();
const mockServiceFindOne = jest.fn();
const mockRequireAuth = jest.fn((req, res, next) => {
  req.user = { id: 'test-user', role: 'employee' };
  next();
});
const mockRequireRole = jest.fn((role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ message: 'Insufficient permissions' });
  }
});

// Mock the models
jest.unstable_mockModule('../../models/Booking.js', () => ({
  default: {
    find: mockBookingFind,
    findOne: mockBookingFindOne,
    findOneAndUpdate: mockBookingFindOneAndUpdate,
    findOneAndDelete: mockBookingFindOneAndDelete,
    create: mockBookingCreate,
  },
}));

jest.unstable_mockModule('../../models/Service.js', () => ({
  default: {
    findOne: mockServiceFindOne,
  },
}));

jest.unstable_mockModule('../../middleware/auth.js', () => ({
  requireAuth: mockRequireAuth,
  requireRole: mockRequireRole,
}));

// Import mocked modules
const { default: Booking } = await import('../../models/Booking.js');
const { default: Service } = await import('../../models/Service.js');
const { default: bookingRoutes } = await import('../../routes/bookings.js');

const app = express();
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

describe('Bookings Routes', () => {
  const mockBookings = [
    {
      id: 'BK001',
      customerName: 'Juan dela Cruz',
      email: 'juan@example.com',
      phone: '0917-123-4567',
      service: 'Cabana',
      checkIn: '2026-03-05',
      checkOut: '2026-03-06',
      guests: 6,
      status: 'confirmed',
      totalAmount: 400,
      createdAt: '2026-02-20',
    },
    {
      id: 'BK002',
      customerName: 'Maria Santos',
      email: 'maria@example.com',
      phone: '0918-234-5678',
      service: 'Grand Event Hall',
      checkIn: '2026-03-10',
      checkOut: '2026-03-10',
      guests: 120,
      status: 'pending',
      totalAmount: 11500,
      createdAt: '2026-02-22',
    },
  ];

  const mockService = {
    id: 'cottage-1',
    name: 'Cabana',
    type: 'cottage',
    capacity: 8,
    pricePerDay: 400,
    available: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    delete global.simpleDB;
    // Reset mock implementations to default behavior
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
  });

  describe('GET /api/bookings', () => {
    it('should return all bookings sorted by createdAt', async () => {
      mockBookingFind.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings),
      });

      const response = await request(app).get('/api/bookings');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
    });

    it('should return 500 when database error occurs', async () => {
      mockBookingFind.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const response = await request(app).get('/api/bookings');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to load bookings');
    });

    it('should work with SimpleDB fallback', async () => {
      global.simpleDB = {
        findBookings: jest.fn().mockReturnValue(mockBookings),
      };

      const response = await request(app).get('/api/bookings');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
    });
  });

  describe('POST /api/bookings', () => {
    const validBookingData = {
      customerName: 'Test Customer',
      email: 'test@example.com',
      phone: '0917-999-9999',
      service: 'Cabana',
      checkIn: '2026-04-10',
      checkOut: '2026-04-11',
      guests: 4,
      totalAmount: 400,
    };

    it('should create a new booking with valid data', async () => {
      mockServiceFindOne.mockResolvedValue(mockService);
      mockBookingFind.mockResolvedValue([]);
      mockBookingCreate.mockResolvedValue({
        id: 'BK123456',
        ...validBookingData,
        status: 'pending',
        createdAt: '2026-04-01',
      });

      const response = await request(app)
        .post('/api/bookings')
        .send(validBookingData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customerName).toBe(validBookingData.customerName);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({ customerName: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All booking fields are required');
    });

    it('should return 400 when service is not available', async () => {
      mockServiceFindOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/bookings')
        .send(validBookingData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Selected service is not available');
    });

    it('should return 409 when there is a booking conflict', async () => {
      mockServiceFindOne.mockResolvedValue(mockService);
      mockBookingFind.mockResolvedValue([
        {
          service: 'Cabana',
          checkIn: '2026-04-10',
          checkOut: '2026-04-11',
          status: 'confirmed',
        },
      ]);

      const response = await request(app)
        .post('/api/bookings')
        .send(validBookingData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Selected service is already booked on those dates');
    });

    it('should allow booking when existing booking is cancelled', async () => {
      mockServiceFindOne.mockResolvedValue(mockService);
      // Mock to return empty array when filtering out cancelled bookings
      mockBookingFind.mockImplementation((query) => {
        // If query excludes cancelled, return empty (no conflicts)
        if (query && query.status && query.status.$ne === 'cancelled') {
          return Promise.resolve([]);
        }
        // Otherwise return all bookings including cancelled
        return Promise.resolve([
          {
            service: 'Cabana',
            checkIn: '2026-04-10',
            checkOut: '2026-04-11',
            status: 'cancelled',
          },
        ]);
      });
      mockBookingCreate.mockResolvedValue({
        id: 'BK123456',
        ...validBookingData,
        status: 'pending',
        createdAt: '2026-04-01',
      });

      const response = await request(app)
        .post('/api/bookings')
        .send(validBookingData);

      expect(response.status).toBe(201);
    });

    it('should work with SimpleDB fallback', async () => {
      global.simpleDB = {
        findServices: jest.fn().mockReturnValue([mockService]),
        findBookings: jest.fn().mockReturnValue([]),
        createBooking: jest.fn().mockReturnValue({
          id: 'BK789',
          ...validBookingData,
          status: 'pending',
          createdAt: '2026-04-01',
        }),
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(validBookingData);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe('BK789');
    });
  });

  describe('PUT /api/bookings/:id/status', () => {
    it('should update booking status', async () => {
      const updatedBooking = { ...mockBookings[0], status: 'completed' };
      mockBookingFindOneAndUpdate.mockResolvedValue(updatedBooking);

      const response = await request(app)
        .put('/api/bookings/BK001/status')
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
    });

    it('should return 404 when booking is not found', async () => {
      mockBookingFindOneAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/bookings/NONEXISTENT/status')
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Booking not found');
    });

    it('should require authentication', async () => {
      mockRequireAuth.mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Authentication required' });
      });

      const response = await request(app)
        .put('/api/bookings/BK001/status')
        .send({ status: 'completed' });

      expect(response.status).toBe(401);
    });

    it('should work with SimpleDB fallback', async () => {
      const updatedBooking = { ...mockBookings[0], status: 'cancelled' };
      global.simpleDB = {
        updateBooking: jest.fn().mockReturnValue(updatedBooking),
      };

      const response = await request(app)
        .put('/api/bookings/BK001/status')
        .send({ status: 'cancelled' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('cancelled');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should delete a booking', async () => {
      // Set user as admin for delete
      mockRequireAuth.mockImplementation((req, res, next) => {
        req.user = { id: 'test-user', role: 'admin' };
        next();
      });
      mockBookingFindOneAndDelete.mockResolvedValue(mockBookings[0]);

      const response = await request(app).delete('/api/bookings/BK001');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Booking removed');
    });

    it('should return 404 when booking is not found', async () => {
      // Set user as admin for delete
      mockRequireAuth.mockImplementation((req, res, next) => {
        req.user = { id: 'test-user', role: 'admin' };
        next();
      });
      mockBookingFindOneAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/api/bookings/NONEXISTENT');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Booking not found');
    });

    it('should require admin role', async () => {
      mockRequireRole.mockImplementation((role) => (req, res, next) => {
        res.status(403).json({ message: 'Insufficient permissions' });
      });

      const response = await request(app).delete('/api/bookings/BK001');

      expect(response.status).toBe(403);
    });

    it('should work with SimpleDB fallback', async () => {
      // Set user as admin for delete
      mockRequireAuth.mockImplementation((req, res, next) => {
        req.user = { id: 'test-user', role: 'admin' };
        next();
      });
      const mockSimpleDeleteBooking = jest.fn().mockReturnValue(mockBookings[0]);
      global.simpleDB = {
        deleteBooking: mockSimpleDeleteBooking,
      };

      const response = await request(app).delete('/api/bookings/BK001');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Booking removed');
    });
  });
});
