const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all reviews of a book
// GET /books/:bookId/reviews
router.get('/:bookId/reviews', reviewController.getReviewsByBook);

// Post a review for a book (must be logged in)
// POST /books/:bookId/reviews
router.post('/:bookId/reviews', verifyToken, (req, res) => {
    // ensure bookId comes from URL, not client body
    req.body.bookId = req.params.bookId;
    reviewController.postReview(req, res);
});

// Delete a review (owner or admin)
// DELETE /books/reviews/:id
router.delete('/reviews/:id', verifyToken, reviewController.deleteReview);

module.exports = router;