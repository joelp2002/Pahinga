import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Generate a test JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
export const generateTestToken = (payload = {}) => {
  const defaultPayload = {
    id: 'test-user-id',
    username: 'testuser',
    role: 'employee',
    name: 'Test User',
    ...payload,
  };
  return jwt.sign(defaultPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Create authorization header with Bearer token
 * @param {string} token - JWT token
 * @returns {Object} Headers object
 */
export const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * Generate a hashed password for testing
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Mock user data for testing
 */
export const mockUsers = {
  admin: {
    _id: 'admin-id-123',
    username: 'admin',
    password: hashPassword('admin123'),
    role: 'admin',
    name: 'Admin User',
  },
  employee: {
    _id: 'employee-id-123',
    username: 'employee',
    password: hashPassword('employee123'),
    role: 'employee',
    name: 'Employee User',
  },
};

/**
 * Mock service data for testing
 */
export const mockServices = [
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
];

/**
 * Mock booking data for testing
 */
export const mockBookings = [
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
];
