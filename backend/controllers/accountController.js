const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Cấu hình gửi mail (Lấy từ .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const accountController = {

    // 1. Đăng ký
    register: async (req, res) => {
        try {
            const { username, password, fullname, phone, address } = req.body;

            const existingUser = await Account.findOne({ username });
            if (existingUser) return res.status(400).json({ message: "Email này đã tồn tại!" });

            const newAccount = new Account({
                username, password, fullname, phone, address,
                role: 'customer' // Mặc định là khách
            });

            await newAccount.save();
            res.status(201).json({ message: "Đăng ký thành công!", account: newAccount });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2. Đăng nhập (Cấp Token)
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await Account.findOne({ username });
            
            if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại" });
            if (user.password !== password) return res.status(401).json({ message: "Sai mật khẩu!" });
            if (user.isBanned) return res.status(403).json({ message: "Tài khoản đã bị xóa!" });

            // Tạo Token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                message: "Đăng nhập thành công",
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 3. Quên mật khẩu
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await Account.findOne({ username: email });
            if (!user) return res.status(404).json({ message: "Email chưa đăng ký!" });

            // Tạo pass ngẫu nhiên 6 ký tự
            const newPassword = Math.random().toString(36).slice(-6);
            user.password = newPassword;
            
            // Xóa token cũ nếu có (để sạch sẽ)
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            
            await user.save();

            // Gửi mail
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Mật khẩu mới - Bookworm Paradise',
                text: `Mật khẩu mới của bạn là: ${newPassword}`
            });

            res.json({ message: "Đã gửi mật khẩu mới vào email!" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi gửi mail: " + err.message });
        }
    },

    // --- PHẦN QUẢN LÝ (CẦN MIDDLEWARE BẢO VỆ) ---

    // 4. Lấy tất cả user (Chỉ Admin)
    getAllAccounts: async (req, res) => {
        try {
            const accounts = await Account.find().select('-password');
            res.json(accounts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 5. Lấy user theo ID (Xem profile)
    getAccountById: async (req, res) => {
        try {
            const account = await Account.findById(req.params.id).select('-password');
            if (!account) return res.status(404).json({ message: 'Không tìm thấy user' });
            res.json(account);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 6. Cập nhật thông tin (Có upload avatar)
    updateAccount: async (req, res) => {
        try {
            const updateData = { ...req.body };
            if (req.file) updateData.avatar = req.file.path; // Nếu có file ảnh

            const account = await Account.findByIdAndUpdate(req.params.id, updateData, { new: true });
            res.json({ message: "Cập nhật thành công!", account });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 7. Ban user (Chỉ Admin)
    banAccount: async (req, res) => {
        try {
            await Account.findByIdAndUpdate(req.params.id, { isBanned: true });
            res.json({ message: "Đã khóa tài khoản thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    
    // 8. Xóa user (Chỉ Admin)
    deleteAccount: async (req, res) => {
        try {
            await Account.findByIdAndDelete(req.params.id);
            res.json({ message: "Đã xóa tài khoản vĩnh viễn" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = accountController;