const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken); // Tất cả phải đăng nhập

// Giải quyết User
router.post('/place-order', orderController.placeOrder); // Đặt hàng
router.get('/my-orders', orderController.getMyOrders); // Xem lịch sử
router.get('/:id', orderController.getOrderDetail); // Xem chi tiết 1 đơn hàng

//Giai quyết Admin
router.get('/', verifyAdmin, orderController.getAllOrders); // Xem tất cả đơn hàng

module.exports = router;