const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

// Lấy TẤT CẢ các mục Wishlist từ database (Chủ yếu dành cho Admin)
router.get("/", async (req, res) => {
    try {
        const allWishlistItems = await Wishlist.find()
                                                .populate('userId')
                                                .populate('bookId');
        
        if (allWishlistItems.length === 0) {
            return res.status(404).json({ message: 'Không có mục Wishlist nào trong hệ thống.' });
        }
        res.json(allWishlistItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy TẤT CẢ các mục Wishlist của một người dùng
// Sẽ trả về một mảng các tài liệu Wishlist
router.get("/user/:userId", async (req, res) => {
    try {
        const wishlists = await Wishlist.find({ userId: req.params.userId })
                                        .populate('userId')
                                        .populate('bookId');
                                        
        if (wishlists.length === 0) {
            return res.status(404).json({ message: 'Người dùng này chưa có mục yêu thích nào.' });
        }
        res.json(wishlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm một cuốn sách vào Wishlist (tạo một document Wishlist mới)
router.post("/", async (req, res) => {
    const { wishlistID, userId, bookId } = req.body;

    // Kiểm tra xem cuốn sách này đã có trong danh sách của người dùng chưa
    const existingItem = await Wishlist.findOne({ userId, bookId });
    if (existingItem) {
        return res.status(409).json({ message: 'Sách này đã có trong danh sách yêu thích của bạn.' });
    }

    const newWishlist = new Wishlist({
        wishlistID,
        userId,
        bookId
    });

    try {
        const savedItem = await newWishlist.save();
        res.status(201).json({ message: "Thêm sách vào Wishlist thành công!", item: savedItem });
    } catch (err) {
        // Lỗi 400 cho Validation hoặc Duplicate Key (wishlistID đã tồn tại)
        res.status(400).json({ message: err.message });
    }
});

// Xóa một cuốn sách khỏi Wishlist dựa trên wishlistID (ID của document)
router.delete("/:wishlistID", async (req, res) => {
    try {
        const result = await Wishlist.findOneAndDelete({ wishlistID: req.params.wishlistID });

        if (!result) {
            return res.status(404).json({ message: 'Không tìm thấy mục Wishlist này để xóa.' });
        }
        res.json({ message: 'Xóa mục Wishlist thành công.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Kiểm tra xem một cuốn sách đã được người dùng thêm vào Wishlist chưa
router.get("/check", async (req, res) => {
    const { userId, bookId } = req.query;

    if (!userId || !bookId) {
        return res.status(400).json({ message: 'Thiếu userId hoặc bookId.' });
    }

    try {
        const item = await Wishlist.findOne({ userId, bookId });

        if (item) {
            return res.json({ isWished: true, wishlistID: item.wishlistID });
        } else {
            return res.json({ isWished: false });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;