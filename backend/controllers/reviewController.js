const Review = require('../models/Review');
const Book = require('../models/Book');

const reviewController = {

    //Lấy danh sách review của 1 cuốn sách
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
    // Đăng review cho sách
    postReview: async (req, res) => {
        try {
            const userId = req.user.id;
            const { bookId, rating, comment } = req.body;

            // Kiểm tra xem đã review chưa (Mỗi người chỉ review 1 lần/sách)
            const existingReview = await Review.findOne({ user: userId, book: bookId });
            if (existingReview) {
                return res.status(400).json({ message: "Bạn đã đánh giá sách này rồi!" });
            }

            // Tạo review mới
            const newReview = new Review({
                user: userId,
                book: bookId,
                rating: Number(rating),
                comment
            });
            await newReview.save();

            // Tính điểm trung bình cho sách
            const reviews = await Review.find({ book: bookId });
            // Cộng tổng số sao
            const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
            // Chia trung bình (lấy 1 số thập phân)
            const avgRating = (totalRating / reviews.length).toFixed(1);

            // Cập nhật vào bảng Book
            await Book.findByIdAndUpdate(bookId, { averageRating: avgRating });

            res.status(201).json({ message: "Đánh giá thành công!", review: newReview });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = reviewController;