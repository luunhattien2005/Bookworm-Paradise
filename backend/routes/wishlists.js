const router = require('express').Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/authMiddleware');

// Tất cả các route trong wishlist đều cần đăng nhập
router.use(verifyToken);

router.get('/', wishlistController.getWishlist);
router.post('/add', wishlistController.addBook);

module.exports = router;