const Review = require('../models/Review');
const Book = require('../models/Book');

const reviewController = {
    // 1. Thêm Review (Sửa để nhận HTML và star)
    postReview: async (req, res) => {
        try {
            const userId = req.user.id || req.user._id;
            // Nhận star, content từ Frontend
            const { bookId, star, content } = req.body; 

            // Chặn spam: 1 người chỉ được review 1 lần/sách
            const existed = await Review.findOne({ user: userId, book: bookId });
            if (existed) {
                return res.status(400).json({ message: "Bạn đã đánh giá sách này rồi!" });
            }

            // Tạo mới
            const review = await Review.create({
                user: userId,
                book: bookId,
                star,     
                content  
            });

            // Populate thông tin user để frontend hiển thị ngay lập tức (avatar, tên)
            await review.populate('user', 'username avatar');

            // Tính lại điểm trung bình cho sách
            await reviewController.updateAverageRating(bookId);

            res.status(201).json(review);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2. Lấy Review theo Cursor (Nâng cấp quan trọng nhất)
    getReviewsByBook: async (req, res) => {
        try {
            const { bookId } = req.params;
            const { limit = 5, cursor } = req.query; // Nhận cursor từ query URL
            const limitNum = parseInt(limit);

            let query = { book: bookId };

            // Nếu có cursor, chỉ lấy những review cũ hơn
            if (cursor) {
                query.createdAt = { $lt: new Date(cursor) };
            }

            const reviews = await Review.find(query)
                .populate('user', 'fullname avatar') // Lấy tên và avatar người dùng
                .sort({ createdAt: -1 })             // Mới nhất lên đầu
                .limit(limitNum + 1);                // Lấy dư 1 cái để kiểm tra "còn nữa không"

            let nextCursor = null;
            let hasMore = false;

            // Kiểm tra xem có trang sau không
            if (reviews.length > limitNum) {
                hasMore = true;
                reviews.pop(); // Bỏ cái dư ra, chỉ trả về đúng limit
                nextCursor = reviews[reviews.length - 1].createdAt; // Lấy mốc thời gian của cái cuối cùng
            }

            // Trả về cấu trúc chuẩn cho Infinite Query
            res.json({
                reviews,
                nextCursor,
                hasMore
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 3. Tính điểm trung bình 
    updateAverageRating: async (bookId) => {
        const reviews = await Review.find({ book: bookId });

        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + r.star, 0); 
            avgRating = Math.round((sum / reviews.length) * 10) / 10;
        }

        await Book.findByIdAndUpdate(bookId, { averageRating: avgRating });
    },

    // 4. Xóa review
    deleteReview: async (req, res) => {
        try {
            const review = await Review.findById(req.params.id);
            if (!review) return res.status(404).json({ message: "Review không tồn tại" });

            if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
                return res.status(403).json({ message: "Không có quyền xóa" });
            }

            const bookId = review.book;
            await review.deleteOne();

            // Tính lại điểm trung bình
            await reviewController.updateAverageRating(bookId);

            res.json({ message: "Đã xóa đánh giá" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = reviewController;