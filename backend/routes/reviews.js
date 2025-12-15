const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

//  Xem review của sách (Param là BookID)
router.get('/:bookId', reviewController.getReviewsByBook);

// Đăng review cho sách (Cần đăng nhập)
router.post('/', verifyToken, reviewController.postReview);