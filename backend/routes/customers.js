const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// Hàm middleware để lấy Khách hàng theo ID và populate Account
async function getCustomer(req, res, next) {
    let customer;
    try {
        // Tìm khách hàng theo ID và populate thông tin Account liên quan
        customer = await Customer.findById(req.params.id)
                         .populate({
                             path: 'accountId',
                             // KHÔNG BAO GỒM mật khẩu khi lấy thông tin Account
                             select: '-password'
                         });
                         
        if (customer == null) {
            return res.status(404).json({ message: 'Không tìm thấy hồ sơ khách hàng này.' });
        }
    } catch (err) {
        // Lỗi 500 nếu ID không hợp lệ hoặc lỗi database
        if (err.kind === 'ObjectId') {
             return res.status(400).json({ message: 'ID khách hàng không hợp lệ.' });
        }
        return res.status(500).json({ message: err.message });
    }

    res.customer = customer;
    next();
}

// Lấy tất cả hồ sơ khách hàng (có populate thông tin Account)
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find()
                                .populate({
                                    path: 'accountId',
                                    select: '-password' // Loại bỏ mật khẩu
                                });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin một hồ sơ khách hàng cụ thể (sử dụng _id của Customer)
router.get("/:id", getCustomer, (req, res) => {
    res.json(res.customer);
});

// Tạo hồ sơ khách hàng mới
router.post("/", async (req, res) => {
    // Chỉ cần accountId là bắt buộc
    const customer = new Customer({
        accountId: req.body.accountId, // ID của Account đã được tạo
        statusUser: req.body.statusUser || true,
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json({ message: "Tạo hồ sơ khách hàng thành công!", customer: newCustomer });
    } catch (err) {
        // Lỗi 400 cho Validation hoặc Duplicate Key
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật trạng thái hoạt động của khách hàng
router.patch("/:id", getCustomer, async (req, res) => {
    // Chỉ cập nhật statusUser (vì accountId là trường cố định)
    if (req.body.statusUser != null) {
        res.customer.statusUser = req.body.statusUser;
    } else {
         return res.status(400).json({ message: 'Không có trường statusUser mới để cập nhật.' });
    }

    try {
        const updatedCustomer = await res.customer.save();
        res.json({ message: "Cập nhật trạng thái khách hàng thành công!", customer: updatedCustomer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Vô hiệu hóa (Deactivate) hồ sơ khách hàng
router.delete("/:id", getCustomer, async (req, res) => {
    try {
        // Thay vì xóa cứng, chúng ta chỉ đặt statusUser = false
        res.customer.statusUser = false;
        await res.customer.save();
        res.json({ message: 'Vô hiệu hóa hồ sơ khách hàng thành công (statusUser = false).' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;