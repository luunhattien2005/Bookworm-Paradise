const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Hàm middleware để lấy Đánh giá theo reviewID và populate
async function getReview(req, res, next) {
    let review;
    try {
        // Tìm đánh giá theo reviewID và populate thông tin Customer và Book
        review = await Review.findOne({ reviewID: req.params.reviewID })
                             .populate('userId', 'accountId') // Lấy ID tài khoản của người đánh giá
                             .populate('bookId', 'bookID');    // Lấy ID sách được đánh giá
                         
        if (review == null) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá này.' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.review = review;
    next();
}

// Lấy TẤT CẢ đánh giá (Chủ yếu dành cho Admin)
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find()
                                    .populate('userId', 'accountId') 
                                    .populate('bookId', 'bookID') 
                                    .sort({ reviewDate: -1 }); // Sắp xếp theo ngày mới nhất

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy tất cả đánh giá cho một cuốn sách cụ thể
router.get("/book/:bookId", async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId })
                                    .populate('userId', 'accountId') // Chỉ lấy thông tin người dùng cần thiết
                                    .sort({ reviewDate: -1 }); // Sắp xếp đánh giá mới nhất lên đầu

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'Cuốn sách này chưa có đánh giá nào.' });
        }
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin chi tiết một đánh giá
router.get("/:reviewID", getReview, (req, res) => {
    res.json(res.review);
});

// Tạo đánh giá mới
router.post("/", async (req, res) => {
    const review = new Review({
        reviewID: req.body.reviewID,
        userId: req.body.userId,
        bookId: req.body.bookId,
        rating: req.body.rating,
        comment: req.body.comment,
        // reviewDate sẽ tự động lấy mặc định
    });

    try {
        // *LƯU Ý: Nên kiểm tra xem người dùng đã mua sách/đã đánh giá sách này chưa trước khi lưu.

        const newReview = await review.save();
        res.status(201).json({ message: "Đánh giá sách thành công!", review: newReview });
    } catch (err) {
        // Lỗi 400 cho Validation (rating ngoài phạm vi) hoặc Duplicate Key (reviewID đã tồn tại)
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật rating hoặc comment của đánh giá
router.patch("/:reviewID", getReview, async (req, res) => {
    // Chỉ cập nhật rating và comment
    if (req.body.rating != null) res.review.rating = req.body.rating;
    if (req.body.comment != null) res.review.comment = req.body.comment;

    // *LƯU Ý: Cần thêm logic kiểm tra xem người dùng đang thực hiện request có phải là chủ nhân của đánh giá không.
    
    try {
        const updatedReview = await res.review.save();
        res.json({ message: "Cập nhật đánh giá thành công!", review: updatedReview });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa đánh giá
router.delete("/:reviewID", getReview, async (req, res) => {
    // *LƯU Ý: Cần thêm logic kiểm tra xem người dùng đang thực hiện request có phải là chủ nhân của đánh giá không.

    try {
        await res.review.deleteOne();
        res.json({ message: 'Xóa đánh giá thành công.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;