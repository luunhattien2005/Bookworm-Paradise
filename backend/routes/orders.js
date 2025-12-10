const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Hàm middleware để lấy Đơn hàng theo orderID và populate
async function getOrder(req, res, next) {
    let order;
    try {
        // Tìm đơn hàng và populate thông tin Customer và Book
        order = await Order.findOne({ orderID: req.params.orderID })
                         .populate('userId')           // Lấy thông tin Customer
                         .populate('items.bookId');    // Lấy thông tin chi tiết của sách trong items
                         
        if (order == null) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng này.' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.order = order;
    next();
}

// Lấy tất cả đơn hàng
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
                                .populate('userId')
                                .populate('items.bookId')
                                .sort({ orderDate: -1 }); // Sắp xếp đơn hàng mới nhất lên đầu
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin một đơn hàng cụ thể
router.get("/:orderID", getOrder, (req, res) => {
    res.json(res.order);
});

// Lấy tất cả đơn hàng của một người dùng cụ thể
router.get("/user/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
                                .populate('items.bookId')
                                .sort({ orderDate: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào cho người dùng này.' });
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo đơn hàng mới (Dữ liệu items, price, subTotal phải được tính toán chính xác từ server)
router.post("/", async (req, res) => {
    const order = new Order(req.body); // Lấy toàn bộ body

    try {
        // LƯU Ý QUAN TRỌNG: Trước khi save, bạn PHẢI:
        // 1. Kiểm tra tồn kho (stockQuantity)
        // 2. Tính toán lại totalAmount trên server (dựa trên giá hiện tại của Book)
        
        const newOrder = await order.save();
        res.status(201).json({ message: "Tạo đơn hàng thành công!", order: newOrder });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật trạng thái vận chuyển (Chủ yếu dành cho Admin)
router.patch("/:orderID/status", getOrder, async (req, res) => {
    if (req.body.shippingStatus == null) {
        return res.status(400).json({ message: 'Cần cung cấp trường shippingStatus mới.' });
    }
    
    // Kiểm tra xem trạng thái mới có hợp lệ theo enum không
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(req.body.shippingStatus)) {
        return res.status(400).json({ message: `Trạng thái không hợp lệ. Phải là một trong: ${validStatuses.join(', ')}` });
    }

    try {
        res.order.shippingStatus = req.body.shippingStatus;
        const updatedOrder = await res.order.save();
        res.json({ message: `Cập nhật trạng thái đơn hàng thành: ${updatedOrder.shippingStatus}`, order: updatedOrder });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Hủy đơn hàng (thường là set status thành 'Cancelled' thay vì xóa)
router.delete("/:orderID", getOrder, async (req, res) => {
    try {
        if (res.order.shippingStatus === 'Delivered' || res.order.shippingStatus === 'Cancelled') {
            return res.status(400).json({ message: `Không thể hủy đơn hàng ở trạng thái ${res.order.shippingStatus}.` });
        }
        
        // Thực hiện hủy đơn hàng (soft delete logic)
        res.order.shippingStatus = 'Cancelled';
        await res.order.save();
        
        // *LƯU Ý: Cần bổ sung logic hoàn trả tồn kho (stockQuantity) tại đây.

        res.json({ message: 'Hủy đơn hàng thành công.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;