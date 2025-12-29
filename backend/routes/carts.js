const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

// Phải đăng nhập mới có giỏ hàng
router.use(verifyToken);

// Xem giỏ
router.get('/', cartController.getCart);

// Thêm vào giỏ (Body: { bookId, quantity })
router.post('/add', cartController.addToCart);

// Cập nhật số lượng (Body: { bookId, quantity }) - Dùng cho nút tăng giảm
router.put('/update', cartController.updateItemQuantity);

// Xóa 1 món (Param: bookId)
router.delete('/remove/:bookId', cartController.removeItem);

// Xóa toàn bộ sản phẩm trong giỏ hàng (vẫn giữ lại giỏ hàng)
router.delete('/clear', cartController.clearCart);

module.exports = router;