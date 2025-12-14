const Cart = require('../models/Cart');
const Book = require('../models/Book');

const cartController = {

    // 1. Xem giỏ hàng (Tính toán lại giá luôn cho chắc ăn)
    getCart: async (req, res) => {
        try {
            const userId = req.user.id;
            let cart = await Cart.findOne({ user: userId })
                .populate('items.book', 'title price coverImage stockQuantity'); // Lấy chi tiết sách

            if (!cart) {
                return res.json({ items: [], totalAmount: 0 });
            }

            res.json(cart);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2. Thêm vào giỏ (Logic phức tạp nhất)
    addToCart: async (req, res) => {
        try {
            const userId = req.user.id;
            const { bookId, quantity } = req.body; // Frontend gửi: { bookId: "...", quantity: 1 }

            const qty = parseInt(quantity);
            if (qty <= 0) return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });

            // a. Lấy thông tin sách (để lấy giá và check tồn kho)
            const book = await Book.findById(bookId);
            if (!book) return res.status(404).json({ message: "Sách không tồn tại!" });
            if (book.isDeleted) return res.status(400).json({ message: "Sách này đã ngừng kinh doanh!" });

            // b. Tìm giỏ hàng của user
            let cart = await Cart.findOne({ user: userId });

            // c. Nếu chưa có giỏ -> Tạo mới
            if (!cart) {
                // Check tồn kho trước khi tạo
                if (qty > book.stockQuantity) {
                    return res.status(400).json({ message: `Chỉ còn ${book.stockQuantity} quyển trong kho!` });
                }

                cart = new Cart({
                    user: userId,
                    items: [{ 
                        book: bookId, 
                        quantity: qty,
                        subTotal: book.price * qty // Lưu subTotal dòng này
                    }],
                    totalAmount: book.price * qty
                });
            } 
            // d. Nếu đã có giỏ -> Cập nhật
            else {
                const itemIndex = cart.items.findIndex(p => p.book.toString() === bookId);

                if (itemIndex > -1) {
                    // Sách đã có trong giỏ -> Cộng dồn số lượng
                    const newQty = cart.items[itemIndex].quantity + qty;

                    // Check tồn kho
                    if (newQty > book.stockQuantity) {
                        return res.status(400).json({ message: `Kho chỉ còn ${book.stockQuantity} quyển! (Bạn đã có ${cart.items[itemIndex].quantity} trong giỏ)` });
                    }

                    cart.items[itemIndex].quantity = newQty;
                    cart.items[itemIndex].subTotal = newQty * book.price;
                } else {
                    // Sách chưa có -> Push vào mảng
                    if (qty > book.stockQuantity) {
                        return res.status(400).json({ message: `Chỉ còn ${book.stockQuantity} quyển trong kho!` });
                    }

                    cart.items.push({ 
                        book: bookId, 
                        quantity: qty,
                        subTotal: qty * book.price 
                    });
                }

                // e. TÍNH LẠI TỔNG TIỀN (QUAN TRỌNG)
                // Cộng tổng tất cả subTotal của các item lại
                cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
            }

            await cart.save();
            // Populate để trả về dữ liệu đẹp luôn
            await cart.populate('items.book', 'title price coverImage');
            
            res.json({ message: "Đã thêm vào giỏ hàng", cart });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 3. Cập nhật số lượng (Khi user bấm nút + / - trong giỏ)
    updateItemQuantity: async (req, res) => {
        try {
            const userId = req.user.id;
            const { bookId, quantity } = req.body; // quantity là số lượng MỚI (ví dụ: đang 2 sửa thành 3)
            const newQty = parseInt(quantity);

            if (newQty <= 0) return res.status(400).json({ message: "Số lượng không hợp lệ" });

            let cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });

            const itemIndex = cart.items.findIndex(p => p.book.toString() === bookId);
            if (itemIndex === -1) return res.status(404).json({ message: "Sách không có trong giỏ" });

            // Check tồn kho
            const book = await Book.findById(bookId);
            if (newQty > book.stockQuantity) {
                return res.status(400).json({ message: `Kho chỉ còn ${book.stockQuantity} quyển!` });
            }

            // Cập nhật
            cart.items[itemIndex].quantity = newQty;
            cart.items[itemIndex].subTotal = newQty * book.price;

            // Tính lại tổng tiền
            cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subTotal, 0);

            await cart.save();
            await cart.populate('items.book', 'title price coverImage');
            res.json(cart);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 4. Xóa 1 sản phẩm khỏi giỏ
    removeItem: async (req, res) => {
        try {
            const userId = req.user.id;
            const { bookId } = req.params;

            let cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });

            // Lọc bỏ item đó ra khỏi mảng
            cart.items = cart.items.filter(item => item.book.toString() !== bookId);

            // Tính lại tổng tiền
            // (Phải check xem giỏ còn món nào không, nếu không thì total = 0)
            if (cart.items.length > 0) {
                cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
            } else {
                cart.totalAmount = 0;
            }

            await cart.save();
            await cart.populate('items.book', 'title price coverImage');
            res.json({ message: "Đã xóa sản phẩm", cart });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = cartController;