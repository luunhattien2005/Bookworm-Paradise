const Wishlist = require('../models/Wishlist');

const wishlistController = {

    getWishlist: async (req, res) => {
        try {
            let wishlist = await Wishlist.findOne({ user: req.user.id })
                .populate('books', 'title price coverImage author'); 

            if (!wishlist) {
                return res.json({ books: [] });
            }

            res.json(wishlist);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    addBook: async (req, res) => {
        try {
            const { bookId } = req.body; 

            // $addToSet: Chỉ thêm nếu chưa có (Tránh trùng lặp)
            const wishlist = await Wishlist.findOneAndUpdate(
                { user: req.user.id },
                { $addToSet: { books: bookId } },
                { new: true, upsert: true } 
            );

            res.json({ message: "Đã thêm vào danh sách yêu thích", wishlist });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = wishlistController;s