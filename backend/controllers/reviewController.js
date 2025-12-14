const Review = require('../models/Review');
const Book = require('../models/Book');

const reviewController = {

    // 1. Lấy danh sách review của 1 cuốn sách
    getReviewsByBook: async (req, res) => {
        try {
            const reviews = await Review.find({ book: req.params.bookId })
                .populate('user', 'fullname avatar') // Lấy tên và avatar người review
                .sort({ createdAt: -1 }); // Mới nhất lên đầu

            res.json(reviews);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = reviewController;