import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { generateTestToken } from '../utils.js';

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('requireAuth', () => {
    it('should call next() when valid token is provided', () => {
      const token = generateTestToken();
      mockReq.headers.authorization = `Bearer ${token}`;

      requireAuth(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.username).toBe('testuser');
    });

    it('should return 401 when no authorization header is provided', () => {
      requireAuth(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Authentication required' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Bearer', () => {
      mockReq.headers.authorization = 'Basic dGVzdDp0ZXN0';

      requireAuth(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Authentication required' });
    });

    it('should return 500 when JWT_SECRET is not configured', () => {
      const originalSecret = process.env.JWT_SECRET;
      process.env.JWT_SECRET = '';

      const token = jwt.sign({ test: 'data' }, 'temp-secret');
      mockReq.headers.authorization = `Bearer ${token}`;

      requireAuth(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'JWT secret is not configured' });

      process.env.JWT_SECRET = originalSecret;
    });

    it('should return 401 when token is invalid', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      requireAuth(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    });

    it('should return 401 when token is expired', () => {
      const expiredToken = jwt.sign(
        { id: 'test', username: 'test', role: 'employee', name: 'Test' },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      );
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      requireAuth(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    });
  });

  describe('requireRole', () => {
    it('should call next() when user has required role', () => {
      mockReq.user = { role: 'admin' };

      const requireAdmin = requireRole('admin');
      requireAdmin(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', () => {
      mockReq.user = { role: 'employee' };

      const requireAdmin = requireRole('admin');
      requireAdmin(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Insufficient permissions' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', () => {
      mockReq.user = null;

      const requireAdmin = requireRole('admin');
      requireAdmin(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Authentication required' });
    });

    it('should work with employee role', () => {
      mockReq.user = { role: 'employee' };

      const requireEmployee = requireRole('employee');
      requireEmployee(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
