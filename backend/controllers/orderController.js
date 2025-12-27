const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Book = require('../models/Book');

const orderController = {

    // Đặt hàng
    placeOrder: async (req, res) => {
        try {
            const userId = req.user.id;
            const { shippingAddress, paymentMethod, deliveryNote, shippingMethod, shippingFee } = req.body;

            if (!shippingMethod || shippingFee == null) {
                return res.status(400).json({ message: "Thiếu thông tin về phương thức vận chuyển" });
            }

            // Lấy giỏ hàng của user
            const cart = await Cart.findOne({ user: userId }).populate('items.book');
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: "Giỏ hàng trống, không thể đặt hàng!" });
            }

            // Kiểm tra tồn kho lần cuối (đề phòng lúc thêm vào giỏ thì còn, lúc mua thì hết)
            for (const item of cart.items) {
                if (item.quantity > item.book.stockQuantity) {
                    // SỬA: item.book.title -> item.book.name
                    return res.status(400).json({ 
                        message: `Sách "${item.book.name}" không đủ hàng (Còn: ${item.book.stockQuantity})` 
                    });
                }
            }

            // Tạo danh sách item cho Order (Lưu cứng giá tại thời điểm mua)
            const orderItems = cart.items.map(item => ({
                book: item.book._id,
                quantity: item.quantity,
                price: item.book.price // Lưu giá cứng
            }));

            // Tạo Order mới
            const newOrder = new Order({
                user: userId,
                items: orderItems,
                cartAmount: cart.totalAmount, 
                paymentMethod,
                shippingAddress,
                shippingMethod,
                shippingFee,
                totalAmount: cart.totalAmount + shippingFee,
                deliveryNote
            });

            // Trừ kho và Xóa giỏ hàng
            // (Dùng Promise.all để chạy song song cho nhanh)
            await Promise.all([
                newOrder.save(), // 1. Lưu đơn
                Cart.findOneAndDelete({ user: userId }), // Xóa giỏ
                // Trừ số lượng tồn kho của từng cuốn sách
                ...cart.items.map(item =>
                    Book.findByIdAndUpdate(item.book._id, {
                        $inc: {
                            stockQuantity: -item.quantity,
                            soldQuantity: +item.quantity // Tăng số lượng đã bán
                        }
                    })
                )
            ]);

            res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    // Lấy lịch sử đơn hàng của User
    getMyOrders: async (req, res) => {
        try {
            const orders = await Order.find({ user: req.user.id })
                // SỬA: title -> name, coverImage -> imgURL
                .populate('items.book', 'name imgURL') 
                .sort({ createdAt: -1 });
            res.json(orders);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Lấy chi tiết 1 đơn hàng
    getOrderDetail: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
                .populate('user', 'fullname email phone')
                // SỬA: title -> name, coverImage -> imgURL
                .populate('items.book', 'name imgURL price'); 
            
            if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            res.json(order);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Lấy tất cả đơn hàng (Admin quản lý)
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find()
                .populate('user', 'fullname')
                .sort({ createdAt: -1 });
            res.json(orders);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = orderController;