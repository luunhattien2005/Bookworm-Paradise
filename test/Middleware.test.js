import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyAdmin } from '../backend/middleware/authMiddleware';
import jwt from 'jsonwebtoken';

describe('Auth Middleware - verifyAdmin', () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('should block access (403) if the user is authenticated but NOT an admin', () => {
    // 1. Mock the header to pass the "if (!token)" check
    req = { 
      header: vi.fn().mockReturnValue('Bearer fake_token'),
    };

    // 2. Mock jwt.verify to return a valid user but with 'customer' role
    // This prevents the 400 error and moves the code to the role check
    vi.spyOn(jwt, 'verify').mockReturnValue({ id: 'user1', role: 'customer' });

    verifyAdmin(req, res, next);

    // Now it should correctly expect 403
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ 
        message: "Bạn không có quyền thực hiện hành động này!" 
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow access (next) if the user is an admin', () => {
    req = { 
      header: vi.fn().mockReturnValue('Bearer fake_token'),
    };

    // Mock jwt.verify to return an admin user
    vi.spyOn(jwt, 'verify').mockReturnValue({ id: 'admin1', role: 'admin' });

    verifyAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});