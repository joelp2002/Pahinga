import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create mock functions
const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();

// Mock the User model
jest.unstable_mockModule('../../models/User.js', () => ({
  default: {
    findOne: mockUserFindOne,
    create: mockUserCreate,
  },
}));

const { default: User } = await import('../../models/User.js');
const { default: authRoutes } = await import('../../routes/auth.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete global.simpleDB;
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      mockUserFindOne.mockResolvedValue({
        _id: 'user-id-123',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toEqual({
        username: 'admin',
        role: 'admin',
        name: 'Admin User',
      });
    });

    it('should return 400 when username or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password are required');
    });

    it('should return 401 when user is not found', async () => {
      mockUserFindOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password');
    });

    it('should return 401 when password is incorrect', async () => {
      const hashedPassword = bcrypt.hashSync('correctpassword', 10);
      mockUserFindOne.mockResolvedValue({
        _id: 'user-id-123',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password');
    });

    it('should return 500 when JWT_SECRET is not configured', async () => {
      const originalSecret = process.env.JWT_SECRET;
      process.env.JWT_SECRET = '';

      const hashedPassword = bcrypt.hashSync('admin123', 10);
      mockUserFindOne.mockResolvedValue({
        _id: 'user-id-123',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('JWT secret is not configured');

      process.env.JWT_SECRET = originalSecret;
    });

    it('should work with SimpleDB fallback', async () => {
      global.simpleDB = {
        findUser: jest.fn().mockReturnValue({
          _id: 'user-id-123',
          username: 'admin',
          password: bcrypt.hashSync('admin123', 10),
          role: 'admin',
          name: 'Admin User',
        }),
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      mockUserFindOne.mockResolvedValue(null);
      mockUserCreate.mockResolvedValue({
        _id: 'new-user-id',
        username: 'newuser',
        role: 'employee',
        name: 'New User',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
          name: 'New User',
          role: 'employee',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toEqual({
        username: 'newuser',
        role: 'employee',
        name: 'New User',
      });
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newuser' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username, password, and name are required');
    });

    it('should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'short',
          name: 'New User',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password must be at least 6 characters');
    });

    it('should return 409 when username already exists', async () => {
      mockUserFindOne.mockResolvedValue({ username: 'existinguser' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existinguser',
          password: 'password123',
          name: 'Existing User',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Username already exists');
    });

    it('should create admin user when role is admin', async () => {
      mockUserFindOne.mockResolvedValue(null);
      mockUserCreate.mockResolvedValue({
        _id: 'admin-id',
        username: 'newadmin',
        role: 'admin',
        name: 'New Admin',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newadmin',
          password: 'password123',
          name: 'New Admin',
          role: 'admin',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe('admin');
    });

    it('should default to employee role when invalid role is provided', async () => {
      mockUserFindOne.mockResolvedValue(null);
      mockUserCreate.mockResolvedValue({
        _id: 'user-id',
        username: 'newuser',
        role: 'employee',
        name: 'New User',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
          name: 'New User',
          role: 'invalid_role',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe('employee');
    });

    it('should work with SimpleDB fallback', async () => {
      global.simpleDB = {
        findUser: jest.fn().mockReturnValue(null),
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'simpleuser',
          password: 'password123',
          name: 'Simple User',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return 409 when username exists in SimpleDB', async () => {
      global.simpleDB = {
        findUser: jest.fn().mockReturnValue({ username: 'existing' }),
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existing',
          password: 'password123',
          name: 'Existing',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Username already exists');
    });
  });
});
