const Review = require('../models/Review');
const Book = require('../models/Book');

const reviewController = {
    postReview: async (req, res) => {
        try {
            const userId = req.user.id || req.user._id;
            const { bookId, rating, comment } = req.body;

            // 1. Prevent duplicate review
            const existed = await Review.findOne({ user: userId, book: bookId });
            if (existed) {
                return res.status(400).json({ message: "Bạn đã review sách này rồi" });
            }

            // 2. Create review
            const review = await Review.create({
                user: userId,
                book: bookId,
                rating,
                comment
            });

            // Update average rating
            await reviewController.updateAverageRating(bookId);

            res.status(201).json(review);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getReviewsByBook: async (req, res) => {
        try {
            const { bookId } = req.params;

            const reviews = await Review.find({ book: bookId })
                .populate('user', 'fullname avatar')
                .sort({ reviewDate: -1 });

            res.json(reviews);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateAverageRating: async (bookId) => {
        const reviews = await Review.find({ book: bookId });

        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
            avgRating = Math.round((sum / reviews.length) * 10) / 10;
        }

        await Book.findByIdAndUpdate(bookId, { averageRating: avgRating });
    },

    deleteReview: async (req, res) => {
        try {
            const review = await Review.findById(req.params.id);
            if (!review) {
                return res.status(404).json({ message: "Review không tồn tại" });
            }

            // Permission check
            if (req.user.role !== 'admin' &&
                review.user.toString() !== req.user.id) {
                return res.status(403).json({ message: "Không có quyền xóa" });
            }

            const bookId = review.book;
            await review.deleteOne();

            await reviewController.updateAverageRating(bookId);

            res.json({ message: "Đã xóa review" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = reviewController;