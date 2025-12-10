const express = require("express");
const router = express.Router();
const Account = require("../models/Account");

// Lấy tất cả tài khoản
router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find().select('-password'); // KHÔNG trả về mật khẩu
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy tài khoản theo UserID cụ thể
router.get("/:userID", async (req, res) => {
    try {
        const account = await Account.findOne({ UserID: req.params.userID }).select('-password');
        
        if (account == null) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản này.' });
        }
        res.json(account);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Tạo tài khoản mới (cần có body chứa UserID, username, password, fullname)
router.post("/", async (req, res) => {
    // Lưu ý: Trong ứng dụng thực tế, bạn PHẢI HASH (băm) mật khẩu trước khi lưu.
    const account = new Account({
        UserID: req.body.UserID,
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role || 'customer' // Mặc định là 'customer'
    });

    try {
        const newAccount = await account.save();
        res.status(201).json({ message: "Tạo tài khoản thành công!", account: newAccount });
    } catch (err) {
        // Lỗi 400 thường dành cho lỗi nhập liệu (validation error) hoặc unique key
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật thông tin tài khoản theo UserID
router.patch("/:userID", async (req, res) => {
    try {
        const account = await Account.findOne({ UserID: req.params.userID });
        if (account == null) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản để cập nhật.' });
        }
        
        // Cập nhật các trường nếu chúng tồn tại trong req.body
        if (req.body.username != null) account.username = req.body.username;
        if (req.body.fullname != null) account.fullname = req.body.fullname;
        if (req.body.phone != null) account.phone = req.body.phone;
        if (req.body.address != null) account.address = req.body.address;
        if (req.body.role != null) account.role = req.body.role;

        // Lưu ý: Nếu muốn cập nhật password, cần hash lại password mới.
        
        const updatedAccount = await account.save();
        res.json({ message: "Cập nhật thành công!", account: updatedAccount });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa tài khoản theo UserID
router.delete("/:userID", async (req, res) => {
    try {
        const result = await Account.deleteOne({ UserID: req.params.userID });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản để xóa.' });
        }
        res.json({ message: 'Xóa tài khoản thành công.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Tìm kiếm tài khoản
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    try {
        // $or cho phép tìm kiếm trong nhiều trường
        const accounts = await Account.find({
            $or: [
                { username: { $regex: q, $options: "i" } },
                { fullname: { $regex: q, $options: "i" } }
            ]
        }).select('-password');

        if (accounts.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy tài khoản nào với từ khóa: ${q}` });
        }

        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;