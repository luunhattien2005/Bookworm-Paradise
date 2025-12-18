import { describe, it, expect, vi, beforeEach } from 'vitest';
import reviewController from '../backend/controllers/reviewController';
import Review from '../backend/models/Review';
import Book from '../backend/models/Book';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import accountController from '../backend/controllers/accountController';
import Account from '../backend/models/Account';

describe('Account Controller - Registration & Login', () => {
  let req, res;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('should prevent registration if the email (username) already exists', async () => {
    req = { 
      body: { username: 'test@gmail.com', password: '123', fullname: 'Test User' } 
    };
    
    // Mock existing user
    Account.findOne = vi.fn().mockResolvedValue({ username: 'test@gmail.com' });

    await accountController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email này đã tồn tại!" });
  });

  it('should block login for banned accounts', async () => {
    req = { body: { username: 'banned@gmail.com', password: '123' } };
    
    // Mock a user that is banned
    Account.findOne = vi.fn().mockResolvedValue({
      username: 'banned@gmail.com',
      password: '123',
      isBanned: true
    });

    await accountController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
      message: expect.stringContaining("đã bị khóa") 
    }));
  });
});

describe('Review Controller - postReview', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user1' },
      body: { bookId: 'book1', rating: 5, comment: 'Great read!' }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('should prevent a user from reviewing the same book twice', async () => {
    // Mocking Review.findOne to return an existing review
    Review.findOne = vi.fn().mockResolvedValue({ _id: 'existingReview' });

    await reviewController.postReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Bạn đã review sách này rồi" });
  });

  it('should calculate the average rating correctly', async () => {
    const bookId = 'book1';
    const mockReviews = [
      { rating: 5 },
      { rating: 4 }
    ];

    Review.find = vi.fn().mockResolvedValue(mockReviews);
    const updateSpy = vi.spyOn(Book, 'findByIdAndUpdate').mockResolvedValue({});

    await reviewController.updateAverageRating(bookId);

    // (5 + 4) / 2 = 4.5
    expect(updateSpy).toHaveBeenCalledWith(bookId, { averageRating: 4.5 });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import orderController from '../backend/controllers/orderController';
import Cart from '../backend/models/Cart';
import Order from '../backend/models/Order';
import Book from '../backend/models/Book';

describe('Order Controller - placeOrder', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: { 
        shippingAddress: '123 Book St', 
        paymentMethod: 'COD',
        deliveryNote: 'Handle with care'
      }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('should successfully place an order and update stock/sold counts', async () => {
    // 1. Mock Cart with populated items
    const mockCart = {
      user: 'user123',
      items: [
        { 
          book: { _id: 'book1', title: 'Vitest Guide', price: 20, stockQuantity: 10 }, 
          quantity: 2 
        }
      ],
      totalAmount: 40
    };

    Cart.findOne = vi.fn().mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockCart)
    });

    // 2. Mock Order Save
    vi.spyOn(Order.prototype, 'save').mockResolvedValue({ _id: 'order_new' });
    
    // 3. Mock Cart Delete
    Cart.findOneAndDelete = vi.fn().mockResolvedValue(true);

    // 4. Mock Book stock update
    const bookUpdateSpy = vi.spyOn(Book, 'findByIdAndUpdate').mockResolvedValue(true);

    await orderController.placeOrder(req, res);

    // Verify stock was decremented (-2) and soldQuantity incremented (+2)
    expect(bookUpdateSpy).toHaveBeenCalledWith('book1', {
      $inc: { stockQuantity: -2, soldQuantity: 2 }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Đặt hàng thành công!" }));
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import cartController from '../backend/controllers/cartController';
import Book from '../backend/models/Book';
import Cart from '../backend/models/Cart';

describe('Cart Controller - addToCart', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: { bookId: 'book1', quantity: 5 }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('should return 400 if requested quantity exceeds stockQuantity', async () => {
    // Mock a book with only 2 items in stock
    Book.findById = vi.fn().mockResolvedValue({
      _id: 'book1',
      title: 'Limited Book',
      stockQuantity: 2,
      isDeleted: false
    });

    // Mock that the user doesn't have a cart yet
    Cart.findOne = vi.fn().mockResolvedValue(null);

    await cartController.addToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: "Chỉ còn 2 quyển trong kho!" 
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import bookController from '../backend/controllers/bookController';
import Book from '../backend/models/Book';

describe('Book Controller - searchBooks', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { keyword: 'Potter' } };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it('should call Book.find with the correct case-insensitive regex', async () => {
    const mockBooks = [{ title: 'Harry Potter' }];
    const findSpy = vi.spyOn(Book, 'find').mockResolvedValue(mockBooks);

    await bookController.searchBooks(req, res);

    expect(findSpy).toHaveBeenCalledWith({
      title: { $regex: 'Potter', $options: 'i' },
      isDeleted: false
    });
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import wishlistController from '../backend/controllers/wishlistController';
import Wishlist from '../backend/models/Wishlist';

describe('Wishlist Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 'user123' } };
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };
    vi.clearAllMocks();
  });

  it('should return an empty array if the user has no wishlist', async () => {
    // Mock findOne with chainable populate returning null
    Wishlist.findOne = vi.fn().mockReturnValue({
      populate: vi.fn().mockResolvedValue(null)
    });

    await wishlistController.getWishlist(req, res);

    expect(res.json).toHaveBeenCalledWith({ books: [] });
  });
});