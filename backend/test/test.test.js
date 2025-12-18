import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('Wishlist Routes', () => {
  let app;
  let mockController;

  beforeEach(async () => {
    // 1. Xóa cache module để đảm bảo nạp bản Mock mới
    vi.resetModules();

    // 2. Mock Middleware để "thông quan" lỗi 401
    vi.doMock('../middleware/authMiddleware', () => ({
      verifyToken: (req, res, next) => {
        req.user = { id: 'user123' }; // Giả lập user hợp lệ
        next(); 
      },
      verifyAdmin: (req, res, next) => next()
    }));

    // 3. Mock Controller trả về 200 để tránh Timeout
    mockController = {
      getWishlist: vi.fn((req, res) => res.status(200).json({ books: [] })),
      addBook: vi.fn((req, res) => res.status(201).json({ message: "OK" })),
      removeBook: vi.fn((req, res) => res.status(200).json({ message: "Deleted" }))
    };
    vi.doMock('../controllers/wishlistController', () => mockController);

    // 4. Nạp router bằng dynamic import SAU KHI đã mock
    const wishlistRouter = (await import('../routes/wishlists')).default;

    app = express();
    app.use(express.json());
    app.use('/wishlist', wishlistRouter);
  });

  it('GET / should call getWishlist and return 200', async () => {
    const res = await request(app).get('/wishlist');
    
    // Nếu vẫn là 401, hãy kiểm tra xem file wishlists.js có require sai đường dẫn middleware không
    expect(res.status).toBe(200);
    expect(mockController.getWishlist).toHaveBeenCalled();
  });
});