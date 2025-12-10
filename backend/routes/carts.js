const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// Hàm middleware để lấy Giỏ hàng theo cartID (và populate các items)
async function getCart(req, res, next) {
    let cart;
    try {
        // Tìm giỏ hàng và populate thông tin sách (bookId)
        // Việc populate items.bookId giúp hiển thị tên và giá sách ngay trong giỏ hàng.
        cart = await Cart.findOne({ cartID: req.params.cartID })
                         .populate({
                             path: 'items.bookId',
                             select: 'bookID price' // Chỉ lấy các trường cần thiết của Book
                         });
                         
        if (cart == null) {
            return res.status(404).json({ message: 'Không tìm thấy Giỏ hàng này.' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.cart = cart;
    next();
}

// Lấy TẤT CẢ giỏ hàng (Chủ yếu dành cho Admin)
router.get("/", async (req, res) => {
    try {
        // Lấy tất cả giỏ hàng và populate các mặt hàng bên trong
        const carts = await Cart.find()
                                .populate('userId') // Lấy thông tin người dùng
                                .populate('items.bookId'); // Lấy thông tin sách
        res.json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin giỏ hàng chi tiết
router.get("/:cartID", getCart, (req, res) => {
    // getCart middleware đã xử lý logic và trả về res.cart
    res.json(res.cart);
});

// Tạo giỏ hàng mới (thường chỉ tạo khi người dùng đăng ký hoặc lần đầu truy cập)
router.post("/", async (req, res) => {
    // Chỉ cần cartID và userId là bắt buộc
    const cart = new Cart({
        cartID: req.body.cartID,
        userId: req.body.userId, // ID của người dùng (Customer)
    });

    try {
        const newCart = await cart.save();
        res.status(201).json({ message: "Tạo giỏ hàng thành công!", cart: newCart });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Thêm sách vào giỏ hàng HOẶC cập nhật số lượng sách đã có
router.patch("/:cartID/item", getCart, async (req, res) => {
    const { bookId, quantity } = req.body;

    if (!bookId || quantity == null || quantity < 1) {
        return res.status(400).json({ message: "Thiếu bookId hoặc quantity không hợp lệ." });
    }

    try {
        // 1. Tìm xem sách đã có trong giỏ hàng chưa
        const itemIndex = res.cart.items.findIndex(item => item.bookId.toString() === bookId);

        if (itemIndex > -1) {
            // Cập nhật số lượng (Nếu sách đã tồn tại)
            res.cart.items[itemIndex].quantity = quantity;
        } else {
            // Thêm mục mới vào giỏ hàng
            res.cart.items.push({ 
                bookId: new mongoose.Types.ObjectId(bookId), 
                quantity: quantity 
            });
        }
        
        // *LƯU Ý: Logic tính toán subTotal và totalAmount nên được thực hiện ở đây (hoặc dùng Mongoose hooks)
        // Hiện tại ta chỉ lưu và để client/hook xử lý tính toán.

        const updatedCart = await res.cart.save();
        res.json({ message: "Cập nhật giỏ hàng thành công.", cart: updatedCart });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ===================================
// Xóa một sách cụ thể khỏi giỏ hàng
router.delete("/:cartID/item/:bookId", getCart, async (req, res) => {
    const { bookId } = req.params;

    try {
        // Sử dụng $pull để xóa sub-document trong mảng
        const result = await Cart.updateOne(
            { cartID: req.params.cartID },
            { $pull: { items: { bookId: bookId } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mặt hàng này trong giỏ hàng.' });
        }
        
        // Tải lại giỏ hàng để đảm bảo totalAmount được tính lại (nếu có hook)
        const updatedCart = await Cart.findOne({ cartID: req.params.cartID }); 

        res.json({ message: 'Xóa mặt hàng khỏi giỏ hàng thành công.', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa tất cả mặt hàng trong giỏ hàng
router.delete("/:cartID/clear", getCart, async (req, res) => {
    try {
        res.cart.items = []; // Đặt mảng items thành rỗng
        res.cart.totalAmount = 0; // Đặt totalAmount về 0

        const clearedCart = await res.cart.save();
        res.json({ message: 'Giỏ hàng đã được làm sạch.', cart: clearedCart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;